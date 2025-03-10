import graphene
from . import meta as meta
from anka import models as anka_models
from order import models as order_models
from . import types as types
import traceback
import traceback
import graphene
from django.db import transaction

class FeatureUpdateUsersDeletions(graphene.Mutation):
    """
    Mutation to delete or restore multiple users by setting their `is_deleted` field accordingly.
    """

    success: bool = graphene.Boolean(description="Indicates whether the operation was successful.")
    message: str = graphene.String(description="Response message indicating success or failure.")
    users: list[anka_models.Users] = graphene.List(types.UsersType, description="List of updated user objects.")

    class Arguments:
        users = graphene.List(
            graphene.ID,
            required=True,
            description="List of user IDs to delete or restore."
        )
        delete = graphene.Boolean(
            required=True, 
            description="Set to `true` to delete users, or `false` to restore them."
        )

    class Meta:
        description = meta.feature_update_users_deletions

    @classmethod
    def mutate(cls, root, info, users, delete):
        try:
            with transaction.atomic():
                users_to_update = anka_models.Users.objects.filter(id__in=users)

                if not users_to_update.exists():
                    return FeatureUpdateUsersDeletions(
                        success=False, message="No matching users found."
                    )

                for user in users_to_update:
                    user.is_deleted = delete
                    if delete:
                        user.email = f"{user.email}+{user.id}deleted user"
                    user.save()
                    anka_models.ArtistProfiles.objects.filter(user=user).update(is_deleted=delete)
                    anka_models.ArtWorks.objects.filter(owner=user).update(is_deleted=delete)
  
                action = "deleted" if delete else "restored"
                return FeatureUpdateUsersDeletions(
                    success=True, 
                    message=f"Users successfully {action}.", 
                    users=list(users_to_update)
                )
        except Exception as error:
            error = traceback.format_exc()
            return FeatureUpdateUsersDeletions(
                success=False, message=f"Error while updating users: {error}"
            )


class FeatureUpdateUsersActivation(graphene.Mutation):
    """
    Mutation to activate or deactivate multiple users by updating their `is_active` field.
    """

    success: bool = graphene.Boolean(description="Indicates whether the users were successfully updated.")
    message: str = graphene.String(description="Response message indicating success or failure.")
    users: list[anka_models.Users] = graphene.List(types.UsersType, description="List of updated user objects.")

    class Arguments:
        users = graphene.List(
            graphene.ID,
            required=True,
            description="List of user IDs to update."
        )
        active = graphene.Boolean(
            required=True,
            default_value=False,
            description="Set to `true` to activate the users, or `false` to deactivate them."
        )

    class Meta:
        description = meta.feature_update_users_activation

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            with transaction.atomic():
                users_to_update = anka_models.Users.objects.filter(id__in=kwargs['users'])
                
                if not users_to_update.exists():
                    return FeatureUpdateUsersActivation(
                        success=False, message="No matching users found."
                    )

                users_to_update.update(is_active=kwargs['active'])

                action = "activated" if kwargs['active'] else "deactivated"
                return FeatureUpdateUsersActivation(
                    success=True,
                    message=f"Users successfully {action}.",
                    users=list(users_to_update)
                )

        except Exception as error:
            error = traceback.format_exc()
            return FeatureUpdateUsersActivation(
                success=False,
                message=f"An error occurred while updating users: {error}"
            )


class FeatureUpdateUserCountry(graphene.Mutation):
    """
    Mutation to update the country of a user.
    """

    success = graphene.Boolean(description="Whether the operation was successful")
    message = graphene.String(description="Success/error message")
    user = graphene.Field(types.UsersType, description="Updated user")

    class Arguments:
        user = graphene.ID(required=True, description="ID of the user to update")
        country = graphene.ID(required=True, description="ID of the country to set")

    class Meta:
        description = "Update a user's country"

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            with transaction.atomic():
                user = anka_models.Users.objects.filter(id=kwargs['user']).first()

                if not user:
                    return FeatureUpdateUserCountry(
                        success=False,
                        message="User not found"
                    )

                country = order_models.Country.objects.filter(id=kwargs['country']).first()

                if not country:
                    return FeatureUpdateUserCountry(
                        success=False,
                        message="Country not found"
                    )

                user.country = country
                user.save()

                return FeatureUpdateUserCountry(
                    success=True,
                    message="User country updated successfully",
                    user=user
                )

        except Exception as error:
            error = traceback.format_exc()
            return FeatureUpdateUserCountry(
                success=False,
                message=f"An error occurred while updating user country: {error}"
            )

