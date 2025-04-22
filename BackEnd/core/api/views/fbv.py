# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from api.models import Event, BookingItem, Ticket
# from api.serializers import EventSerializer, BookingItemSerializer, TicketSerializer
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.decorators import permission_classes


# @api_view(['GET', 'POST', 'PUT', 'DELETE'])
# def cart_storing(request):
#     if request.method == 'GET':
#         events = BookingItem.objects.all()
#         serializer = BookingItemSerializer(events, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     if request