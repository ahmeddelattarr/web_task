from rest_framework import serializers
from .models import models, Posts, Comment


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ['id', 'author', 'title', 'content',  'category']
        extra_kwargs = {
            'id': {'read_only': True}  # ID will only be included in responses
        }


class CommentSerializer(serializers.ModelSerializer):
	model=Comment
	fields=['author','content','post_id']
	read_only_fields=['post_id']
