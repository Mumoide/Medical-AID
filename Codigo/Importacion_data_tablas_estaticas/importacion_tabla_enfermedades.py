import pandas as pd
import psycopg2
from dotenv import load_dotenv
import os

# Load the CSV file
csv_path = './Descripcion_enfermedades_ingles_espanhol.csv'
df = pd.read_csv(csv_path, sep=';')

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
    
    # Insert data into the Disease table
    for index, row in df.iterrows():
        insert_query = """
        INSERT INTO "Disease" (name, description, precaution_1, precaution_2, precaution_3, precaution_4, nombre, descripcion, precaucion_1, precaucion_2, precaucion_3, precaucion_4)
        VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            #index + 1,  # id_disease (we generate this)
            row['Disease'],  # name
            row['Description'],  # description
            row['Precaution_1'],  # precaution_1
            row['Precaution_2'],  # precaution_2
            row['Precaution_3'],  # precaution_3
            row['Precaution_4'],  # precaution_4
            row['Enfermedad'],  # nombre
            row['Descripcion'],  # descripcion
            row['Precaucion_1'],  # precaucion_1
            row['Precaucion_2'],  # precaucion_2
            row['Precaucion_3'],  # precaucion_3
            row['Precaucion_4']  # precaucion_4
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
