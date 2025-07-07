from django.db import models
from django.core.validators import MinValueValidator
from django.db.models import F

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name
    
class Supplier(models.Model):
    name = models.CharField(max_length=200, unique=True)
    contact_info = models.TextField()

    def __str__(self):
        return self.name
    
class ProductQuerySet(models.QuerySet):
    def low_stock(self):
        return self.filter(stock_lte=F('minimum_stock'))
    
class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    minimum_stock = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    barcode = models.CharField(max_length=200, unique=True, db_index=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ProductQuerySet.as_manager()

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['price']),
        ]

    def __str__(self):
        return f"{self.name} ({self.category.name})"
    
    @property
    def is_low_stock(self):
        return self.stock <= self.minimum_stock