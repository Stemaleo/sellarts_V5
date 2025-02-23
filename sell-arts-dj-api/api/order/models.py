from django.db import models


class Country(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(blank=True, null=True, unique=True, max_length=255)
    code = models.CharField(blank=True, null=True, unique=True, max_length=50)
    is_deleted = models.BooleanField(null=True, default=False)
    is_active = models.BooleanField(null=True, default=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    owner = models.ForeignKey("anka.Users", models.DO_NOTHING, related_name='country_owner', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'country'