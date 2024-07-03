import stripe
import os
import json
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from .serializer import ProductSerializer

class ProducttListView(APIView):
    """
    Product list view for retrieving all Products.
    """
    def get(self, request):
        """
        Retrieve all products.

        Returns:
            Response: List of all products with their details.
        """
        try:
            products = Product.objects.all()
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductDetails(APIView):
    """
    Product details view by product ID.
    """
    def get(self, request, pk):
        """
        Retrieve details of a product by ID.

        Args:
            pk (int): Product ID.

        Returns:
            Response: JSON object containing product details.
        """
        try:
            product = Product.objects.get(pk=pk)
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreateSessionCart(APIView):
    """
    Create a checkout session for e-commerce items payment integration (Stripe).
    """
    def post(self, request):
        """
        Create a checkout session for purchasing products.

        Args:
            request (Request): HTTP POST request containing 'products' and 'currency'.

        Returns:
            Response: JSON object with a URL to redirect for payment.
        """
        domain = os.environ.get('WEBSITE')
        products = request.data["products"]
        currency = request.data["currency"]
        stripe.api_key = settings.STRIPE_SECRET_KEY
        price_id = ''
        if currency == 'USD':
            price_id = 'price_id'
        elif currency == 'EUR':
            price_id = 'price_id_eur'
        else:
            price_id = 'price_id_gbp'

        line_products = []
        relevant_products = []
        for product in products:
            relevant_products.append({
                'id': product['id'], 'quantity': product['quantity']
            })
            line_products.append({
                'price': product[price_id],
                'quantity': product['quantity'],
            })

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_products,
                mode='payment',
                success_url=domain + '/payment/{CHECKOUT_SESSION_ID}?payment=checkout&success=true',
                cancel_url=domain + '/payment/?payment=checkout?success=false',
                metadata={
                    'items': json.dumps(relevant_products)
                }
            )
            return Response({'url': checkout_session.url}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PaymentSuccessful(APIView):
    """
    Handle successful payment webhook from Stripe.
    """
    def post(self, request):
        """
        Update product sales count and stock after successful payment.

        Args:
            request (Request): HTTP POST request containing 'method' and 'session_id'.

        Returns:
            Response: Success message or error if update fails.
        """
        payment_method = request.data['method']
        session_id = request.data['session_id']
        session = stripe.checkout.Session.retrieve(session_id)
        if payment_method == 'checkout':
            try:
                products = json.loads(session.metadata.get('items'))
                for product in products:
                    product_obj = Product.objects.get(id=product['id'])
                    product_obj.salesCount += product['quantity']
                    product_obj.stock -= product['quantity']
                    product_obj.save()
                return Response({'msg': 'Product Updated Successfully'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


