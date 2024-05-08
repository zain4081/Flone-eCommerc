"""
Module for defining custom pagination classes.
"""
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class DefaultPaginator(PageNumberPagination):
    """
    Custom paginator that sets 
    the page size to 5 and uses 'p' 
    as the query parameter for pagination.
    """
    page_size = 5
    page_query_param = 'p'
    def get_paginated_response(self, data):
        """
        Return a paginated representation of the data.

        Adds metadata such as the total number of pages, total count of items,
        URLs for the next and previous pages, and the actual results for the current page.
        """
        return Response({
            'total_pages': self.page.paginator.num_pages,
            'count': self.page.paginator.count,
            'next_url': self.get_next_link(),
            'previous_url': self.get_previous_link(),
            'results': data
        })
