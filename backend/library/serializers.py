from rest_framework import serializers
from .models import BookCategory, Author, Publisher, Book, BookReview, BookBorrow, BookReservation


class BookCategorySerializer(serializers.ModelSerializer):
    book_count = serializers.SerializerMethodField()

    class Meta:
        model = BookCategory
        fields = '__all__'

    def get_book_count(self, obj):
        return obj.book_set.filter(status='available').count()


class AuthorSerializer(serializers.ModelSerializer):
    book_count = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = '__all__'

    def get_book_count(self, obj):
        return obj.book_set.count()


class PublisherSerializer(serializers.ModelSerializer):
    book_count = serializers.SerializerMethodField()

    class Meta:
        model = Publisher
        fields = '__all__'

    def get_book_count(self, obj):
        return obj.book_set.count()


class BookListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des livres (données minimales)"""
    authors_list = serializers.SerializerMethodField()
    category_name_fr = serializers.CharField(source='category.name_fr', read_only=True)
    category_name_ar = serializers.CharField(source='category.name_ar', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    publisher_name = serializers.CharField(source='publisher.name', read_only=True)
    average_rating = serializers.DecimalField(source='rating', max_digits=3, decimal_places=2, read_only=True)
    review_count = serializers.SerializerMethodField()
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'subtitle', 'authors_list', 'category_name_fr', 'category_name_ar',
            'category_icon', 'publisher_name', 'isbn', 'publication_date', 'pages',
            'language', 'description_fr', 'description_ar', 'cover_image',
            'status', 'copies_available', 'copies_total', 'is_available',
            'average_rating', 'review_count', 'views_count', 'download_count',
            'is_featured', 'is_new_arrival', 'allow_download', 'created_at'
        ]

    def get_authors_list(self, obj):
        """Retourne la liste des auteurs sous forme de chaîne"""
        try:
            return obj.authors_list
        except:
            return ""

    def get_is_available(self, obj):
        """Retourne si le livre est disponible"""
        try:
            return obj.is_available
        except:
            return False

    def get_review_count(self, obj):
        """Retourne le nombre d'avis approuvés"""
        try:
            return obj.reviews.filter(is_approved=True).count()
        except:
            return 0


class BookDetailSerializer(serializers.ModelSerializer):
    """Serializer pour les détails complets d'un livre"""
    authors = AuthorSerializer(many=True, read_only=True)
    category = BookCategorySerializer(read_only=True)
    publisher = PublisherSerializer(read_only=True)
    reviews = serializers.SerializerMethodField()
    average_rating = serializers.DecimalField(source='rating', max_digits=3, decimal_places=2, read_only=True)
    review_count = serializers.SerializerMethodField()
    is_available = serializers.BooleanField(read_only=True)
    keywords_list = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = '__all__'

    def get_reviews(self, obj):
        reviews = obj.reviews.filter(is_approved=True).order_by('-created_at')[:10]
        return BookReviewSerializer(reviews, many=True).data

    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()

    def get_keywords_list(self, obj):
        if obj.keywords:
            return [keyword.strip() for keyword in obj.keywords.split(',')]
        return []


class BookReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookReview
        fields = ['id', 'reviewer_name', 'rating', 'title', 'content', 'created_at']


class BookReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookReview
        fields = ['book', 'reviewer_name', 'reviewer_email', 'rating', 'title', 'content']

    def validate(self, data):
        book = data.get('book')
        reviewer_email = data.get('reviewer_email')

        # Vérifier si l'utilisateur a déjà laissé un avis pour ce livre
        if BookReview.objects.filter(book=book, reviewer_email=reviewer_email).exists():
            raise serializers.ValidationError("Vous avez déjà laissé un avis pour ce livre.")

        return data


class BookBorrowSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_isbn = serializers.CharField(source='book.isbn', read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = BookBorrow
        fields = '__all__'
        read_only_fields = ['borrow_date', 'processed_by', 'created_at', 'updated_at']


class BookBorrowCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookBorrow
        fields = [
            'book', 'borrower_name', 'borrower_email', 'borrower_phone',
            'student_id', 'due_date', 'notes'
        ]

    def validate(self, data):
        book = data.get('book')

        # Vérifier si le livre est disponible
        if not book.is_available:
            raise serializers.ValidationError("Ce livre n'est pas disponible pour l'emprunt.")

        # Vérifier si l'emprunteur n'a pas déjà emprunté ce livre
        borrower_email = data.get('borrower_email')
        if BookBorrow.objects.filter(
            book=book,
            borrower_email=borrower_email,
            status='active'
        ).exists():
            raise serializers.ValidationError("Vous avez déjà emprunté ce livre.")

        return data


class BookReservationSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_isbn = serializers.CharField(source='book.isbn', read_only=True)

    class Meta:
        model = BookReservation
        fields = '__all__'
        read_only_fields = ['reservation_date', 'created_at', 'updated_at']


class BookReservationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookReservation
        fields = [
            'book', 'reserver_name', 'reserver_email', 'reserver_phone',
            'expiry_date', 'notes'
        ]

    def validate(self, data):
        book = data.get('book')
        reserver_email = data.get('reserver_email')

        # Vérifier si l'utilisateur n'a pas déjà une réservation active pour ce livre
        if BookReservation.objects.filter(
            book=book,
            reserver_email=reserver_email,
            status__in=['pending', 'ready']
        ).exists():
            raise serializers.ValidationError("Vous avez déjà une réservation active pour ce livre.")

        return data


class BookCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création de livres"""
    class Meta:
        model = Book
        exclude = ['added_by', 'views_count', 'download_count', 'rating', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Le added_by sera défini dans la vue
        return super().create(validated_data)
