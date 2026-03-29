from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User


class PagesAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # create admin user
        self.admin = User.objects.create_superuser('admin', 'admin@example.com', 'pass')

    def test_get_mission_public(self):
        resp = self.client.get('/api/pages/mission/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('title_fr', resp.json())

    def test_put_mission_requires_admin(self):
        data = {'title_fr': 'Nouvelle mission FR'}
        resp = self.client.put('/api/pages/mission/', data, format='json')
        self.assertIn(resp.status_code, (401, 403))

        # login as admin and try again
        self.client.force_authenticate(user=self.admin)
        resp2 = self.client.put('/api/pages/mission/', data, format='json')
        self.assertEqual(resp2.status_code, 200)
        self.assertEqual(resp2.json().get('title_fr'), 'Nouvelle mission FR')
