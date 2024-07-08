import stripe
import os
import json
import pandas as pd
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from .serializer import ProductSerializer
from blog.models import Category, Tag, Subscriptions
User = get_user_model()
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
        try:
            payment_method = request.data['method']
            session_id = request.data['session_id']
            session = stripe.checkout.Session.retrieve(session_id)
            if payment_method == 'checkout':
                products = json.loads(session.metadata.get('items'))
                for product in products:
                    product_obj = Product.objects.get(id=product['id'])
                    product_obj.salesCount += product['quantity']
                    product_obj.stock -= product['quantity']
                    product_obj.save()
                return Response({'msg': 'Product Updated Successfully'}, status=status.HTTP_201_CREATED)
            if payment_method == 'subscribe':
                print("user", request.data['user'])
                user = User.objects.get(pk=request.data['user'])
                if user:
                    user.is_peremium = True
                    user.save()
                    print("user", user.is_peremium)
                    return Response({'msg': 'User updated Successfully'}, status=status.HTTP_201_CREATED)
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("error", e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductsUploadView(viewsets.ModelViewSet):
    """
    ViewSet for uploading products from a CSV or Excel file.

    This view accepts a file upload containing product data in CSV or Excel format,
    processes each row to create Product instances, assigns categories, and associates
    tags with each product.

    Supported file formats: .csv, .xlsx

    Example usage:
        POST /upload-products/
        Headers: {'Content-Type': 'multipart/form-data'}
        Body: {'file': <file>}

    Returns:
        - 201 Created: Products successfully uploaded.
        - 400 Bad Request: If no file is provided or if the file format is unsupported.
        - 500 Internal Server Error: If there's an unexpected error during processing.
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def create(self, request, *args, **kwargs):
        """
        Handle POST requests to upload product data from a file.

        Args:
            request: The request object containing the uploaded file.
            *args, **kwargs: Additional arguments passed to the method.

        Returns:
            Response: A Response object with a success or error message.
        """
        try:
            file = request.data.get('file')
            if not file:
                return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            if file.name.endswith('.csv'):
                data = pd.read_csv(file)
            elif file.name.endswith('.xlsx'):
                data = pd.read_excel(file)
            else:
                return Response({'error': 'Unsupported file format'}, status=status.HTTP_400_BAD_REQUEST)
            
            data.columns = data.columns.str.strip()
            
            for index, row in data.iterrows():
                try:
                    # Create or retrieve the Category
                    category, _ = Category.objects.get_or_create(name=row['category'].strip())
                    
                    # Create the Product instance
                    product = Product.objects.create(
                        short_description=row['short_description'],
                        description=row['description'],
                        price=row['price'],
                        name=row['name'],
                        discount=row['discount'],
                        image=row['image'],
                        stock=row['stock'],
                        price_id=row['price_id'],
                        price_id_eur=row['price_id_eur'],
                        price_id_gbp=row['price_id_gbp'],
                        salesCount=row['salesCount'],
                    )
                    
                    # Assign the Category to the Product
                    product.category.add(category)
                    
                    # Handle tags
                    if row['tag']:
                        tags = [tag.strip() for tag in row['tag'].split(',')]
                        for tag_name in tags:
                            tag, _ = Tag.objects.get_or_create(name=tag_name)
                            product.tag.add(tag)
                    
                    # Save the Product instance
                    product.save()
                    
                except Exception as e:
                    print(f"Error creating product: {e}")
            
            return Response({'message': 'Products Bulk Uploaded Successfully.'}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print(f"Error processing file: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class PremiumCheckoutSession(APIView):
    def post(self, request):
        price_id = request.data["price_id"]
        domain = os.environ.get('WEBSITE')
        user = request.user.id
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price': price_id,
                        'quantity': 1,
                    },
                ],
                mode='subscription',
                success_url=domain + '/payment/{CHECKOUT_SESSION_ID}?payment=subscribe&success=true&user='+str(user),
                cancel_url=domain + '/payment/?payment=checkout?success=false',
            )
        except Exception as e:
            print("e", e)
            return Response({'error': str(e)}, status=500)
        return Response(checkout_session.url)