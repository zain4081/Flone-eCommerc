import graphene
from graphene_django.types import DjangoObjectType
from .models import Post

class PostType(DjangoObjectType):
    """
    GraphQL type for the Post model.

    This class defines how the Post model is represented in GraphQL queries.
    """
    class Meta:
        model = Post

class Query(graphene.ObjectType):
    """
    GraphQL queries for retrieving data.

    This class defines GraphQL queries that can be executed to fetch data.
    """

    first_post_id = graphene.Int(description="Fetch the ID of the first post.")

    def resolve_first_post_id(self, info):
        """
        Resolver function for fetching the ID of the first post.

        This function queries the database to retrieve the ID of the first post.
        If no posts exist, it returns None.

        Args:
        - self: The root object, typically not used here.
        - info: GraphQL resolve info containing metadata about the query.

        Returns:
        - int: ID of the first post.
        """
        first_post = Post.objects.order_by('id').first()
        if first_post:
            return first_post.id
        return None

schema = graphene.Schema(query=Query)
