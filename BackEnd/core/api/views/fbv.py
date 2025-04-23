from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({'authenticated': True})
