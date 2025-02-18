import graphene
from . import meta as meta, models as models, types as types
from anka import models as anka_models, types as anka_types
from django.db import transaction
import traceback


# Methods
class FeatureCreateMethod(graphene.Mutation):
    """
    Mutation to create a new method.
    """

    success: bool = graphene.Boolean(description="Indicates whether the method was successfully created.")
    message: str = graphene.String(description="Response message indicating success or failure.")
    method: models.Methods = graphene.Field(types.MethodsType, description="The created method object.")

    class Arguments:
        name = graphene.String(required=True, description="Method's name")
        
    class Meta:
        description = meta.feature_create_method

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            method = models.Methods.objects.create(
                name=kwargs["name"]
            )
            return FeatureCreateMethod(success=True, message="Method created successfully.", method=method)
        except Exception as error:
            return FeatureCreateMethod(success=False, message=f"Error creating method: {str(error)}", method=None)
        

class FeatureUpdateMethod(graphene.Mutation):
    """
    Mutation to modify an existing method.
    """

    success: bool = graphene.Boolean(description="Indicates whether the method was successfully updated.")
    message: str = graphene.String(description="Response message indicating success or failure.")
    method: models.Methods = graphene.Field(types.MethodsType, description="The updated method object.")

    class Arguments:
        id = graphene.ID(required=True, description="ID of the method to be updated.")
        name = graphene.String(required=True, description="New name of the method.")
    
    class Meta:
        description = meta.feature_update_method

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            method = models.Methods.objects.get(id=kwargs['id'])
            method.name = kwargs['name']
            method.save()
            return FeatureUpdateMethod(success=True, message="Method updated successfully.", method=method)
        except models.Methods.DoesNotExist:
            return FeatureUpdateMethod(success=False, message="Method not found.", method=None)
        except Exception as error:
            return FeatureUpdateMethod(success=False, message=f"Error updating method: {str(error)}", method=None)


class FeatureUpdateMethodDeletions(graphene.Mutation):
    """
    Mutation to delete or restore multiple methods by setting their `is_deleted` field accordingly.
    """

    success: bool = graphene.Boolean(description="Indicates whether the operation was successful.")
    message: str = graphene.String(description="Response message indicating success or failure.")
    methods: list[models.Methods] = graphene.List(types.MethodsType, description="List of updated methods objects.")

    class Arguments:
        methods = graphene.List(
            graphene.ID,
            required=True,
            description="List of methods IDs to delete or restore."
        )
        delete = graphene.Boolean(
            required=True, 
            description="Set to `true` to delete users, or `false` to restore them."
        )

    class Meta:
        # description = meta.feature_update_users_deletions
        pass

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            with transaction.atomic():
                methods_to_update = models.Methods.objects.filter(id__in=kwargs['methods'])

                if not methods_to_update.exists():
                    return FeatureUpdateMethodDeletions(
                        success=False, message="No matching methods found."
                    )

                methods_to_update.update(is_deleted=kwargs['delete'])

                action = "deleted" if kwargs['delete'] else "restored"
                return FeatureUpdateMethodDeletions(
                    success=True, 
                    message=f"methods successfully {action}.", 
                    methods=list(methods_to_update)
                )
        except Exception as error:
            error = traceback.format_exc()
            return FeatureUpdateMethodDeletions(
                success=False, message=f"Error while updating methods: {error}"
            )




# Styles
class FeatureCreateStyle(graphene.Mutation):
    """
    Mutation to create a new styles.
    """

    success: bool = graphene.Boolean(description="Indicates whether the style was successfully created.")
    message: str = graphene.String(description="Response message indicating success or failure.")
    style: models.Styles = graphene.Field(types.StylesType, description="The created style object.")

    class Arguments:
        name = graphene.String(required=True, description="style's name")
        
    class Meta:
        # description = meta.feature_create_Styles
        pass

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            style = models.Styles.objects.create(
                name=kwargs["name"]
            )
            return FeatureCreateStyle(success=True, message="style created successfully.", style=style)
        except Exception as error:
            return FeatureCreateStyle(success=False, message=f"Error creating style: {str(error)}", style=None)
        

class FeatureUpdateStyle(graphene.Mutation):
    """
    Mutation to modify an existing styles.
    """

    success: bool = graphene.Boolean(description="Indicates whether the styles was successfully updated.")
    message: str = graphene.String(description="Response message indicating success or failure.")
    style: models.Styles = graphene.Field(types.StylesType, description="The updated style object.")

    class Arguments:
        id = graphene.ID(required=True, description="ID of the styles to be updated.")
        name = graphene.String(required=True, description="New name of the style.")
    
    class Meta:
        # description = meta.feature_update_Styles
        pass
    
    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            style = models.Styles.objects.get(id=kwargs['id'])
            style.name = kwargs['name']
            style.save()
            return FeatureUpdateStyle(success=True, message="style updated successfully.", style=style)
        except models.Styless.DoesNotExist:
            return FeatureUpdateStyle(success=False, message="style not found.", style=None)
        except Exception as error:
            return FeatureUpdateStyle(success=False, message=f"Error updating style: {str(error)}", style=None)


