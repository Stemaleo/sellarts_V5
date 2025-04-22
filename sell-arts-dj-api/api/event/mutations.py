import graphene
from anka import models as anka_models
from . import models as event_models, types as event_types
from . import meta

class FeatureAddArtworkToEvent(graphene.Mutation):
    event: event_types.EventType = graphene.Field(event_types.EventType)
    success: bool = graphene.Boolean(required=True)
    message: str = graphene.String(required=True)
    
    class Arguments:
        event = graphene.ID(required=True, description="Event ID")
        artworks = graphene.List(graphene.ID, required=True, description="List of artwork IDs")

    class Meta:
        description = meta.FeatureAddArtworkToEvent

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            event = anka_models.Events.objects.get(id=kwargs['event'])
            artworks = anka_models.ArtWorks.objects.filter(id__in=kwargs['artworks'])
            for artwork in artworks:
                if not event_models.EventArtwork.objects.filter(event=event, artwork=artwork, is_deleted=False).exists():
                    event_models.EventArtwork.objects.create(event=event, artwork=artwork)
                    
            return FeatureAddArtworkToEvent(event=event, success=True, message="Artworks added to event successfully")
        except Exception as e:
            return FeatureAddArtworkToEvent(
                success=False,
                message=str(e),
                event=None
            )

class FeatureRemoveArtworkFromEvent(graphene.Mutation):
    event: event_types.EventType = graphene.Field(event_types.EventType)
    success: bool = graphene.Boolean(required=True)
    message: str = graphene.String(required=True)
    
    class Arguments:
        event = graphene.ID(required=True, description="Event ID")
        artworks = graphene.List(graphene.ID, required=True, description="List of artwork IDs")
        
    class Meta:
        description = meta.FeatureRemoveArtworkFromEvent
        
    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            event = anka_models.Events.objects.get(id=kwargs['event'])
            artworks = anka_models.ArtWorks.objects.filter(id__in=kwargs['artworks'])
            for artwork in artworks:
                event_models.EventArtwork.objects.filter(event=event, artwork=artwork).update(is_deleted=True)
            return FeatureRemoveArtworkFromEvent(event=event, success=True, message="Artworks removed from event successfully")
        except Exception as e:
            return FeatureRemoveArtworkFromEvent(
                success=False,
                message=str(e),
                event=None
            )

# class FeatureUpdateEvent(graphene.Mutation):
#     event: event_types.EventType = graphene.Field(event_types.EventType)
#     success: bool = graphene.Boolean(required=True)
#     message: str = graphene.String(required=True)
