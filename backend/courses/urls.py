from django.urls import path
from . import views

urlpatterns = [
    # Catégories
    path('categories/', views.CourseCategoryListView.as_view(), name='course-categories'),

    # Cours
    path('', views.CourseListView.as_view(), name='course-list'),
    path('featured/', views.FeaturedCoursesView.as_view(), name='featured-courses'),
    path('popular/', views.popular_courses, name='popular-courses'),
    path('stats/', views.course_stats, name='course-stats'),
    path('<int:pk>/', views.CourseDetailByIdView.as_view(), name='course-detail-by-id'),
    path('<int:course_id>/brochure/', views.download_course_brochure_by_id, name='download-course-brochure-by-id'),
    path('<slug:course_slug>/download/', views.download_course_pdf, name='download-course-pdf'),
    path('<slug:course_slug>/brochure/', views.download_course_brochure, name='download-course-brochure'),
    path('<slug:slug>/', views.CourseDetailView.as_view(), name='course-detail'),

    # Inscriptions
    path('enrollments/', views.CourseEnrollmentListView.as_view(), name='enrollment-list'),
    path('enrollments/<int:pk>/', views.CourseEnrollmentDetailView.as_view(), name='enrollment-detail'),
    path('<slug:course_slug>/enroll/', views.enroll_in_course, name='enroll-course'),
]
