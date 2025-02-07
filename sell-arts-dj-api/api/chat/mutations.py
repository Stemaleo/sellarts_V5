import graphene
from . import meta as meta, models as models, types as types
from anka import models as anka_models
import traceback


class FeatureSendMessage(graphene.Mutation):
    """
    Mutation to send a message within a specific ticket.
    """
    

    success: bool = graphene.Boolean(description="Indicates whether the message was successfully sent.")
    message: str = graphene.String(description="Response message in case of success or error.")
    anka_message: models.Messages = graphene.Field(types.MessagesType, description="The created message object.")

    class Arguments:
        ticket = graphene.ID(
            required=True, 
            description="ID of the ticket to which the message is linked."
        )
        sender = graphene.ID(
            required=True, 
            description="ID of the user sending the message."
        )
        receiver = graphene.ID(
            required=True, 
            description="ID of the user receiving the message."
        )
        is_admin = graphene.Boolean(
            default_value=False, 
            description="Indicates whether the message is from an administrator."
        )
        content = graphene.String(
            default_value="", 
            description="Content of the message being sent."
        )
    class Meta:
        description = meta.feature_send_message
    
    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            kwargs['ticket'] = anka_models.Tickets.objects.get(id=kwargs['ticket'])
            kwargs['sender'] = anka_models.Users.objects.get(id=kwargs['sender'])
            kwargs['receiver'] = anka_models.Users.objects.get(id=kwargs['receiver'])
            kwargs['owner'] = kwargs['sender']
            message = models.Messages.objects.create(**kwargs)
            return FeatureSendMessage(
                success=True, message="Message successfully sent.", anka_message=message
            )
        except Exception as error:
            error = traceback.format_exc()
            return FeatureSendMessage(
                success=False, message=f"Error while sending the message: {error}"
            )
