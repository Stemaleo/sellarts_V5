
from django.db import models


class ArtWorks(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    height = models.FloatField(null=True)
    is_featured = models.BooleanField(null=True)
    price = models.FloatField(null=True)
    # size = models.FloatField(null=True, default=0)
    stock = models.IntegerField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    width = models.FloatField(null=True)
    artist = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    material_type = models.ForeignKey('MaterialType', models.DO_NOTHING, null=True)
    owner = models.ForeignKey('Users', models.DO_NOTHING, related_name='artworks_owner_set', blank=True, null=True)
    painting_type = models.ForeignKey('PaintingType', models.DO_NOTHING, null=True)

    class Meta:
        managed = False
        db_table = 'art_works'


class ArtistProfiles(models.Model):
    id = models.BigIntegerField(primary_key=True)
    artist_type = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    cover_key = models.CharField(max_length=255, blank=True, null=True)
    cover_url = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    portfolio_url = models.CharField(max_length=255, blank=True, null=True)
    user = models.OneToOneField('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artist_profiles'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Bid(models.Model):
    id = models.BigAutoField(primary_key=True)
    amount = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    art_work = models.ForeignKey(ArtWorks, models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'bid'


class Blogs(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    duration = models.IntegerField()
    is_publish = models.BooleanField()
    title = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'blogs'


class CartItem(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    price = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    quantity = models.IntegerField()
    art_work = models.ForeignKey(ArtWorks, models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cart_item'


class Catalog(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    owner = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'catalog'


class CatalogArtworks(models.Model):
    catalog = models.ForeignKey(Catalog, models.DO_NOTHING)
    artwork = models.ForeignKey(ArtWorks, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'catalog_artworks'


class Colab(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    artist = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    requester = models.ForeignKey('Users', models.DO_NOTHING, related_name='colab_requester_set', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'colab'


class ColabRequest(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    artist = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    requester = models.ForeignKey('Users', models.DO_NOTHING, related_name='colabrequest_requester_set', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'colab_request'


class Comments(models.Model):
    id = models.BigAutoField(primary_key=True)
    content = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    post = models.ForeignKey('Post', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comments'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Events(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    max_registration = models.IntegerField()
    owner_type = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    owner = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'events'


class EventsMediaKeys(models.Model):
    events = models.ForeignKey(Events, models.DO_NOTHING)
    media_keys = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'events_media_keys'


class EventsMediaUrls(models.Model):
    events = models.ForeignKey(Events, models.DO_NOTHING)
    media_urls = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'events_media_urls'


class Favourite(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    art_work = models.ForeignKey(ArtWorks, models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'favourite'


class Likes(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    post = models.ForeignKey('Post', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'likes'


class MaterialType(models.Model):
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'material_type'


class Medias(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    content_size = models.CharField(max_length=255, blank=True, null=True)
    content_type = models.CharField(max_length=255, blank=True, null=True)
    key = models.CharField(max_length=255, blank=True, null=True)
    public_url = models.TextField(blank=True, null=True)
    art_work = models.ForeignKey(ArtWorks, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'medias'


class Notification(models.Model):
    id = models.BigAutoField(primary_key=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    message = models.CharField(max_length=255)
    read_status = models.BooleanField()
    timestamp = models.DateTimeField()
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'notification'


class OrderItem(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    admin_share = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    artist_share = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    price = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    quantity = models.IntegerField()
    art_work = models.ForeignKey(ArtWorks, models.DO_NOTHING, blank=True, null=True)
    order = models.ForeignKey('Orders', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'order_item'


class Orders(models.Model):
    id = models.BigIntegerField(primary_key=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    admin_share = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    artist_share = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    payment_status = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    postal_code = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    total_amount = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    owner = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'orders'


class PaintingType(models.Model):
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'painting_type'


class Payment(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    order_status = models.CharField(max_length=255, blank=True, null=True)
    payment_id = models.CharField(max_length=255, blank=True, null=True)
    order = models.ForeignKey(Orders, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payment'


class Post(models.Model):
    id = models.BigAutoField(primary_key=True)
    content = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    media_key = models.CharField(max_length=255, blank=True, null=True)
    media_url = models.CharField(max_length=255, blank=True, null=True)
    owner = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'post'


class Promo(models.Model):
    id = models.BigAutoField(primary_key=True)
    amount = models.FloatField()
    code = models.CharField(unique=True, max_length=255, blank=True, null=True)
    count = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField()
    is_percentage = models.BooleanField()
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'promo'


class Registration(models.Model):
    id = models.BigAutoField(primary_key=True)
    registration_time = models.DateTimeField(blank=True, null=True)
    event = models.ForeignKey(Events, models.DO_NOTHING)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'registration'


class Subscribe(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    artist = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, related_name='subscribe_user_set', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'subscribe'


class Tickets(models.Model):
    id = models.BigIntegerField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tickets'


class Transaction(models.Model):
    id = models.BigAutoField(primary_key=True)
    amount = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    initiator_type = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'transaction'


class UserRoles(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING)
    role = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_roles'


class Users(models.Model):
    id = models.BigIntegerField(primary_key=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField()
    name = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    profile_image = models.CharField(max_length=255, blank=True, null=True)
    profile_image_url = models.TextField(blank=True, null=True)
    registered_at = models.DateTimeField(blank=True, null=True)
    artist_profile = models.OneToOneField(ArtistProfiles, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'
