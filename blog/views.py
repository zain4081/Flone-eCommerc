from collections import Counter
from django.shortcuts import render
from blog.models import *
from blog.serializer import *
from rest_framework import viewsets, status
from rest_framework.response import Response
from blog.paginator import default_paginator
from datetime import timedelta
from django.utils import timezone


# Create your views here.

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.prefetch_related('post_likes')
    serializer_class = PostSerializer
    pagination_class = default_paginator
    
    def get_popular_posts(self):
        # Most Popular Posts ( fetching through likes count)
        popular_posts = Post.objects.annotate(like_count=Count('post_likes')).order_by('-like_count')[:3]
        return popular_posts

    def get_trending_posts(self):
        # Trending Posts (selecting those posts which are being commented or liked recently)
        trending_posts = Post.objects.filter(comments__date__gte=timezone.now() - timedelta(days=7)).distinct()[:3]
        print(trending_posts)
        return trending_posts

    def list_popular_posts(self, request):
        popular_posts = self.get_popular_posts()
        serializer = PostSerializer(popular_posts, many=True)
        return Response(serializer.data)

    def list_trending_posts(self, request):
        trending_posts = self.get_trending_posts()
        serializer = PostSerializer(trending_posts, many=True)
        return Response(serializer.data)
    
    
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
    
    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return Comment.objects.filter(post_id=post_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().prefetch_related('comment_likes')
        count = queryset.count()
        serializer = self.get_serializer(queryset, many=True)
        
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



    