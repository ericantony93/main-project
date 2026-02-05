from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import BaseProduct, SensorAddon, Order, Device, SensorReading
from .serializers import PriceRequestSerializer,OrderCreateSerializer, SensorAddonSerializer
import razorpay
from django.conf import settings
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes

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

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        base = BaseProduct.objects.first()
        if not base:
            return Response({"error": "Base product not configured"}, status=500)

        serializer = OrderCreateSerializer(
            data=request.data,
            context={
                'request': request,
                'base_price': base.base_price
            }
        )
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        return Response({
            "order_id": order.id,
            "total_price": order.total_price,
            "is_paid": order.is_paid
        })

class CreatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, user=request.user, is_paid=False)
        except Order.DoesNotExist:
            return Response({"error": "Invalid order"}, status=404)

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        rp_order = client.order.create({
            "amount": int(order.total_price * 100),  # paise
            "currency": "INR",
            "payment_capture": 1
        })

        order.payment_reference = rp_order["id"]
        order.save()

        return Response({
            "razorpay_order_id": rp_order["id"],
            "amount": order.total_price,
            "currency": "INR",
            "key": settings.RAZORPAY_KEY_ID
        })

class SensorDataIngestView(APIView):
    permission_classes = [AllowAny]  # device-level auth later

    def post(self, request):
        device_id = request.data.get("device_id")

        try:
            device = Device.objects.get(device_id=device_id)
        except Device.DoesNotExist:
            return Response({"error": "Invalid device"}, status=404)

        SensorReading.objects.create(
            device=device,
            pm25=request.data.get("pm25"),
            gas=request.data.get("gas"),
            temperature=request.data.get("temperature"),
            humidity=request.data.get("humidity"),
        )

        return Response({"status": "data recorded"})
    
def calculate_aqi(pm25):
    if pm25 is None:
        return None, "No data"

    if pm25 <= 30:
        return pm25, "Good"
    elif pm25 <= 60:
        return pm25, "Moderate"
    elif pm25 <= 90:
        return pm25, "Poor"
    else:
        return pm25, "Very Poor"

class DashboardView(APIView):
    authentication_classes = [JWTAuthentication]   # ✅ ADD THIS
    permission_classes = [IsAuthenticated]

    def get(self, request):
        device = Device.objects.filter(user=request.user).first()
        if not device:
            return Response({"error": "No device found"}, status=404)

        latest = SensorReading.objects.filter(device=device).order_by('-created_at').first()
        if not latest:
            return Response({"error": "No sensor data"}, status=404)

        aqi_value, status = calculate_aqi(latest.pm25)

        return Response({
            "device_id": device.device_id,
            "aqi": aqi_value,
            "status": status,
            "latest_readings": {
                "pm25": latest.pm25,
                "gas": latest.gas,
                "temperature": latest.temperature,
                "humidity": latest.humidity,
                "timestamp": latest.created_at
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
