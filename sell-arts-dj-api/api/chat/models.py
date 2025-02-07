from django.db import models
from anka import models as anka_models

# class Conversations(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     created_at = models.DateTimeField(blank=True, null=True)
#     is_deleted = models.BooleanField(null=True, default=False)
#     owner = models.ForeignKey(anka_models.Users, models.DO_NOTHING, related_name='conversations_owner', blank=True, null=True)
#     class Meta:
#         managed = True
#         db_table = 'conversations'


# class Messages(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     ticket = models.ForeignKey(anka_models.Tickets, models.DO_NOTHING, blank=True, null=True)
#     sender = models.ForeignKey(anka_models.Users, models.DO_NOTHING, db_column="sender", related_name='messages_sender', blank=True, null=True)
#     receiver = models.ForeignKey(anka_models.Users, models.DO_NOTHING, db_column="receiver", related_name='messages_receiver', blank=True, null=True)
#     content = models.TextField(blank=True, null=True)
#     is_admin = models.BooleanField(null=True, default=False)
#     is_deleted = models.BooleanField(null=True, default=False)
#     created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
#     owner = models.ForeignKey(anka_models.Users, models.DO_NOTHING, related_name='messages_owner', blank=True, null=True)

#     class Meta:
#         managed = True
#         db_table = 'messages'