import requests
import logging

logger = logging.getLogger(__name__)

def verify_shipping_label(reference="7QOWlSELLARTS44314888_706"):
    try:
        headers = {
            "Authorization": "Token FqvbsxHBxTKmbZyNcPvvNbFm",
            "Accept": "application/vnd.api+json",
            "Content-Type": "application/json",
        }

        response = requests.get(
            f"https://api.anka.fyi/v1/shipment/labels/{reference}",
            headers=headers,
        )

        if response.status_code == 200:
            shipping_data = response.json()
            logger.info(f"Successfully retrieved shipping label status for {reference}")
            return shipping_data
        else:
            logger.error(f"Failed to get shipping label status: {response.status_code}")
            return None

    except Exception as e:
        logger.error(f"Error verifying shipping label: {str(e)}")
        return None

if __name__ == "__main__":
    result = verify_shipping_label()
    if result:
        print(f"Shipping label status: {result}")
    else:
        print("Failed to verify shipping label status")
