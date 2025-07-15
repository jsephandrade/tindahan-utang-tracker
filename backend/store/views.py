from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import (
    Customer,
    Payment,
    Product,
    Transaction,
    TransactionItem,
    UtangRecord,
)
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

    def create(self, request, *args, **kwargs):
        # Extract nested transaction items if provided
        items_data = request.data.pop('items', [])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        transaction = serializer.save()

        # Create associated transaction items
        for item in items_data:
            TransactionItem.objects.create(
                transaction=transaction,
                product_id=item.get('product')
                or item.get('product_id')
                or item.get('productId'),
                quantity=item.get('quantity'),
                price=item.get('price'),
                total=item.get('total'),
            )

        headers = self.get_success_headers(serializer.data)
        # Serialize again to include created items in the response
        response_serializer = self.get_serializer(transaction)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

class UtangRecordViewSet(viewsets.ModelViewSet):
    queryset = UtangRecord.objects.all()
    serializer_class = UtangRecordSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer