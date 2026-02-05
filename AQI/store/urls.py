from django.urls import path
from .views import PriceView, CreateOrderView, CreatePaymentView,SensorDataIngestView,DashboardView,DashboardHistoryView, SensorAddonList,sensor_addons

urlpatterns = [
    path('price/', PriceView.as_view()),
    path('order/', CreateOrderView.as_view()),
    path('pay/<int:order_id>/', CreatePaymentView.as_view()),
    path('sensor-data/', SensorDataIngestView.as_view()),
    path('dashboard/', DashboardView.as_view()),
    path('dashboard/history/', DashboardHistoryView.as_view()),
    path('addons/', sensor_addons,name="sensor_addons"),
]   
