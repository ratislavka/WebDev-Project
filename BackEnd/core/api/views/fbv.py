# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from api.models import Event
# from api.serializers import EventSerializer
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.decorators import permission_classes


# @api_view(['GET', 'POST', 'PUT', 'DELETE'])
# def get_event(request):
#     if request.method == 'GET':
#         events = Event.objects.all()
#         serializer = EventSerializer(events, many=True)