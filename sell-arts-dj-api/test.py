import requests
import logging

logger = logging.getLogger(__name__)

def verify_shipping_label(reference="5VPK8SELLARTS37772162_715"):
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



def check_file_exists(file_path):
    """
    Check if a file exists at the given path.
    
    Args:
        file_path (str): Path to the file to check
        
    Returns:
        bool: True if file exists, False otherwise
    """
    try:
        import os
        exists = os.path.exists(file_path)
        logger.debug(f"Checking if file exists at path: {file_path}")
        return exists
    except Exception as e:
        logger.error(f"Error checking if file exists: {str(e)}")
        return False

if __name__ == "__main__":
    test_path = "test.txt"
    if check_file_exists(test_path):
        print(f"File exists at {test_path}")
    else:
        print(f"File does not exist at {test_path}")

