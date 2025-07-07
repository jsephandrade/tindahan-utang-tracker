from rest_framework import viewsets
from .models import Customer, Payment, Product, Transaction, UtangRecord
from .serializers import (
    CustomerSerializer,
    PaymentSerializer,
    ProductSerializer,
    TransactionSerializer,
    UtangRecordSerializer,
)
# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class UtangRecordViewSet(viewsets.ModelViewSet):
    queryset = UtangRecord.objects.all()
    serializer_class = UtangRecordSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer