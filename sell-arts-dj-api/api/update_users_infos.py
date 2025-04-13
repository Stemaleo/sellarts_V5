import psycopg2
import requests

DATABASE_NAME = "sellarts"
DATABASE_USER = "postgres"
DATABASE_PASSWORD = "@satoshi"
DATABASE_HOST = "localhost" 
DATABASE_PORT = "5432"

def update_users_infos():
    try:
        print("Connecting to the database...")
        connection = psycopg2.connect(
            dbname=DATABASE_NAME,
            user=DATABASE_USER,
            password=DATABASE_PASSWORD,
            host=DATABASE_HOST,
            port=DATABASE_PORT
        )
        cursor = connection.cursor()
        print("Connection established.")

        # Get all users and their countries joined with country table
        print("Fetching users...")
        cursor.execute("""
            SELECT u.id, c.code 
            FROM users u
            LEFT JOIN country c ON u.country = c.id
        """)
        users = cursor.fetchall()

        for user_id, country_code in users:
            if not country_code:
                continue

            # Get country capital info from API
            response = requests.get(f"https://restcountries.com/v3.1/alpha/{country_code}")
            if response.status_code != 200:
                continue

            country_data = response.json()[0]
            capital = country_data['capital'][0]
            country_name = country_data['name']['common']

            # Update user info with capital city data
            # TODO: Add phone number
            cursor.execute("""
                UPDATE users 
                SET city = %s,
                    country_code = %s,
                    country_text = %s,
                    state = %s,
                    zip = '10000',
                    street_line_1 = %s,
                    phone_number = '+2250584126189'
                WHERE id = %s
            """, (
                capital,
                country_code,
                country_name,
                capital + " Region",
                capital + " Main Street 1",
                user_id
            ))
            print(f"Updated user {user_id} with {capital}, {country_name} info")

        connection.commit()
        print("All users updated successfully")
    except Exception as e:
        print(f"An error occurred: {e}")
        if connection:
            connection.rollback()
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

update_users_infos()