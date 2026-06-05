from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q

from .models import Category, Event
from .serializers import CategorySerializer, EventSerializer


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Email atau password salah.'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(username=user.username, password=password)
        if not user:
            return Response({'error': 'Email atau password salah.'}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_staff:
            return Response({'error': 'Akses ditolak. Hanya admin yang diizinkan.'}, status=status.HTTP_403_FORBIDDEN)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {'id': user.id, 'email': user.email, 'username': user.username},
        })


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'message': 'Logout berhasil.'})


# ─── Public Views ────────────────────────────────────────────────────────────

class PublicEventListView(APIView):
    def get(self, request):
        events = Event.objects.select_related('category').all()

        category_id = request.query_params.get('category')
        status_filter = request.query_params.get('status')
        search = request.query_params.get('search', '').strip()

        if category_id:
            events = events.filter(category__id=category_id)
        if status_filter and status_filter != 'all':
            events = events.filter(status=status_filter)
        if search:
            events = events.filter(
                Q(title__icontains=search) | Q(description__icontains=search) | Q(location__icontains=search)
            )

        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)


class PublicEventDetailView(APIView):
    def get(self, request, pk):
        try:
            event = Event.objects.select_related('category').get(pk=pk)
        except Event.DoesNotExist:
            return Response({'error': 'Event tidak ditemukan.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = EventSerializer(event, context={'request': request})
        return Response(serializer.data)


class FeaturedEventsView(APIView):
    def get(self, request):
        events = Event.objects.select_related('category').filter(is_featured=True)[:6]
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)


class PublicCategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


# ─── Admin Views ─────────────────────────────────────────────────────────────

class AdminStatsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'total': Event.objects.count(),
            'upcoming': Event.objects.filter(status='upcoming').count(),
            'ongoing': Event.objects.filter(status='ongoing').count(),
            'done': Event.objects.filter(status='done').count(),
        })


class AdminEventListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        events = Event.objects.select_related('category').all()
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = EventSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminEventDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def _get_event(self, pk):
        try:
            return Event.objects.select_related('category').get(pk=pk)
        except Event.DoesNotExist:
            return None

    def get(self, request, pk):
        event = self._get_event(pk)
        if not event:
            return Response({'error': 'Event tidak ditemukan.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = EventSerializer(event, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        event = self._get_event(pk)
        if not event:
            return Response({'error': 'Event tidak ditemukan.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = EventSerializer(event, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        event = self._get_event(pk)
        if not event:
            return Response({'error': 'Event tidak ditemukan.'}, status=status.HTTP_404_NOT_FOUND)
        if event.banner:
            event.banner.delete(save=False)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminCategoryListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminCategoryDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def _get_category(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return None

    def get(self, request, pk):
        cat = self._get_category(pk)
        if not cat:
            return Response({'error': 'Kategori tidak ditemukan.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(CategorySerializer(cat).data)

    def put(self, request, pk):
        cat = self._get_category(pk)
        if not cat:
            return Response({'error': 'Kategori tidak ditemukan.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(cat, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        cat = self._get_category(pk)
        if not cat:
            return Response({'error': 'Kategori tidak ditemukan.'}, status=status.HTTP_404_NOT_FOUND)
        cat.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
