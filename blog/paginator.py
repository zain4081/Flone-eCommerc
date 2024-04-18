from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class default_paginator(PageNumberPagination):
    page_size = 5
    page_query_param = 'p'
    
    def get_paginated_response(self, data):
        return Response({
            'total_pages': self.page.paginator.num_pages,
            'count': self.page.paginator.count,
            'next_url': self.get_next_link(),
            'previous_url': self.get_previous_link(),
            'results': data
        })