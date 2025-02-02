import os

command = """curl -X POST  https://api.anka.fyi/v1/payment/links \
-H "Authorization: Token FqvbsxHBxTKmbZyNcPvvNbFm" \
-H "Accept: application/vnd.api+json" \
-H "charset: utf-8" \
-d '{
"data": {
"type": "payment_links",
"attributes": {
"title": "Exemple de lien de paiement intégré",
"description": "Lorem ipsum est un texte de remplissage",
"amount_cents": 6000,
"amount_currency": "EUR",
"shippable": true,
"reusable": false,
"callback_url": "https://www.example.com/success",
"order_reference": "SIPL01",
"buyer": {
"contact": {
"fullname": "Ulrich Takam",
"phone_number": "+330137706472",
"email": "ulrich@anka.dev"
},
"address": {
"street_line_1": "Av. Montaigne",
"street_line_2": "",
"city": "Paris",
"state": "IDF",
"zip": "75008",
"country": "FR"
}
}
}
}
}'"""

os.system(command)
