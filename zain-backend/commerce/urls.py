"""
URL configuration for the commerce app.
"""
from rest_framework.routers import DefaultRouter

from django.urls import path, include
from commerce.views import (
    ProducttListView,
    ProductDetails,
    CreateSessionCart,
    PaymentSuccessful,
    ProductsUploadView
    )
router = DefaultRouter()
router.register('product-upload', ProductsUploadView, basename='post-popular')
urlpatterns = [
    path('', include(router.urls)),
    path('list/', ProducttListView.as_view(), name='products'),
    path('product/<int:pk>/', ProductDetails.as_view(), name='product'),
    path('product/checkout/', CreateSessionCart.as_view(), name='checkout'),
    path('payment/success/' , PaymentSuccessful.as_view()),
]

