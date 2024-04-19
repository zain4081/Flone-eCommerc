from .models import *
from rest_framework import serializers
from django.db.models import Count
from django.conf import settings

class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()

    def get_likes_count(self, post):
        return Like.objects.filter(post=post).count()

    class Meta:
        model = Post
        fields = "__all__"
        

        
class RecursiveCommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    def get_likes_count(self, comment):
        return Like.objects.filter(comment=comment).count()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_replies(self, obj):
        replies = Comment.objects.filter(parent_comment=obj)
        serializer = RecursiveCommentSerializer(replies, many=True)
        return serializer.data
        
class CommentSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    replies = RecursiveCommentSerializer(many=True, read_only=True)

    def get_likes_count(self, comment):
        return Like.objects.filter(comment=comment).count()
    
    class Meta:
        model = Comment
        fields= "__all__"
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields= "__all__"

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields= "__all__"

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields= "__all__"


