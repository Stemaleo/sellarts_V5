import graphene
from . import mutations as mutations
from . import queries as queries
from . import types as types
from query_optimizer.fields import DjangoConnectionField


class Query(graphene.ObjectType):
    methods = DjangoConnectionField(types.MethodsType)
    styles = DjangoConnectionField(types.StylesType)
    artworks = DjangoConnectionField(types.ArtworksType)
    material_types = DjangoConnectionField(types.MaterialTypeType)
    medias = DjangoConnectionField(types.MediasType)
class Mutation(graphene.ObjectType):
    feature_create_method = mutations.FeatureCreateMethod.Field()
    feature_update_method = mutations.FeatureUpdateMethod.Field()
    feature_update_method_deletions = mutations.FeatureUpdateMethodDeletions.Field()    
    feature_create_style = mutations.FeatureCreateStyle.Field()
    feature_update_style = mutations.FeatureUpdateStyle.Field()
    feature_update_style_deletions = mutations.FeatureUpdateStylesDeletions.Field()
    feature_update_artwork_method_and_style = mutations.FeatureUpdateArtworkMethodAndStyle.Field()
    feature_update_artwork_deletions = mutations.FeatureUpdateArtworkDeletions.Field()  
    feature_update_artwork_stock = mutations.FeatureUpdateArtworkStock.Field()
    