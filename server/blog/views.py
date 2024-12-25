from shutil import posix

from django.shortcuts import render

from .models import Posts, Comment
from .serializers import PostSerializer, CommentSerializer
from rest_framework import viewsets,filters


class PostList(viewsets.ModelViewSet):

	queryset = Posts.objects.all()
	serializer_class = PostSerializer
	filter_backends = [filters.SearchFilter,filters.OrderingFilter]
	search_fields = ['title','category']
	ordering_fields = ['category']


class CommentList(viewsets.ModelViewSet):
	serializer_class = CommentSerializer

	# You can set queryset here if you want the base filtering, but it will be overridden by get_queryset()
	queryset = Comment.objects.all()

	def get_queryset(self):
		post_id = self.kwargs['post_id']  # Ensure post_id is passed correctly from URL
		return Comment.objects.filter(post_id=post_id)
















