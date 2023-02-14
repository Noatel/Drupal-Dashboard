import os
from urllib.request import Request

from scrapy.http import TextResponse


def fake_response(file_name=None, url=None):
    """Create a Scrapy fake HTTP response from a HTML file"""
    if not url:
        url = 'https://www.noahtelussa.nl'

    # Create the request
    request = Request(url=url)

    # If the filename exsist
    if file_name:
        # Check if the first charachter is a /
        if not file_name[0] == '/':
            responses_dir = os.path.dirname(os.path.realpath(__file__))
            file_path = os.path.join(responses_dir, file_name)
        else:
        # set file_path
            file_path = file_name

        # set the content of the file in the variable file_content
        file_content = open(file_path, 'r').read()
    else:
        # if the file is not found, empty response
        file_content = ''

    # Create a textResponse
    response = TextResponse(url=url, request=request, body=file_content,
    encoding='utf-8')

    # Return the mocked response
    return response


def fail_response(file_name=None, url=None):
    """Create a Scrapy fake HTTP response from a HTML file"""
    if not url:
        url = 'https://www.noahtelussa.nl'

    request = Request(url=url)
    if file_name:
        if not file_name[0] == '/':
            responses_dir = os.path.dirname(os.path.realpath(__file__))
            file_path = os.path.join(responses_dir, file_name)
        else:
            file_path = file_name

        file_content = open(file_path, 'r').read()
    else:
        file_content = ''
    response = TextResponse(url=url, request=request, body=file_content,
                            encoding='utf-8')
    response.status = 404
    return response
