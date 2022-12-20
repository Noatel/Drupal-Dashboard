from rest_framework import viewsets
from rest_framework import permissions
from src.api.models import Website, Page
from src.api.serializers import WebsiteSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer,RegisterSerializer
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

# Class based view to Get User Details using Token Authentication
class UserDetailAPI(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        content = {
            'user': str(request.user),  # `django.contrib.auth.User` instance.
            'auth': str(request.auth),  # None
        }
        return Response(content)


# Class based view to register user
class RegisterUserAPIView(generics.CreateAPIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RegisterSerializer


class WebsiteViewSet(viewsets.ModelViewSet):
    """
       API endpoint that allows api to create
    """
    queryset = Website.objects.all().order_by('name')
    serializer_class = WebsiteSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]



class PageViewSet(viewsets.ModelViewSet):
    """
       API endpoint that allows api to create
    """
    queryset = Page.objects.all().order_by('name')
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

