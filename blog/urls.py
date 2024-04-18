from django.urls import path, include
from rest_framework.routers import DefaultRouter
from blog import views

router = DefaultRouter()
router.register('posts', views.PostViewSet, basename='post')
router.register('posts_top', views.TopPosts, basename='top_post')
router.register('posts_featured', views.FeaturedPosts, basename='featured_post')
router.register('posts_wp', views.Postswithoutpagination, basename='post_wp')
router.register(r'posts/(?P<post_id>\d+)/comments', views.CommentViewSet, basename='post-comments')
router.register(r'posts/(?P<post_id>\d+)/likes', views.LikePostSet, basename='post-likes')
# router.register('comments', views.CommentViewSet, basename='comment')
# router.register('categories', views.CategoryViewSet, basename='category')
# router.register('tags', views.TagViewSet, basename='Tag')
# router.register('likes', views.LikeViewSet, basename='Like')

urlpatterns = [
    path('posts/popular/', views.PostViewSet.as_view({'get': 'list_popular_posts'}), name='popular-posts'),
    path('posts/trending/', views.PostViewSet.as_view({'get': 'list_trending_posts'}), name='trending-posts'),
]

urlpatterns += router.urls