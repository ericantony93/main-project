from rest_framework import serializers
from .models import Order, SensorAddon

class PriceRequestSerializer(serializers.Serializer):
    addons = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )

class OrderCreateSerializer(serializers.Serializer):
    addons = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )

    def create(self, validated_data):
        user = self.context['request'].user
        addon_codes = validated_data.get('addons', [])

        addons = SensorAddon.objects.filter(code__in=addon_codes)

        base_price = self.context['base_price']
        total = base_price
        for addon in addons:
            total += addon.price

        order = Order.objects.create(
            user=user,
            total_price=total,
            is_paid=False
        )
        order.addons.set(addons)
        return order

class SensorAddonSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorAddon
        fields = ["id", "code", "name", "price"]
