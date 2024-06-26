import os
import random
from django.conf import settings
from django.core.management.base import BaseCommand
from django.core.files import File
from django.contrib.auth import get_user_model
from blog.models import Tag, Category, Post, Comment, Like

User = get_user_model()

# Sample data for posts, comments, likes, categories, and tags
posts = [
    {'title': 'Exploring the Mountains', 'content': 'This summer, we took a trip to the Rocky Mountains and experienced breathtaking views and challenging hikes.'},
    {'title': 'Delicious Homemade Pizza', 'content': 'Making pizza at home is both fun and rewarding. Here is a recipe that will help you create a perfect homemade pizza.'},
    {'title': 'Tech Innovations in 2024', 'content': '2024 has been a remarkable year for tech innovations, with advancements in AI, robotics, and renewable energy leading the way.'},
    {'title': 'Gardening Tips for Beginners', 'content': 'Starting a garden can be overwhelming. Here are some essential tips to help you get started with your gardening journey.'},
    {'title': 'Top 10 Books to Read', 'content': 'Looking for your next great read? Check out our list of the top 10 must-read books for this year.'},
    {'title': 'Healthy Smoothie Recipes', 'content': 'Smoothies are a great way to get your daily dose of fruits and veggies. Here are some delicious and healthy smoothie recipes to try.'},
    {'title': 'Traveling on a Budget', 'content': 'Traveling doesn’t have to be expensive. Discover some tips and tricks for seeing the world without breaking the bank.'},
    {'title': 'The Art of Meditation', 'content': 'Meditation can greatly enhance your mental well-being. Learn how to meditate effectively with this beginner’s guide.'},
    {'title': 'DIY Home Decor Ideas', 'content': 'Spruce up your home with these simple and creative DIY home decor ideas.'},
    {'title': 'Fitness Routines for Busy People', 'content': 'No time to hit the gym? Here are some quick and effective fitness routines you can do at home or on the go.'},
    {'title': 'The Benefits of Yoga', 'content': 'Yoga offers numerous benefits for both the mind and body. Explore the various styles and find the one that suits you best.'},
    {'title': 'Cooking with Seasonal Ingredients', 'content': 'Seasonal ingredients not only taste better but are also more nutritious. Here are some recipes that make the most of seasonal produce.'},
    {'title': 'Learning a New Language', 'content': 'Thinking about learning a new language? Here are some tips and resources to help you get started.'},
    {'title': 'Sustainable Living Tips', 'content': 'Living sustainably doesn’t have to be difficult. Discover some simple changes you can make to live a more eco-friendly lifestyle.'},
    {'title': 'The History of Jazz Music', 'content': 'Jazz music has a rich and fascinating history. Learn about the origins and evolution of this beloved genre.'},
    {'title': 'Mastering Public Speaking', 'content': 'Public speaking can be intimidating, but with practice and preparation, you can become an effective and confident speaker.'},
    {'title': 'Exploring Ancient Ruins', 'content': 'Ancient ruins offer a glimpse into the past. Discover some of the world’s most fascinating archaeological sites.'},
    {'title': 'The Importance of Sleep', 'content': 'Sleep is essential for good health. Learn about the benefits of sleep and how to improve your sleep quality.'},
    {'title': 'Creative Writing Prompts', 'content': 'Get your creative juices flowing with these inspiring writing prompts.'},
    {'title': 'The World of Digital Art', 'content': 'Digital art is a rapidly growing field. Explore the tools and techniques used by digital artists.'}
]

comments = [
    "Great article!",
    "Very helpful.",
    "Appreciate the insights.",
    "Well explained.",
    "Loved the content.",
    "Useful information.",
    "Nicely written.",
    "This was enlightening.",
    "Keep up the good work.",
    "Thank you for this post.",
    "Brilliant write-up.",
    "Clear and concise.",
    "Really enjoyed this.",
    "Excellent analysis.",
    "Fantastic read.",
    "Very detailed.",
    "Extremely valuable.",
    "Learned a lot from this.",
    "Superb explanation.",
    "Insightful and engaging."
]

likes = [
    'like',
    'not_hit',
]

categories = [
    'Programming',
    'Technologies',
    'AI',
    'Engineering',
    'Robotic Systems'
]

tags = [
    'Django',
    'Flask',
    'C++',
    'Devops',
    'Php',
    'Laravel',
    'Python',
    'Javascript',
    'LLM',
]

