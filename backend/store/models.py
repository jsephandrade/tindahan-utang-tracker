# store/models.py
import uuid
from django.db import models


class Product(models.Model):
    """Inventory item available for sale."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    min_stock = models.PositiveIntegerField()
    barcode = models.CharField(max_length=255, blank=True, null=True)
    supplier = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Customer(models.Model):
    """Store customer who can have outstanding utang (credit)."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50, blank=True, null=True)
    total_utang = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    last_transaction = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.name


class Transaction(models.Model):
    """A sale transaction which can be paid in cash or via utang."""
    PAYMENT_CHOICES = [
        ("cash", "Cash"),
        ("utang", "Utang"),
        ("partial", "Partial"),
    ]
    STATUS_CHOICES = [
        ("completed", "Completed"),
        ("pending", "Pending"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        Customer, related_name="transactions", on_delete=models.SET_NULL, blank=True, null=True
    )
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2)
    change = models.DecimalField(max_digits=12, decimal_places=2)
    utang_amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=7, choices=PAYMENT_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=9, choices=STATUS_CHOICES)

    def __str__(self):
        return f"Transaction {self.id}"


class TransactionItem(models.Model):
    """Individual items sold within a Transaction."""
    transaction = models.ForeignKey(
        Transaction, related_name="items", on_delete=models.CASCADE
    )
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


class UtangRecord(models.Model):
    """Record of outstanding credit (utang) for a transaction."""
    STATUS_CHOICES = [
        ("unpaid", "Unpaid"),
        ("partial", "Partial"),
        ("paid", "Paid"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        Customer, related_name="utang_records", on_delete=models.CASCADE
    )
    transaction = models.ForeignKey(
        Transaction, related_name="utang_records", on_delete=models.CASCADE
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    due_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=7, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Utang {self.amount} ({self.status})"


class Payment(models.Model):
    """Payment made toward a UtangRecord."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    utang_record = models.ForeignKey(
        UtangRecord, related_name="payments", on_delete=models.CASCADE
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField()
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Payment {self.amount}"
