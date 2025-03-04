from django.db import models


        
class ArtWorks(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    height = models.FloatField(null=True)
    is_featured = models.BooleanField(null=True)
    price = models.FloatField(null=True)
    stock = models.IntegerField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    width = models.FloatField(null=True)
    artist = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    material_type = models.ForeignKey('MaterialType', models.DO_NOTHING, null=True)
    method = models.ForeignKey('artwork.Methods', models.DO_NOTHING, db_column="method", related_name='artwork_method', blank=True, null=True)
    style = models.ForeignKey('artwork.Styles', models.DO_NOTHING, db_column="style", related_name='artwork_style', blank=True, null=True)
    size = models.IntegerField(blank=True, null=True)
    owner = models.ForeignKey('Users', models.DO_NOTHING, related_name='artworks_owner_set', blank=True, null=True)  
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)
    painting_type = models.ForeignKey('PaintingType', models.DO_NOTHING)

    class Meta:
        managed = True
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
    is_deleted = models.BooleanField(null=True, default=False)
    phone_number = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'artist_profiles'


class Bid(models.Model):
    id = models.BigAutoField(primary_key=True)
    amount = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    art_work = models.ForeignKey(ArtWorks, models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'bid'


class Blogs(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    duration = models.IntegerField(null=True)
    is_publish = models.BooleanField(null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'blogs'


class CartItem(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    price = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    quantity = models.IntegerField(null=True)
    art_work = models.ForeignKey(ArtWorks, models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'cart_item'


class Catalog(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    owner = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'catalog'


class CatalogArtworks(models.Model):
    catalog = models.ForeignKey(Catalog, models.DO_NOTHING, default=None)
    artwork = models.ForeignKey(ArtWorks, models.DO_NOTHING, default=None)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'catalog_artworks'


class Colab(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    artist = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    requester = models.ForeignKey('Users', models.DO_NOTHING, related_name='colab_requester_set', blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'colab'


class ColabRequest(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    artist = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    requester = models.ForeignKey('Users', models.DO_NOTHING, related_name='colabrequest_requester_set', blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'colab_request'


class Comments(models.Model):
    id = models.BigAutoField(primary_key=True)
    content = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    post = models.ForeignKey('Post', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'comments'


class Events(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    max_registration = models.IntegerField(null=True)
    owner_type = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    owner = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'events'


class EventsMediaKeys(models.Model):
    events = models.ForeignKey(Events, models.DO_NOTHING)
    media_keys = models.CharField(max_length=255, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'events_media_keys'


class EventsMediaUrls(models.Model):
    events = models.ForeignKey(Events, models.DO_NOTHING)
    media_urls = models.CharField(max_length=255, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'events_media_urls'


class Favourite(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    art_work = models.ForeignKey(ArtWorks, models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'favourite'


class Likes(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    post = models.ForeignKey('Post', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'likes'


class MaterialType(models.Model):
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'material_type'


class Medias(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    content_size = models.CharField(max_length=255, blank=True, null=True)
    content_type = models.CharField(max_length=255, blank=True, null=True)
    key = models.CharField(max_length=255, blank=True, null=True)
    public_url = models.TextField(blank=True, null=True)
    art_work = models.ForeignKey(ArtWorks, models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'medias'


class Notification(models.Model):
    id = models.BigAutoField(primary_key=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    message = models.CharField(max_length=255)
    read_status = models.BooleanField(null=True)
    timestamp = models.DateTimeField()
    user = models.ForeignKey('Users', models.DO_NOTHING)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'notification'


class OrderItem(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    admin_share = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    artist_share = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    price = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    quantity = models.IntegerField(null=True)
    art_work = models.ForeignKey(ArtWorks, models.DO_NOTHING, blank=True, null=True)
    order = models.ForeignKey('Orders', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
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
    country_code = models.CharField(max_length=255, blank=True, null=True)
    internal_reference = models.TextField(max_length=255, blank=True, null=True)
    size = models.FloatField(default=0, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    shipping_fees = models.FloatField(default=0, blank=True, null=True)
    total_amount = models.FloatField(default=0, blank=True, null=True)
    amount = models.FloatField(default=0, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    country = models.ForeignKey('order.Country', models.DO_NOTHING, db_column="country", related_name="orders_country", blank=True, null=True)
    owner = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'orders'


class PaintingType(models.Model):
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'painting_type'


class Payment(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    order_status = models.CharField(max_length=255, blank=True, null=True)
    payment_id = models.CharField(max_length=255, blank=True, null=True)
    order = models.ForeignKey(Orders, models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'payment'


class Post(models.Model):
    id = models.BigAutoField(primary_key=True)
    content = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    media_key = models.CharField(max_length=255, blank=True, null=True)
    media_url = models.CharField(max_length=255, blank=True, null=True)
    owner = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'post'


class Promo(models.Model):
    id = models.BigAutoField(primary_key=True)
    amount = models.FloatField(null=True)
    code = models.CharField(unique=True, max_length=255, blank=True, null=True)
    count = models.IntegerField(null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(null=True)
    is_percentage = models.BooleanField(null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'promo'


class Registration(models.Model):
    id = models.BigAutoField(primary_key=True)
    registration_time = models.DateTimeField(blank=True, null=True)
    event = models.ForeignKey(Events, models.DO_NOTHING, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'registration'


class Subscribe(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    artist = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, related_name='subscribe_user_set', blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)

    class Meta:
        managed = True
        db_table = 'subscribe'


class Tickets(models.Model):
    id = models.BigIntegerField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)
    class Meta:
        managed = True
        db_table = 'tickets'


class Transaction(models.Model):
    id = models.BigAutoField(primary_key=True)
    amount = models.DecimalField(max_digits=38, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    initiator_type = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)
    class Meta:
        managed = True
        db_table = 'transaction'


class UserRoles(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING)
    role = models.CharField(max_length=255, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)
    class Meta:
        managed = True
        db_table = 'user_roles'


class Users(models.Model):
    id = models.BigIntegerField(primary_key=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField(null=True, default=False)
    name = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    profile_image = models.CharField(max_length=255, blank=True, null=True)
    profile_image_url = models.TextField(blank=True, null=True)
    registered_at = models.DateTimeField(blank=True, null=True)
    artist_profile = models.OneToOneField(ArtistProfiles, models.DO_NOTHING, blank=True, null=True)
    country = models.ForeignKey('order.Country', models.DO_NOTHING, db_column="country", related_name='users_country', blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)   
    
    class Meta:
        managed = True
        db_table = 'users'
