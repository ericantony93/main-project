from django.urls import path
from .views import CreatePaymentIntent, OrderDetailView, PaymentSuccessView, PriceView, CreateOrderView,SensorDataIngestView,DashboardView,DashboardHistoryView, SensorAddonList,sensor_addons, stripe_webhook,CreateCheckoutSession
urlpatterns = [
    path('price/', PriceView.as_view()),
    path('order/', CreateOrderView.as_view()),
    path('sensor-data/', SensorDataIngestView.as_view()),
    path('dashboard/', DashboardView.as_view()),
    path('dashboard/history/', DashboardHistoryView.as_view()),
    path('addons/', sensor_addons,name="sensor_addons"),
    path("create-payment-intent/", CreatePaymentIntent.as_view()),
    path("order/<int:order_id>/", OrderDetailView.as_view()),
    path("create-checkout/", CreateCheckoutSession.as_view()),
    path("stripe/webhook/", stripe_webhook),
    path("payment-success/", PaymentSuccessView.as_view()),
]   
