from django.urls import path, include
from rest_framework.routers import DefaultRouter
from blog import views
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register('posts/popular', views.PostViewPopular, basename='post-popular')
router.register('posts/trending', views.PostViewTrending, basename='post-trending')
router.register('posts', views.PostViewSet, basename='post')
router.register('posts_top', views.TopPosts, basename='top_post')
router.register('posts_featured', views.FeaturedPosts, basename='featured_post')
router.register('posts_wp', views.Postswithoutpagination, basename='post_wp')
router.register(r'posts/(?P<post_id>\d+)/comments', views.CommentViewSet, basename='post-comments')
router.register(r'posts/(?P<post_id>\d+)/likes', views.LikePostSet, basename='post-likes')
# comments


urlpatterns = [
    path('posts/create/', views.AdminImageUpload.as_view(), name='post_create'),
    path('first-post-id/', views.FirstPostIdView.as_view(), name='first-post-id'),

]

urlpatterns += router.urls
