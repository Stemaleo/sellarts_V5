from django.db import models



class Messages(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey("anka.Tickets", models.DO_NOTHING, blank=True, null=True)
    sender = models.ForeignKey("anka.Users", models.DO_NOTHING, db_column="sender", related_name='messages_sender', blank=True, null=True)
    receiver = models.ForeignKey("anka.Users", models.DO_NOTHING, db_column="receiver", related_name='messages_receiver', blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    is_admin = models.BooleanField(null=True, default=False)
    is_deleted = models.BooleanField(null=True, default=False)
    # is_active = models.BooleanField(null=True, default=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    owner = models.ForeignKey("anka.Users", models.DO_NOTHING, related_name='messages_owner', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'messages'