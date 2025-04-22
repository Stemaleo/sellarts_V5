from django.db import models


class EventArtwork(models.Model):
    event = models.ForeignKey("anka.Events", models.DO_NOTHING, blank=True, null=True)
    artwork = models.ForeignKey("anka.ArtWorks", models.DO_NOTHING, blank=True, null=True)
    added_by = models.ForeignKey("anka.Users", models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(null=True, default=False, blank=True)
    is_active = models.BooleanField(null=True, default=True, blank=True)

    class Meta:
        managed = True
        db_table = 'event_artwork'