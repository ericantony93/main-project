from django.contrib import admin
from django.urls import path, include
from APP.views import RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/auth/", include("APP.urls")),

    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),

    path("api/store/", include("store.urls")),
]
