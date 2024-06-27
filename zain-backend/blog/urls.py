"""
URL configuration for the blog app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from blog import views
from graphene_django.views import GraphQLView
from .schema import schema

urlpatterns = [
    path('graphql/', GraphQLView.as_view(graphiql=True, schema=schema)),
]

# Create a router for API endpoints
router = DefaultRouter()
router.register('posts/popular', views.PostViewPopular, basename='post-popular')
router.register('posts/trending', views.PostViewTrending, basename='post-trending')
router.register('posts/top', views.TopPosts, basename='posts-top')
router.register('posts/featured', views.FeaturedPosts, basename='posts-featured')
router.register('posts/details', views.Postswithoutpagination, basename='post-details')
router.register('posts', views.PostViewSet, basename='post')
router.register(r'posts/(?P<post_id>\d+)/likes', views.LikeViewSet, basename='post-likes')
router.register(r'posts/(?P<post_id>\d+)/comments', views.CommentViewSet, basename='post-comments')
router.register('tags', views.TagViewSet, basename='tag')
router.register('categories', views.CategoryViewSet, basename='category')
router.register(r'post-search', views.PostDocumentViewSet, basename='post-search')

urlpatterns = [
    path('', include(router.urls)),
    path('user-votes/<int:post_id>', views.UserVoteView.as_view(), name='user-votes'),
    # path('first-post-id/', views.FirstPostIdView.as_view(), name='first-post-id'),
    path('fisrt-post-id/', GraphQLView.as_view(graphiql=True, schema=schema)),
    
    # # new urls
    # path('posts-s/<int:post_id>/', views.CommentApiView.as_view(), name='c'),
]
