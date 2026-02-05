from django.contrib import admin
from .models import BaseProduct, SensorAddon, Order, Device, SensorReading

admin.site.register(BaseProduct)
admin.site.register(SensorAddon)
admin.site.register(Order)
admin.site.register(Device)
admin.site.register(SensorReading)