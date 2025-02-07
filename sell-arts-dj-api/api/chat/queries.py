class WalletTransactionsQuery(graphene.ObjectType):      
    WalletTransactionsNode = DjangoConnectionField(types.WalletTransactionsType)