"""
Serializers for the blog app.
.
"""
from rest_framework import serializers
from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from blog.models import Post, Like, Comment, Category, Tag, Subscriptions
from blog.document import PostDocument

class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for the Post model.
    """
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    tags_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField('get_image_url')
    image = serializers.ImageField(required=False, allow_null=True)
    def get_likes_count(self, post):
        """
        Get the number of likes for a post.

        Args:
            post: The Post object for which to get the likes count.

        Returns:
            int: The number of likes for the post.
        """
        return Like.objects.filter(post=post, status='like').count()
    def get_comments_count(self, post):
        """
        Get the number of comments for a post.
        Args:
            post: The Post object for which to get the comments count.

        Returns:
            int: The number of comments for the post.
        """
        return Comment.objects.filter(post=post).count()
    def get_tags_name(self, post):
        """
        Get the names of tags for a post.

        Args:
            post: The Post object for which to get the tags.

        Returns:
            list: A list of tag names for the post.
        """
        return [tag.name for tag in post.tag.all()]
    def get_image_url(self, obj):
        return obj.image.url
    class Meta:
        """
        PostSerialiezer Meta is contains all fields in Model
        """
        model = Post
        fields = "__all__"
class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Comment model.
    It includes the number of likes for each
    comment and recursively includes replies to each comment.
    """
    likes_count = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    def get_likes_count(self, comment):
        """
        Get the number of likes for a comment.

        Args:
            comment: The Comment object for which to get the likes count.

        Returns:
            int: The number of likes for the comment.
        """
        return Like.objects.filter(comment=comment).count()
    def get_user_name(self, comment):
        """
        Get the name of the user who posted the comment.

        Args:
            comment: The Comment object for which to get the user name.

        Returns:
            str: The name of the user who posted the comment.
        """
        return comment.user.name if comment.user else None
    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return None
    class Meta:
        """
        commentSerialiezer Meta is contains all fields in Model
        """
        model = Comment
        fields = "__all__"
    
class TagSerializer(serializers.ModelSerializer):
    """
    Serializer for the Tag model.

    This serializer defines how Tag objects should be serialized/deserialized
    for use in the Django REST framework. It includes the number of posts
    associated with each tag.
    """
    posts_count = serializers.SerializerMethodField()
    def get_posts_count(self, tag):
        """
        Get the number of posts associated with a tag.

        Args:
            tag: The Tag object for which to get the posts count.

        Returns:
            int: The number of posts associated with the tag.
        """
        return Post.objects.filter(tag=tag).count()
    class Meta:
        """
        TagSerialiezer Meta is contains all fields in Model
        """
        model = Tag
        fields= "__all__"
class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.
    
    It includes the number of posts
    associated with each category.
    """
    posts_count = serializers.SerializerMethodField()
    def get_posts_count(self, category):
        """
        Get the number of posts associated with a category.

        Args:
            category: The Category object for which to get the posts count.

        Returns:
            int: The number of posts associated with the category.
        """
        return Post.objects.filter(category=category).count()
    class Meta:
        """
        categorySerialiezer Meta is contains all fields in Model
        """
        model = Category
        fields= "__all__"
class LikeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Like model.

    """
    class Meta:
        """
        LikeSerialiezer Meta is contains all fields in Model
        """
        model = Like
        fields= "__all__"
class SubscribeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Subscriptions model.

    """
    class Meta:
        """
        SubscribeSerializer Meta is contains all fields in Model
        """
        model = Subscriptions
        fields= "__all__"
class FirstPostIdSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving the ID of the first post.

    This serializer is used to retrieve the ID of the first post in the database,
    which can be useful for Forward opertions.
    """
    class Meta:
        """
        FirtPostId Serialiezer returns only Id field of Post Model
        """
        model = Post
        fields = ['id']
#Elastic Search
class PostDocumentSerializer(DocumentSerializer):
    class Meta:
        document = PostDocument
        fields = (
            'title',
            'category'
        )