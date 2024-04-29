from collections import Counter
from django.shortcuts import render
from blog.models import *
from blog.serializer import *
from rest_framework import viewsets, generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from blog.paginator import default_paginator
from datetime import timedelta
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
import json


# Create your views here.

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.prefetch_related('post_likes')
    serializer_class = PostSerializer
    pagination_class = default_paginator
    filter_backends = [filters.SearchFilter]
    search_fields = ['tag__id']
    
    def get_queryset(self):
        queryset = Post.objects.all()
        tags_param = self.request.query_params.get('tags')
        category_param = self.request.query_params.get('category')
        if tags_param:
            try:
                tag_list = json.loads(tags_param)
                # Create a Q object to filter by each tag ID
                tag_filter = Q()
                for tag_id in tag_list:
                    tag_filter |= Q(tag__id=tag_id)
                queryset = queryset.filter(tag_filter)
            except json.JSONDecodeError:
                pass  # Handle invalid JSON format for tags parameter
        if category_param:
            try:
                category_list = json.loads(category_param)
                # Create a Q object to filter by each tag ID
                category_filter = Q()
                for category_id in category_list:
                    category_filter |= Q(category__id=category_id)
                queryset = queryset.filter(category_filter)
            except json.JSONDecodeError:
                pass  # Handle invalid JSON format for tags parameter
            
        return queryset
    
    
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
    

        
class UserVoteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id, format=None):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"message": "Post does not exist."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        like = Like.objects.filter(post=post, user=user).first()
        if like:
            serializer = LikeSerializer(like)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "User has not voted on this post."}, status=status.HTTP_404_NOT_FOUND)

    


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()

class LikeViewSet(viewsets.ModelViewSet):
    serializer_class = LikeSerializer
    queryset = Like.objects.all()



    