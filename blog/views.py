from collections import Counter
from django.shortcuts import render
from blog.models import *
from blog.serializer import *
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from blog.paginator import default_paginator
from datetime import timedelta
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated



# Create your views here.

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.prefetch_related('post_likes')
    serializer_class = PostSerializer
    pagination_class = default_paginator
    
    
class PostViewTrending(viewsets.ModelViewSet):
    queryset = Post.objects.filter(comments__date__gte=timezone.now() - timedelta(days=7)).distinct()[:3].prefetch_related('post_likes')
    serializer_class = PostSerializer

class PostViewPopular(viewsets.ModelViewSet):
    queryset = Post.objects.annotate(like_count=Count('post_likes')).order_by('-like_count')[:3].prefetch_related('post_likes')
    serializer_class = PostSerializer
    
    
class FirstPostIdView(generics.ListAPIView):
    serializer_class = FirstPostIdSerializer

    def get_queryset(self):
        return Post.objects.all()[:1]
    

class AdminImageUpload(APIView):
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request, format=None):
        print(request.data)
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
class Postswithoutpagination(viewsets.ModelViewSet):
    queryset = Post.objects.prefetch_related('post_likes')
    serializer_class = PostSerializer
    
class TopPosts(viewsets.ModelViewSet):
    queryset = Post.objects.filter(top=True).prefetch_related('post_likes')
    serializer_class = PostSerializer
    pagination_class = default_paginator

class FeaturedPosts(viewsets.ModelViewSet):
    queryset = Post.objects.filter(featured=True).prefetch_related('post_likes')
    serializer_class = PostSerializer
    pagination_class = default_paginator
    
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return Comment.objects.filter(post_id=post_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().prefetch_related('comment_likes')
        count = queryset.count()
        serializer = self.get_serializer(queryset, many=True, context={'depth': 3})
        
        data = {
            'count': count,
            'comments': serializer.data,
        }
        return Response(data)
    
    

class LikePostSet(viewsets.ModelViewSet):
    serializer_class = LikeSerializer
    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return Comment.objects.filter(post_id=post_id)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        count = queryset.count()
        
        data = {
            'count': count,
        }
        return Response(data)
    

        
    

# # class CategoryViewSet(viewsets.ModelViewSet):
# #     serializer_class = CategorySerializer
# #     queryset = Category.objects.all()

# # class TagViewSet(viewsets.ModelViewSet):
# #     serializer_class = TagSerializer
# #     queryset = Tag.objects.all()

# class LikeViewSet(viewsets.ModelViewSet):
#     serializer_class = LikeSerializer
#     queryset = Like.objects.all()



    