"""
  Custom Renderer for rendering

"""
import json
from rest_framework import renderers


class UserRenderer(renderers.JSONRenderer):
    """
    Custom JSONRenderer for rendering User data.

    This renderer checks if the data contains an 'ErrorDetail' object.
    If it does, it wraps the data in a dictionary with the key 'errors'.
    Otherwise, it returns the data as is.
    """

    charset='utf-8'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        Renders the given data into JSON format.

        Args:
            data: The data to be rendered.
            accepted_media_type: The media type accepted by the renderer.
            renderer_context: The context of the renderer.

        Returns:
            str: The JSON formatted data.
        """
        response = ''
        if 'ErrorDetail' in str(data):
            response = json.dumps({'errors': data})
        else:
            response = json.dumps(data)
        return response