class FeatureUpdateStylesDeletions(graphene.Mutation):
    """
    Mutation to delete or restore multiple styles by setting their `is_deleted` field accordingly.
    """

    success: bool = graphene.Boolean(description="Indicates whether the operation was successful.")
    message: str = graphene.String(description="Response message indicating success or failure.")
    styles: list[models.Styles] = graphene.List(types.StylesType, description="List of updated styles objects.")

    class Arguments:
        styles = graphene.List(
            graphene.ID,
            required=True,
            description="List of styles IDs to delete or restore."
        )
        delete = graphene.Boolean(
            required=True, 
            description="Set to `true` to delete styles, or `false` to restore them."
        )

    class Meta:
        # description = meta.feature_update_users_deletions
        pass

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            with transaction.atomic():
                styles_to_update = models.Styles.objects.filter(id__in=kwargs['styles'])

                if not styles_to_update.exists():
                    return FeatureUpdateStylesDeletions(
                        success=False, message="No matching styles found."
                    )

                styles_to_update.update(is_deleted=kwargs['delete'])

                action = "deleted" if kwargs['delete'] else "restored"
                return FeatureUpdateStylesDeletions(
                    success=True, 
                    message=f"styles successfully {action}.", 
                    Styles=list(styles_to_update)
                )
        except Exception as error:
            error = traceback.format_exc()
            return FeatureUpdateStylesDeletions(
                success=False, message=f"Error while updating styles: {error}"
            )






class FeatureUpdateArtworkMethodAndStyle(graphene.Mutation):
    """
    Mutation to update method and style on a atwork.
    """

    success: bool = graphene.Boolean(description="Indicates whether the operation was successful.")
    message: str = graphene.String(description="Response message indicating success or failure.")
    artwork: anka_models.ArtWorks = graphene.List(types.ArtworksType, description="updated artwork objects.")

    class Arguments:
        method = graphene.ID(
            required=True,
            description="List of styles IDs to delete or restore."
        )
        style = graphene.ID(
            required=True, 
            description="Set to `true` to delete styles, or `false` to restore them."
        )        
        artwork = graphene.ID(
            required=True, 
            description="Set to `true` to delete styles, or `false` to restore them."
        )

    class Meta:
        # description = meta.feature_update_users_deletions
        pass

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            with transaction.atomic():
                style = models.Styles.objects.filter(id=kwargs['style'], is_deleted=False)
                if not style.exists():
                    return FeatureUpdateArtworkMethodAndStyle(
                        success=False, message="No matching style found."
                    )
                    
                method = models.Methods.objects.filter(id=kwargs['method'], is_deleted=False)      
                if not method.exists():
                    return FeatureUpdateArtworkMethodAndStyle(
                        success=False, message="No matching method found."
                    )
                
                artwork = anka_models.ArtWorks.objects.filter(id=kwargs['artwork'])
                if not artwork.exists():
                    return FeatureUpdateArtworkMethodAndStyle(
                        success=False, message="No matching artwork found."
                    )
                
                artwork.update(method=kwargs['method'], style=kwargs['style'])
                action = "updated"
                
                return FeatureUpdateArtworkMethodAndStyle(
                    success=True, 
                    message=f"method and style successfully {action}.", 
                    artwork=artwork
                )
        except Exception as error:
            error = traceback.format_exc()
            return FeatureUpdateArtworkMethodAndStyle(
                success=False, message=f"Error while updating artwork method and style: {error}"
            )
















































# class ActivateDeactivateMethod(graphene.Mutation):
#     """
#     Mutation pour activer ou désactiver une méthode.
#     """

#     success = graphene.Boolean()
#     message = graphene.String()
#     method = graphene.Field(MethodsType)

#     class Arguments:
#         name = graphene.String(required=True, description="Nom de la méthode.")
#         active = graphene.Boolean(required=True, description="True pour activer, False pour désactiver.")

#     @classmethod
#     def mutate(cls, root, info, name, active):
#         try:
#             method = Methods.objects.filter(name=name).first()
#             if not method:
#                 return ActivateDeactivateMethod(success=False, message="Method not found.", method=None)

#             method.is_active = active
#             method.save()
#             action = "activated" if active else "deactivated"
#             return ActivateDeactivateMethod(success=True, message=f"Method successfully {action}.", method=method)
#         except Exception as error:
#             return ActivateDeactivateMethod(success=False, message=f"Error updating method: {str(error)}", method=None)

