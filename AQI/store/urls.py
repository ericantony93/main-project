from django.urls import path
from .views import CreatePaymentIntent, OrderDetailView, PriceView, CreateOrderView,SensorDataIngestView,DashboardView,DashboardHistoryView, SensorAddonList,sensor_addons

urlpatterns = [
    path('price/', PriceView.as_view()),
    path('order/', CreateOrderView.as_view()),
    path('sensor-data/', SensorDataIngestView.as_view()),
    path('dashboard/', DashboardView.as_view()),
    path('dashboard/history/', DashboardHistoryView.as_view()),
    path('addons/', sensor_addons,name="sensor_addons"),
    path("create-payment-intent/", CreatePaymentIntent.as_view()),
    path("order/<int:order_id>/", OrderDetailView.as_view()),
]   
