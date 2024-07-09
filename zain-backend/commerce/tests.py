from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from commerce.models import Product
from blog.models import Category
import json

class ProducttListViewTestCase(TestCase):
    def setUp(self):
        # Create test products for the list view
        self.cat1 = Category.objects.create(name='cat1')
        self.cat2 = Category.objects.create(name='cat2')
        self.product1 = Product.objects.create(name='Test Product 1', price=100.0, stock=10, salesCount=1, discount=1, Category=self.cat1)
        self.product2 = Product.objects.create(name='Test Product 2', price=50.0, stock=5, salesCount=3, discount=2, Category=self.cat2)
    
    def test_product_list_view(self):
        url = reverse('products')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Assuming you have 2 products in the test database
