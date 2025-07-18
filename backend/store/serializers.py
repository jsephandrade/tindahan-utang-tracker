from rest_framework import serializers
from .models import Customer, Payment, Product, Transaction, TransactionItem, UtangRecord

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class TransactionItemSerializer(serializers.ModelSerializer):
    """Serialize TransactionItem with product name and id for frontend."""
    product_id = serializers.UUIDField(source="product.id", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    class Meta:
        model = TransactionItem
        fields = [
            "id",
            "transaction",
            "product",
            "product_id",
            "product_name",
            "quantity",
            "price",
            "total",
        ]

class TransactionSerializer(serializers.ModelSerializer):
    items = TransactionItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'

class UtangRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = UtangRecord
        fields = '__all__'
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'