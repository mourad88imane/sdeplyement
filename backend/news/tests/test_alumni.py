from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from news.models import AlumniSuccess, AlumniPhoto

User = get_user_model()

class AlumniAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Create users
        self.staff = User.objects.create_user(username='staff', password='pass', is_staff=True)
        self.user = User.objects.create_user(username='user', password='pass')

        # Create an alumni success entry
        self.alumni = AlumniSuccess.objects.create(
            title_fr='Test Success',
            title_ar='نجاح اختبار',
            slug='test-success',
            year=2025,
            summary_fr='Résumé test',
            summary_ar='ملخص اختبار',
            content_fr='<p>Content</p>',
            content_ar='<p>محتوى</p>',
            author=self.staff,
            featured=True
        )

    def test_list_alumni_anonymous(self):
        url = '/api/news/alumni/'
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(len(resp.data) >= 1)

    def test_create_alumni_denied_for_non_staff(self):
        url = '/api/news/alumni/'
        self.client.login(username='user', password='pass')
        data = {
            'title_fr': 'New',
            'title_ar': 'جديد',
            'slug': 'new-success',
            'year': 2025,
            'summary_fr': 's',
            'summary_ar': 's',
            'content_fr': '<p>ok</p>',
            'content_ar': '<p>ok</p>'
        }
        resp = self.client.post(url, data, format='json')
        self.assertIn(resp.status_code, (403, 401))

    def test_create_alumni_allowed_for_staff(self):
        url = '/api/news/alumni/'
        self.client.login(username='staff', password='pass')
        data = {
            'title_fr': 'New Staff',
            'title_ar': 'جديد',
            'slug': 'new-staff-success',
            'year': 2025,
            'summary_fr': 's',
            'summary_ar': 's',
            'content_fr': '<p>ok</p>',
            'content_ar': '<p>ok</p>'
        }
        resp = self.client.post(url, data, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_detail_includes_photos(self):
        # add photos
        photo1 = AlumniPhoto.objects.create(alumni=self.alumni, image='alumni/photos/1.jpg', caption_fr='c1')
        photo2 = AlumniPhoto.objects.create(alumni=self.alumni, image='alumni/photos/2.jpg', caption_fr='c2')
        url = f'/api/news/alumni/{self.alumni.slug}/'
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertIn('photos', resp.data)
        self.assertTrue(len(resp.data['photos']) >= 2)

    def test_upload_photo_denied_for_non_staff(self):
        url = f'/api/news/alumni/{self.alumni.slug}/photos/'
        self.client.login(username='user', password='pass')
        from django.core.files.uploadedfile import SimpleUploadedFile
        img = SimpleUploadedFile('test.jpg', b'jpgcontent', content_type='image/jpeg')
        resp = self.client.post(url, {'image': img, 'caption_fr': 'c'}, format='multipart')
        self.assertIn(resp.status_code, (403, 401))

    def test_upload_photo_allowed_for_staff(self):
        url = f'/api/news/alumni/{self.alumni.slug}/photos/'
        self.client.login(username='staff', password='pass')
        from django.core.files.uploadedfile import SimpleUploadedFile
        img = SimpleUploadedFile('test.jpg', b'jpgcontent', content_type='image/jpeg')
        resp = self.client.post(url, {'image': img, 'caption_fr': 'c'}, format='multipart')
        self.assertEqual(resp.status_code, 201)
        # Ensure photo created
        self.assertTrue(AlumniPhoto.objects.filter(alumni=self.alumni, caption_fr='c').exists())

    def test_admin_list_returns_all_for_staff(self):
        # Create an unpublished alumni
        unpublished = AlumniSuccess.objects.create(
            title_fr='Draft', title_ar='مسودة', slug='draft', year=2020, author=self.staff
        )
        url = '/api/news/alumni/?admin=1'
        # anonymous should not see unpublished
        resp_anon = self.client.get('/api/news/alumni/')
        self.assertEqual(resp_anon.status_code, 200)
        # staff should see all when admin=1
        self.client.login(username='staff', password='pass')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(any(a['slug'] == 'draft' for a in resp.data))

    def test_delete_photo_permissions(self):
        photo = AlumniPhoto.objects.create(alumni=self.alumni, image='alumni/photos/9.jpg', caption_fr='d')
        url = f'/api/news/alumni/photos/{photo.id}/'
        # non-staff cannot delete
        self.client.login(username='user', password='pass')
        resp = self.client.delete(url)
        self.assertIn(resp.status_code, (403, 401))
        # staff can delete
        self.client.login(username='staff', password='pass')
        resp2 = self.client.delete(url)
        self.assertEqual(resp2.status_code, 204)
        self.assertFalse(AlumniPhoto.objects.filter(id=photo.id).exists())
