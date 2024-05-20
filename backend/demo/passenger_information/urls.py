from django.urls import path
from . import views

urlpatterns = [
    path('passenger/<int:passenger_id>/update/', views.UpdatePassengerView.as_view(), name='update_passenger'),
    path('passenger/<int:passenger_id>/delete/', views.DeletePassengerView.as_view(), name='delete_passenger'),
]
