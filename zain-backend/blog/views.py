"""
Module: views.py
Description: Contains Django views for the blog app.
"""
from datetime import timedelta
import json

from django.db.models import Count, Q
from django.core.cache import cache
from django.http import HttpResponseServerError
from django.utils import timezone
from django.utils.dateparse import parse_date
from django.utils.translation import gettext_lazy as _

from rest_framework import filters, generics, status, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

CACHE_TTL = 60 * 1500

from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl_drf.filter_backends import (
    SearchFilterBackend,
    FilteringFilterBackend,
    SuggesterFilterBackend,
    FunctionalSuggesterFilterBackend
)
from django_elasticsearch_dsl_drf.constants import SUGGESTER_COMPLETION
from blog.models import Post, Comment, Like, Tag, Category
from blog.paginator import DefaultPaginator, NoPagination
from blog.serializer import (
    PostSerializer,
    CommentSerializer,
    LikeSerializer,
    CategorySerializer,
    FirstPostIdSerializer,
    TagSerializer,
    PostDocumentSerializer
)
from blog.document import PostDocument

class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be viewed or edited.
    """
    queryset = Post.objects.prefetch_related('post_likes').order_by('-date') 
    serializer_class = PostSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'tag__id',
        '^tag__name',
        'tag__name',
        '^category__name',
        'category__name',
        '^title', 'title'
    ]
    filterset_fields = ['category', 'tags', 'created_at']
    parser_classes = [MultiPartParser, FormParser]
    
    def get_pagination_class(self):
        """
        Allow Parm "paginate=false" to return data without pagination
        """
        paginate_param = self.request.query_params.get('paginate')
        print("paginate_param",paginate_param)
        if paginate_param and paginate_param.lower() == 'false':
            print("paginate_param",paginate_param)
            return NoPagination
        return DefaultPaginator
    pagination_class = property(fget=get_pagination_class)

    def get_queryset(self):
        """
        Optionally restricts the returned posts to a given tag ID, category ID,
        start and end date range.
        """
        queryset = Post.objects.all()
        # Implement Cache on filterbase and also on all posts--
        cache_key = 'posts_{}_{}_{}_{}'.format(
            self.request.query_params.get('tags', ''),
            self.request.query_params.get('category', ''),
            self.request.query_params.get('start_date', ''),
            self.request.query_params.get('end_date', '')
        )
        cached_queryset = cache.get(cache_key)
        if cached_queryset:
            print("returning Cached Data")
            return cached_queryset
        tags_param = self.request.query_params.get('tags')
        category_param = self.request.query_params.get('category')
        if tags_param:
            try:
                tag_list = json.loads(tags_param)
                tag_filter = Q()
                for tag_id in tag_list:
                    tag_filter |= Q(tag__id=tag_id)
                queryset = queryset.filter(tag_filter)
            except json.JSONDecodeError:
                pass
        if category_param:
            try:
                category_list = json.loads(category_param)
                category_filter = Q()
                for category_id in category_list:
                    category_filter |= Q(category__id=category_id)
                queryset = queryset.filter(category_filter)
            except json.JSONDecodeError:
                pass
        start_date_param = self.request.query_params.get('start_date')
        end_date_param = self.request.query_params.get('end_date')
        print("end_date", end_date_param)
        if (start_date_param and end_date_param):
            start_date = parse_date(start_date_param)
            end_date = parse_date(end_date_param)
            end_date += timedelta(days=1)
            if start_date and end_date:
                queryset = queryset.filter(date__range=(start_date, end_date))
        elif start_date_param:
            start_date = parse_date(start_date_param)
            if start_date:
                queryset = queryset.filter(date__gte=start_date)
        elif end_date_param:
            end_date = parse_date(end_date_param)
            end_date += timedelta(days=1)
            if end_date:
                queryset = queryset.filter(date__lte=end_date)
        cache.set(cache_key, queryset, CACHE_TTL)
        return queryset

class PostViewTrending(viewsets.ModelViewSet):
    """
    API endpoint that allows trending posts to be viewed.
    """
    serializer_class = PostSerializer
    def get_queryset(self):
        """
            override get_querset to get Trending Post. access posts which are recently accessed by useres
        """
        try:
            queryset = Post.objects.filter(
                comments__date__gte=timezone.now() - timedelta(days=7)
                ).distinct()[:3].prefetch_related('post_likes')
            return queryset
        except Exception as e:
            return Response({"errors": e}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)

class PostViewPopular(viewsets.ModelViewSet):
    """
    API endpoint that allows popular posts to be viewed.
    """
    
    serializer_class = PostSerializer
    def get_queryset(self):
        """
            override get_querset to get Populer Post. access posts which comments and likes are high
        """
        try:
            queryset = Post.objects.annotate(
                like_count=Count('post_likes')).order_by('-like_count')[:3].prefetch_related('post_likes')
            return queryset
        except Exception as e:
            return Response({"errors": e}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)


class FirstPostIdView(generics.ListAPIView):
    """
    API endpoint that returns the ID of the first post.
    """
    serializer_class = FirstPostIdSerializer

    def get_queryset(self):
        """
        Returns the queryset for the first post ID.
        """
        return Post.objects.all()[:1]

class Postswithoutpagination(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be viewed without pagination.
    """
    serializer_class = PostSerializer
    def get_queryset(self):
        """
            override get_querset to get Post witout pagination.
        """
        try:
            queryset = Post.objects.prefetch_related('post_likes')
            return queryset
        except Exception as e:
            return Response({"errors": e}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)

