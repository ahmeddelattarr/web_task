from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostList, CommentList


router = DefaultRouter()
router.register(r'posts', PostList, basename='post')
router.register(r'comments/(?P<post_id>\d+)', CommentList, basename='comment')



# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    #path('api/comments/<int:post_id>/', CommentList.as_view({'get': 'list'}), name='comment-list')
]