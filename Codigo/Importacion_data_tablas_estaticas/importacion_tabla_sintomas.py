import pandas as pd
import psycopg2
from dotenv import load_dotenv
import os

# Load the CSV file
csv_path = './Symptoms.csv'
df = pd.read_csv(csv_path, encoding='latin1', sep=';')

# Load environment variables from .env file
load_dotenv()

# Database connection details from environment variables
db_params = {
    "dbname": os.getenv("PG_DATABASE"),
    "user": os.getenv("PG_USER"),
    "password": os.getenv("PG_PASSWORD"),
    "host": os.getenv("PG_HOST"),
    "port": os.getenv("PG_PORT")
}

# Connect to PostgreSQL
try:
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()
    print("Connected to the database.")

    # Insert data into the Symptoms table
    for _, row in df.iterrows():
        insert_query = """
        INSERT INTO "Symptoms" (name, severity, nombre, grupo_sintomatico)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            row['Symptom'],    # name
            row['weight'],     # severity
            row['sintoma'],    # nombre
            row['grupo_sintomatico']  # grupo_sintomatico
        ))
    conn.commit()
    print("Data inserted successfully.")

except Exception as e:
    print(f"Error: {e}")
finally:
    if conn:
        cursor.close()
        conn.close()
        print("Database connection closed.")