class TopPosts(viewsets.ModelViewSet):
    """
    API endpoint that allows top posts to be viewed.
    """
    serializer_class = PostSerializer
    pagination_class = DefaultPaginator
    def get_queryset(self):
        """
            override get_querset to get Top Posts.
        """
        try:
            queryset = Post.objects.filter(top=True).prefetch_related('post_likes').order_by('-date') 
            return queryset
        except Exception as e:
            return Response({"errors": e}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)

class FeaturedPosts(viewsets.ModelViewSet):
    """
    API endpoint that allows featured posts to be viewed.
    """
    serializer_class = PostSerializer
    pagination_class = DefaultPaginator
    def get_queryset(self):
        """
            override get_querset to get Feature Posts.
        """
        try:
            queryset = Post.objects.filter(featured=True).prefetch_related('post_likes') 
            return queryset
        except Exception as e:
            return Response({"errors": e}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)

class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows comments to be viewed or edited.
    """
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Returns Comments Objects for specific Post.
        """
        post_id = self.kwargs.get('post_id')
        return Comment.objects.filter(post_id=post_id)
    def list(self, request, post_id, *args, **kwargs):
        """
        Returns a list of comments and their replies
        """
        try:
            queryset = Comment.objects.filter( parent_comment__isnull=True, post_id=post_id).prefetch_related('comment_likes')
            count = queryset.count()
            serializer = CommentSerializer(queryset, many=True, context={'depth': 3})
            data = {
                'count': count,
                'comments': serializer.data,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": e}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class LikePostSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be liked.
    """
    serializer_class = LikeSerializer
    def get_queryset(self):
        """
        Returns the queryset for the likes of a specific post.
        """
        try:
            post_id = self.kwargs.get('post_id')
            queryset = Comment.objects.filter(post_id=post_id)
            return queryset
        except Exception as e:
            return Response({"errors": e}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
    def list(self, request, *args, **kwargs):
        """
        Returns the count of likes for a specific post.
        """
        try:
            queryset = self.get_queryset()
            count = queryset.count()
            data = {
                'count': count,
            }
            return Response(data)
        except Exception as e:
            return Response({"errors": e}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
class UserVoteView(APIView):
    """
    API endpoint for users to vote on posts.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id, format=None):# pylint: disable=redefined-builtin, unused-argument
        """
        Handles GET requests for retrieving a user's vote on a post.
        """
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"message": "Post does not exist."}, status=status.HTTP_404_NOT_FOUND)
        user = request.user
        like = Like.objects.filter(post=post, user=user).first()
        if like:
            serializer = LikeSerializer(like)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No vote found."}, status=status.HTTP_404_NOT_FOUND)

class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows categories to be viewed or edited.
    """
    
    serializer_class = CategorySerializer
    def get_queryset(self):
        """
        Returns the queryset for Category objects
        """
        try:
            return Category.objects.all()
        except Exception as e:
            return Response({"errors": e}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)

class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited.
    """
    
    serializer_class = TagSerializer
    def get_queryset(self):
        """
        Returns the queryset for Category objects
        """
        try:
            return Tag.objects.all()
        except Exception as e:
            return Response({"errors": e}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)

class LikeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows likes to be viewed or edited.
    """
    serializer_class = LikeSerializer
    def get_queryset(self):
        """
        Returns the queryset for Like objects
        """
        try:
            return Like.objects.all()
        except Exception as e:
            return Response({"errors": e}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class PostDocumentViewSet(DocumentViewSet):
    document = PostDocument
    serializer_class = PostDocumentSerializer
    
    filter_backends = [
        FilteringFilterBackend,
        SearchFilterBackend,
        SuggesterFilterBackend,
        FunctionalSuggesterFilterBackend
    ]
    search_fields = (
        'title',
    )
    filter_fields = {
        'category': 'category.id'
    }
    suggester_fields = {
        'title': {
            'field': 'title.suggest',
            'suggesters': [
                SUGGESTER_COMPLETION,
            ],
        },
    }


          
            
                



                        
                        
                
            


                