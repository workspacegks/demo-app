from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """Full CRUD for Task via /api/tasks/ (list, create, retrieve, update, delete)."""

    queryset = Task.objects.all()
    serializer_class = TaskSerializer


@api_view(["GET"])
def health_check(request):
    """Simple endpoint to verify the backend + DB are reachable. Used for
    quick smoke tests once deployed behind Nginx/Gunicorn."""
    return Response({"status": "ok"})
