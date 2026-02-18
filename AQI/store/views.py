from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import BaseProduct, SensorAddon, Order, Device, SensorReading,SensorData
from .serializers import PriceRequestSerializer,OrderCreateSerializer, SensorAddonSerializer
from django.conf import settings
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes
import stripe
from decimal import Decimal
from rest_framework import status
from django.core.mail import send_mail

@api_view(["GET"])
@permission_classes([AllowAny])  # 👈 IMPORTANT (no auth needed to view addons)
def sensor_addons(request):
    addons = SensorAddon.objects.all()
    serializer = SensorAddonSerializer(addons, many=True)
    return Response(serializer.data)

class PriceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PriceRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        addon_codes = serializer.validated_data.get('addons', [])

        base = BaseProduct.objects.first()
        if not base:
            return Response({"error": "Base product not configured"}, status=500)

        total = base.base_price
        addons = SensorAddon.objects.filter(code__in=addon_codes)

        for addon in addons:
            total += addon.price

        return Response({
            "base_price": base.base_price,
            "addons": [{"code": a.code, "price": a.price} for a in addons],
            "total_price": total
        })


stripe.api_key = settings.STRIPE_SECRET_KEY
class CreatePaymentIntent(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")

        if not order_id:
            return Response(
                {"error": "order_id is required"},
                status=400
            )

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=404
            )

        amount = int(order.total_price) * 100  # INR → paise

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="inr",
            metadata={
                "order_id": order.id,
                "user_id": request.user.id
            }
        )

        return Response({
            "clientSecret": intent.client_secret,
            "amount": order.total_price
        })
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        addons_ids = data.get("addons", [])

        base = BaseProduct.objects.first()
        if not base:
            return Response({"error": "Base product not configured"}, status=500)

        total = Decimal(base.base_price)

        addons = SensorAddon.objects.filter(id__in=addons_ids)
        for addon in addons:
            total += addon.price

        order = Order.objects.create(
            user=user,
            full_name=data.get("full_name"),
            phone=data.get("phone"),
            address=data.get("address"),
            city=data.get("city"),
            state=data.get("state"),
            pincode=data.get("pincode"),
            total_price=total,
        )

        order.addons.set(addons)

        return Response(
            {
                "order_id": order.id,
                "total_price": str(total),
            },
            status=201
        )

class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = Order.objects.get(id=order_id, user=request.user)

        return Response({
            "id": order.id,
            "product": "Smart AQI Monitoring System",
            "total": order.total_price,   # ✅ FINAL TOTAL
        })
    
class SensorDataIngestView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):

        api_key = request.headers.get("X-API-KEY")

        if not api_key:
            return Response({"error": "API key missing"}, status=401)

        try:
            device = Device.objects.get(api_key=api_key)
        except Device.DoesNotExist:
            return Response({"error": "Invalid API key"}, status=403)

        data = request.data

        SensorData.objects.create(
    device=device,
    temperature=data.get("temperature"),
    humidity=data.get("humidity"),
)
        

        return Response({"message": "Data received"}, status=200)

from .utils import calculate_aqi  # adjust import if needed

class DashboardView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        latest = SensorData.objects.order_by("-timestamp").first()

        if not latest:
            return Response({"message": "No data yet"}, status=404)

        return Response({
            "latest_readings": {
                "temperature": latest.temperature,
                "humidity": latest.humidity,
                "pm25": None,
                "gas": None,
                "timestamp": latest.timestamp,
            }
        })
    
class DashboardHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        device = Device.objects.filter(user=request.user).first()
        if not device:
            return Response({"error": "No device found"}, status=404)

        readings = (
            SensorReading.objects
            .filter(device=device)
            .order_by('-created_at')[:20]
        )

        data = []
        for r in readings:
            aqi, status = calculate_aqi(r.pm25)
            data.append({
                "timestamp": r.created_at,
                "pm25": r.pm25,
                "aqi": aqi,
                "status": status
            })

        return Response({
            "device_id": device.device_id,
            "history": list(reversed(data))
        })

class SensorAddonList(APIView):
    def get(self, request):
        addons = SensorAddon.objects.all()
        serializer = SensorAddonSerializer(addons, many=True)
        return Response(serializer.data)

class SensorAddonListView(ListAPIView):
    queryset = SensorAddon.objects.all()
    serializer_class = SensorAddonSerializer
    permission_classes = [AllowAny]

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSession(APIView):
    permission_classes = []

    def post(self, request):
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "inr",
                    "product_data": {
                        "name": "Smart AQI Monitoring System",
                    },
                    "unit_amount": 499900,  # ₹4999 in paise
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url="http://localhost:5173/payment-success",
            cancel_url="http://localhost:5173/payment-cancel",
        )

        return Response({"url": session.url})
    
from django.core.mail import send_mail
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except Exception:
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        customer_email = session.get("customer_details", {}).get("email")

        # Mark order paid here (if using Order model)

        send_mail(
            subject="Payment Successful - Smart AQI System",
            message="Your payment of ₹4999 was successful. Thank you for your purchase.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[customer_email],
        )

    return HttpResponse(status=200)


stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentSuccessView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")
        payment_intent_id = request.data.get("payment_intent")

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        # 🔹 Verify with Stripe
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)

        if intent.status != "succeeded":
            return Response({"error": "Payment not verified"}, status=400)

        # 🔹 Mark order as paid
        order.is_paid = True
        order.save()

        # 🔹 Send email receipt
        send_mail(
            subject="Payment Successful - Smart AQI System",
            message=f"""
Thank you for your purchase.

Order ID: {order.id}
Amount Paid: ₹{order.total_price}

Your payment has been successfully processed.
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[request.user.email],
        )

        return Response({"message": "Payment verified"})