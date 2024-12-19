from django.db import models

class Posts(models.Model):
	author = models.CharField(max_length=50)
	title = models.CharField(max_length=100)
	content = models.TextField()
	pics = models.ImageField(
		upload_to='pics/',
	    blank=True,
	    null=True
	    )
	category = models.CharField(max_length=50)


class Comment(models.Model):  # Changed to singular form
    post = models.ForeignKey(
        Posts,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.CharField(max_length=50)

    content = models.TextField()









