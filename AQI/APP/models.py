from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    phone_number = models.CharField(max_length=15, blank=True)
    city = models.CharField(max_length=100, blank=True)
    building_name = models.CharField(max_length=150, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

class UserSettings(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="settings"
    )

    aqi_alerts_enabled = models.BooleanField(default=True)
    alert_threshold = models.IntegerField(default=100)

    temperature_unit = models.CharField(
        max_length=10,
        choices=[
            ("C", "Celsius"),
            ("F", "Fahrenheit")
        ],
        default="C"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Settings for {self.user.username}"

class Room(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="rooms"
    )

    name = models.CharField(max_length=100)   # e.g. Bedroom, Office
    floor = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"
    
class Sensor(models.Model):
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="sensors"
    )

    SENSOR_TYPES = [
        ("PM", "Particulate Matter"),
        ("CO2", "Carbon Dioxide"),
        ("VOC", "Volatile Organic Compounds"),
        ("TEMP", "Temperature"),
        ("HUM", "Humidity"),
    ]

    sensor_type = models.CharField(max_length=10, choices=SENSOR_TYPES)
    is_active = models.BooleanField(default=True)

    installed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sensor_type} - {self.room.name}"

class AQIStatus(models.Model):
    room = models.OneToOneField(
        Room,
        on_delete=models.CASCADE,
        related_name="aqi_status"
    )

    aqi_value = models.IntegerField()
    category = models.CharField(max_length=50)   # Good, Moderate, Poor
    dominant_pollutant = models.CharField(max_length=50, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.room.name} - AQI {self.aqi_value}"

class AQIAlert(models.Model):
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="alerts"
    )

    aqi_value = models.IntegerField()
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alert - {self.room.name}"
class AQIReading(models.Model):
    sensor = models.ForeignKey(
        Sensor,
        on_delete=models.CASCADE,
        related_name="readings"
    )

    value = models.FloatField()
    unit = models.CharField(max_length=20, blank=True)

    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sensor.sensor_type}: {self.value}"
