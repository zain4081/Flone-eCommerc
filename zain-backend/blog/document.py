# articles/documents.py
from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from blog.models import Post
@registry.register_document
class PostDocument(Document):
    title = fields.TextField(
        attr='title',
        fields={
            'raw': fields.TextField(),
            'suggest': fields.CompletionField(),
        }
    )
    category = fields.ObjectField(
        attr='category',
        properties={
            'id': fields.IntegerField(),
            'name': fields.TextField(
                attr='name',
                fields={
                    'raw': fields.KeywordField(),
                }
            )
        }
    )
    class Index:
        name = 'posts'
    class Django:
        model = Post