import psycopg2
DATABASE_NAME = "sellarts"
DATABASE_USER = "postgres"
DATABASE_PASSWORD = "FoD,Q]m6Get>;H7a"
DATABASE_HOST = "64.227.21.130"
DATABASE_PORT = "5432"
DEBUG_MODE = True
ALLOWED_HOSTS = ["localhost"]
GRAPHIQL_MODE = True    
SELLARTS_KEY = "SELLARTS_KEY"
ANKA_TOKEN = "FqvbsxHBxTKmbZyNcPvvNbFm"
REQUIRED_AUTHENTICATION = False


# Paramètres de connexion à PostgreSQL
DB_CONFIG = {
    "dbname": DATABASE_NAME,
    "user": DATABASE_USER,
    "password": DATABASE_PASSWORD,
    "host": DATABASE_HOST,
    "port": DATABASE_PORT
}


conn = psycopg2.connect(**DB_CONFIG)
conn.autocommit = True
cursor = conn.cursor()

cursor.execute("""
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
""")
tables = cursor.fetchall()

for (table_name,) in tables:
    cursor.execute(f"""
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = %s AND column_name IN ('is_deleted', 'is_active', 'size', 'shipping_fees');
    """, (table_name,))
    columns = {row[0] for row in cursor.fetchall()}

    if columns:
        print(f"🔄 Ajout du trigger pour {table_name}")

        cursor.execute(f"DROP TRIGGER IF EXISTS trigger_set_defaults_{table_name} ON {table_name};")
        cursor.execute(f"DROP FUNCTION IF EXISTS set_defaults_{table_name}();")

        function_sql = f"""
        CREATE FUNCTION set_defaults_{table_name}() RETURNS TRIGGER AS $$
        BEGIN
            {'IF NEW.is_deleted IS NULL THEN NEW.is_deleted := false; END IF;' if 'is_deleted' in columns else ''}
            {'IF NEW.is_active IS NULL THEN NEW.is_active := true; END IF;' if 'is_active' in columns else ''}
            {'IF NEW.size IS NULL THEN NEW.size := 0; END IF;' if 'size' in columns else ''}
            {'IF NEW.shipping_fees IS NULL THEN NEW.shipping_fees := 0; END IF;' if 'shipping_fees' in columns else ''}
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        """
        cursor.execute(function_sql)

        trigger_sql = f"""
        CREATE TRIGGER trigger_set_defaults_{table_name}
        BEFORE INSERT ON {table_name}
        FOR EACH ROW EXECUTE FUNCTION set_defaults_{table_name}();
        """
        cursor.execute(trigger_sql)

        # Supprimer les valeurs par défaut existantes si elles sont définies
        for col in columns:
            cursor.execute(f"ALTER TABLE {table_name} ALTER COLUMN {col} DROP DEFAULT;")

print("✅ Triggers appliqués et valeurs par défaut supprimées.")

cursor.close()
conn.close()
