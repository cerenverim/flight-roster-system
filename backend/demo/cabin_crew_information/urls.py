from django.urls import path
from . import views

urlpatterns = [
    path('crew/add/', views.AddCrewMemberView.as_view(), name='add_crew_member'),
    path('crew/<int:crew_member_id>/delete/', views.DeleteStaffView.as_view(), name='delete_staff'),
]