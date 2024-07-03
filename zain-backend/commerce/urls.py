"""
URL configuration for the commerce app.
"""
from django.urls import path
from commerce.views import (
    ProducttListView,
    ProductDetails,
    CreateSessionCart,
    PaymentSuccessful
    )

urlpatterns = [
    path('list/', ProducttListView.as_view(), name='products'),
    path('product/<int:pk>/', ProductDetails.as_view(), name='product'),
    path('product/checkout/', CreateSessionCart.as_view(), name='checkout'),
    path('payment/success/' , PaymentSuccessful.as_view()),
]
