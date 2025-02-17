from django.db import models



class Methods(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False, null=True)
    is_active = models.BooleanField(default=True, null=True)
    owner = models.ForeignKey("anka.Users", models.DO_NOTHING, related_name='methods_owner', blank=True, null=True)
    
    class Meta:
        managed = True
        db_table = 'methods'
        
        
class Styles(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False, null=True)
    is_active = models.BooleanField(default=True, null=True)
    owner = models.ForeignKey("anka.Users", models.DO_NOTHING, related_name='styles_owner', blank=True, null=True)
    
    class Meta:
        managed = True
        db_table = 'styles'