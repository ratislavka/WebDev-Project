from re import I
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

from api.models import Ticket
from api.serializers import TicketSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({'authenticated': True})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tickets(request):
    try:
        tickets = Ticket.objects.all()
        serializers = TicketSerializer(tickets, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    except Ticket.DoesNotExist:
        return Response({"error": "Tickets not found"}, status=status.HTTP_404_NOT_FOUND)
