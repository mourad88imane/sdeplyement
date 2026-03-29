from django.db import models


class Page(models.Model):
    slug = models.SlugField(max_length=100, unique=True)
    title_fr = models.CharField(max_length=255, blank=True)
    title_en = models.CharField(max_length=255, blank=True)
    title_ar = models.CharField(max_length=255, blank=True)

    content_fr = models.TextField(blank=True)
    content_en = models.TextField(blank=True)
    content_ar = models.TextField(blank=True)

    featured_image = models.ImageField(upload_to='pages/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.slug or self.title_fr or self.title_en
