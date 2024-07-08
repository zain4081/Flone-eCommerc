"""
Serializers for the commerce app.
.
"""
import datetime
from rest_framework import serializers
from commerce.models import Product

class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for the Product model.
    """

    # Define a custom field for pricedict
    pricedict = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_pricedict(self, obj):
        """
        Method to get pricedict for a Product instance.

        Args:
            obj (Product): Instance of Product model.

        Returns:
            dict: Dictionary containing prices in different currencies.
                  Keys: "USD", "EUR", "GBP".
             
                  Values: Converted prices.
        """
        price_eur = obj.price * 0.93
        price_gbp = obj.price * 0.79
        return {
            "USD": obj.price,
            "EUR": price_eur,
            "GBP": price_gbp  
        }
class PurchaseSerializer(serializers.Serializer):
    """
    Serializer for the Purchase model.
    """
    class Meta:
        model = Product
        fields = "__all__"
