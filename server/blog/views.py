from django.shortcuts import render

from .models import Posts, Comment
from .serializers import PostSerializer, CommentSerializer
from rest_framework import viewsets,filters


class PostList(viewsets.ModelViewSet):

	queryset = Posts.objects.all()
	serializer_class = PostSerializer
	filter_backends = [filters.SearchFilter,filters.OrderingFilter]
	search_fields = ['title']
	ordering_fields = ['category']










