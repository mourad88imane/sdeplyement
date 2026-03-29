from django.db import models


class HackathonEvent(models.Model):
    title_fr = models.CharField(max_length=255)
    title_ar = models.CharField(max_length=255, blank=True, default='')
    title_en = models.CharField(max_length=255, blank=True, default='')
    subtitle_fr = models.CharField(max_length=255, blank=True, default='')
    subtitle_ar = models.CharField(max_length=255, blank=True, default='')
    subtitle_en = models.CharField(max_length=255, blank=True, default='')
    description_fr = models.TextField(blank=True, default='')
    description_ar = models.TextField(blank=True, default='')
    description_en = models.TextField(blank=True, default='')
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()
    location_fr = models.CharField(max_length=255, blank=True, default='')
    location_ar = models.CharField(max_length=255, blank=True, default='')
    location_en = models.CharField(max_length=255, blank=True, default='')
    registration_deadline = models.DateTimeField(null=True, blank=True)
    max_teams = models.IntegerField(default=20)
    contact_email = models.EmailField(blank=True, default='')
    banner = models.ImageField(upload_to='hackathon/banners/', null=True, blank=True)
    is_active = models.BooleanField(default=False)
    year = models.IntegerField(default=2024)

    class Meta:
        ordering = ['-date_start']

    def __str__(self):
        return f"{self.title_fr} ({self.year})"


class Prize(models.Model):
    event = models.ForeignKey(HackathonEvent, on_delete=models.CASCADE, related_name='prizes')
    place = models.IntegerField(default=1)
    title_fr = models.CharField(max_length=255)
    title_ar = models.CharField(max_length=255, blank=True, default='')
    title_en = models.CharField(max_length=255, blank=True, default='')
    amount = models.CharField(max_length=50, blank=True, default='0')
    description_fr = models.TextField(blank=True, default='')
    description_ar = models.TextField(blank=True, default='')
    description_en = models.TextField(blank=True, default='')
    is_special = models.BooleanField(default=False)

    class Meta:
        ordering = ['place']

    def __str__(self):
        return f"{self.title_fr} - Place {self.place}"


class TimelineItem(models.Model):
    event = models.ForeignKey(HackathonEvent, on_delete=models.CASCADE, related_name='timeline_items')
    day = models.IntegerField(default=1)
    time = models.CharField(max_length=5, help_text="Format HH:MM")
    title_fr = models.CharField(max_length=255)
    title_ar = models.CharField(max_length=255, blank=True, default='')
    title_en = models.CharField(max_length=255, blank=True, default='')
    description_fr = models.TextField(blank=True, default='')
    description_ar = models.TextField(blank=True, default='')
    description_en = models.TextField(blank=True, default='')
    is_highlight = models.BooleanField(default=False)

    class Meta:
        ordering = ['day', 'time']

    def __str__(self):
        return f"Day {self.day} {self.time} - {self.title_fr}"


class Winner(models.Model):
    event = models.ForeignKey(HackathonEvent, on_delete=models.CASCADE, related_name='winners')
    team_name = models.CharField(max_length=255)
    project_name_fr = models.CharField(max_length=255)
    project_name_ar = models.CharField(max_length=255, blank=True, default='')
    project_name_en = models.CharField(max_length=255, blank=True, default='')
    project_description_fr = models.TextField(blank=True, default='')
    project_description_ar = models.TextField(blank=True, default='')
    project_description_en = models.TextField(blank=True, default='')
    place = models.IntegerField(default=1)
    members = models.TextField(blank=True, default='', help_text="Comma-separated member names")
    photo = models.ImageField(upload_to='hackathon/winners/', null=True, blank=True)

    class Meta:
        ordering = ['place']

    def __str__(self):
        return f"{self.team_name} - Place {self.place}"


class GalleryItem(models.Model):
    event = models.ForeignKey(HackathonEvent, on_delete=models.CASCADE, related_name='gallery_items')
    image = models.ImageField(upload_to='hackathon/gallery/')
    caption_fr = models.CharField(max_length=255, blank=True, default='')
    caption_ar = models.CharField(max_length=255, blank=True, default='')
    caption_en = models.CharField(max_length=255, blank=True, default='')

    def __str__(self):
        return self.caption_fr or f"Gallery {self.id}"


class Theme(models.Model):
    event = models.ForeignKey(HackathonEvent, on_delete=models.CASCADE, related_name='themes')
    title_fr = models.CharField(max_length=255)
    title_ar = models.CharField(max_length=255, blank=True, default='')
    title_en = models.CharField(max_length=255, blank=True, default='')
    description_fr = models.TextField(blank=True, default='')
    description_ar = models.TextField(blank=True, default='')
    description_en = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.title_fr