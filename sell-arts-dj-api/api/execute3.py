
import psycopg2
DATABASE_NAME = "sellarts"
DATABASE_USER = "postgres"
DATABASE_PASSWORD = "FoD,Q]m6Get>;H7a"
DATABASE_HOST = "104.236.221.101"
DATABASE_PORT = "5432"

def delete_all_deleted_users_data():
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

        # Update emails for all deleted users
        print("Updating emails for all deleted users...")
        cursor.execute("""
            UPDATE users
            SET email = email || '+' || id || 'deleted user'
            WHERE is_deleted = TRUE
        """)
        print("Emails updated.")

        # Delete artist profiles for all deleted users
        print("Deleting artist profiles for all deleted users...")
        cursor.execute("""
            UPDATE artist_profiles
            SET is_deleted = TRUE
            WHERE user_id IN (SELECT id FROM users WHERE is_deleted = TRUE)
        """)
        print("Artist profiles deleted.")

        # Delete artworks for all deleted users
        print("Deleting artworks for all deleted users...")
        cursor.execute("""
            UPDATE art_works
            SET is_deleted = TRUE
            WHERE owner_id IN (SELECT id FROM users WHERE is_deleted = TRUE)
            OR artist_id IN (SELECT id FROM users WHERE is_deleted = TRUE)
        """)
        print("Artworks deleted.")

        connection.commit()
        print("All changes committed to the database.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cursor:
            cursor.close()
            print("Cursor closed.")
        if connection:
            connection.close()
            print("Connection closed.")

delete_all_deleted_users_data()