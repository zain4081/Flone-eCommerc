from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from django.contrib.auth import get_user_model
from blog.models import Post, Category, Tag

class PostViewTrendingTests(TestCase):
    """
    Test cases for trending posts views in the blog app.
    """

    def setUp(self):
        """
        Setup method to create necessary objects for testing.
        """
        self.time = timezone.now()
        self.user = get_user_model().objects.create_user(
            email='test@example.com',
            name='Test User',
            role='editor',
            phone_number='+921234567890',
            max_otp_out=self.time,
            password='password123',
        )

        self.cat1 = Category.objects.create(name='cat1')
        self.cat2 = Category.objects.create(name='cat2')
        self.tag1 = Tag.objects.create(name='tag1')
        self.tag2 = Tag.objects.create(name='tag2')

        self.post1 = Post.objects.create(title='Post 1', content='Content 1', top=True, category=self.cat1)
        self.post1.tag.set([self.tag1])
        self.post2 = Post.objects.create(title='Post 2', content='Content 2', featured=True, category=self.cat2)
        self.post2.tag.set([self.tag2])
        self.post3 = Post.objects.create(title='Post 3', content='Content 3', category=self.cat2)
        self.post3.tag.set([self.tag1, self.tag2])

    def test_top_posts(self):
        """
        Test case to check retrieval of top posts.
        """
        self.client.force_login(self.user)
        url = reverse('posts-top-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
    def test_featured_posts(self):
        """
        Test case to check retrieval of featured posts.
        """
        self.client.force_login(self.user)
        url = reverse('posts-featured-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_posts_by_category(self):
        """
        Test case to check retrieval of posts by category.
        """
        self.client.force_login(self.user)
        url = reverse('post-list') + '?category=[' + str(self.cat1.pk) + ']'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_posts_by_tag(self):
        """
        Test case to check retrieval of posts by tag.
        """
        self.client.force_login(self.user)
        url = reverse('post-list') + '?tags=[' + str(self.tag1.pk) + ']'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
