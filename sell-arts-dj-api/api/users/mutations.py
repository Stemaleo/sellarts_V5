import graphene
from . import meta as meta
from anka import models as anka_models, types as anka_types
import traceback

class FeatureDeleteUsers(graphene.Mutation):
    """
    Mutation to delete multiple users by setting their `registered_at` field to None.
    """

    success: bool = graphene.Boolean(description="Indicates whether the users were successfully deleted.")
    message: str = graphene.String(description="Response message indicating success or failure.")
    users: anka_models.Users = graphene.List(anka_types.UsersType, description="List of deleted user objects.")

    class Arguments:
        users = graphene.List(
            graphene.ID,
            required=True,
            description="List of user IDs to delete."
        )

    class Meta:
        description = meta.feature_delete_users

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            users_to_delete = anka_models.Users.objects.filter(id__in=kwargs['users'])
            if not users_to_delete.exists():
                return FeatureDeleteUsers(
                    success=False, message="No matching users found for deletion."
                )
                
            users_to_delete.update(email=None)

            return FeatureDeleteUsers(
                success=True, message="Users successfully deleted.", users=list(users_to_delete)
            )
        except Exception as error:
            error_trace = traceback.format_exc()
            return FeatureDeleteUsers(
                success=False, message=f"Error while deleting the users: {error_trace}"
            )