def add_random_image_to_post(post_id):
    """
    Adds a random image to a post identified by post_id.

    Parameters:
    - post_id (int): The ID of the post to add an image to.
    """
    image_folder = os.path.join(settings.MEDIA_ROOT, '../images/')
    image_files = [f for f in os.listdir(image_folder) if os.path.isfile(os.path.join(image_folder, f))]
    if not image_files:
        print("No images found in the specified folder.")
        return
    random_image = random.choice(image_files)
    random_image_path = os.path.join(image_folder, random_image)
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        print("Post with the specified ID does not exist.")
        return
    with open(random_image_path, 'rb') as image_file:
        post.image.save(random_image, File(image_file), save=True)


class Command(BaseCommand):
    """
    Django management command to seed database with initial data from JSON file.
    """
    help = 'Seed database with initial data from JSON file.'

    def add_arguments(self, parser):
        """
        Adds custom arguments to the command.

        Parameters:
        - parser (argparse.ArgumentParser): The parser object used to parse command-line arguments.
        """
        parser.add_argument(
            'num_posts',
            nargs='?',
            type=int,
            default=10,
            help='Number of posts to create'
        )

    def handle(self, *args, **kwargs):
        """
        Handles the execution of the command.

        Parameters:
        - args: Positional arguments passed from the command-line.
        - kwargs: Keyword arguments passed from the command-line.
        """
        num_posts = kwargs['num_posts']

        self.seed_tags(tags)
        self.seed_categories(categories)
        self.seed_posts(posts, num_posts)
        self.seed_comments(comments)
        self.seed_child_comments(comments)
        self.seed_likes(likes)
        self.stdout.write(self.style.SUCCESS(f'Database seeded successfully with {num_posts} posts.'))

    def seed_tags(self, tags):
        """
        Seeds tags into the database if they don't already exist.

        Parameters:
        - tags (list): List of tag names.
        """
        for tag in tags:
            Tag.objects.get_or_create(name=tag)

    def seed_categories(self, categories):
        """
        Seeds categories into the database if they don't already exist.

        Parameters:
        - categories (list): List of category names.
        """
        for category in categories:
            Category.objects.get_or_create(name=category)

    def seed_posts(self, posts, num_posts):
        """
        Seeds posts into the database with associated tags and categories.

        Parameters:
        - posts (list): List of dictionaries containing post titles and content.
        - num_posts (int): Number of posts to create.
        """
        for _ in range(num_posts):
            posts_data = random.choice(posts)
            top = random.choice([True, False])
            featured = random.choice([True, False])
            category = Category.objects.order_by('?').first()
            tags_count = Tag.objects.all().count()
            tags_random = random.randint(0, tags_count)
            tags = list(Tag.objects.order_by('?')[:tags_random])
            post = Post.objects.create(
                title=posts_data['title'],
                content=posts_data['content'],
                featured=featured,
                top=top,
                category=category,
            )
            for tag_name in tags:
                tag = Tag.objects.get(name=tag_name)
                post.tag.add(tag)
            add_random_image_to_post(post_id=post.id)

    def seed_comments(self, comments):
        """
        Seeds top-level comments into the database.

        Parameters:
        - comments (list): List of comment content strings.
        """
        posts_count = Post.objects.all().count()
        posts_random = random.randint(1, posts_count)
        posts = list(Post.objects.order_by('?')[:posts_random])
        for post in posts:
            user = User.objects.order_by('?').first()
            random_comment_content = random.choice(comments)
            Comment.objects.create(
                content=random_comment_content,
                post=post,
                user=user,
                parent_comment_id=None,
            )

    def seed_child_comments(self, comments):
        """
        Seeds child comments replying to existing comments.

        Parameters:
        - comments (list): List of comment content strings.
        """
        for _ in range(random.randint(12, 20)):
            user = User.objects.order_by('?').first()
            random_comment_content = random.choice(comments)
            comment = Comment.objects.order_by('?').first()
            Comment.objects.create(
                content=random_comment_content,
                post=None,
                user=user,
                parent_comment_id=comment.id,
            )

    def seed_likes(self, likes):
        """
        Seeds likes for posts.

        Parameters:
        - likes (list): List of like statuses.
        """
        posts = Post.objects.all()
        for post in posts:
            like_status = random.choice(likes)
            user = User.objects.order_by('?').first()
            if not Like.objects.filter(post=post, user=user).exists():
                Like.objects.create(
                    status=like_status,
                    post=post,
                    user=user
                )
