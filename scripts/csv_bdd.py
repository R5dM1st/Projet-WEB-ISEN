import csv
import psycopg2

# Connexion à la base PostgreSQL
conn_params = {
    "host": "localhost",
    "port": 5432,
    "database": "projet_web_isen_bateau",
    "user": "projet_web",
    "password": "123"
}

def creer_tables(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Bateau (
            MMSI INT PRIMARY KEY,
            Nom VARCHAR(50),
            Longueur FLOAT,
            Largeur FLOAT,
            Vessel_type INT
        )
    """)
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Position (
            id SERIAL PRIMARY KEY,
            Date_Heure TIMESTAMP,
            Latitude FLOAT,
            Longitude FLOAT,
            Draft FLOAT,
            Vitesse FLOAT,
            CAP FLOAT,
            Heading FLOAT,
            Status INT DEFAULT 0,
            MMSI INT,
            FOREIGN KEY (MMSI) REFERENCES Bateau(MMSI)
        )
    """)

def inserer_bateau(cur, mmsi, nom, longueur, largeur, vessel_type):
    cur.execute("""
        INSERT INTO Bateau (MMSI, Nom, Longueur, Largeur, Vessel_type)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (MMSI) DO NOTHING
    """, (mmsi, nom, longueur, largeur, vessel_type))

def inserer_position(cur, date_heure, lat, lon, draft, sog, cog, heading, status, mmsi):
    cur.execute("""
        INSERT INTO Position (Date_Heure, Latitude, Longitude, Draft, Vitesse, CAP, Heading, Status, MMSI)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (date_heure, lat, lon, draft, sog, cog, heading, status, mmsi))

def import_csv_dans_bdd(fichier_csv):
    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()

        creer_tables(cur)

        with open(fichier_csv, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)

            for i, row in enumerate(reader, start=1):
                try:
                    if not row["MMSI"].isdigit():
                        print(f"⚠️ Ligne {i} ignorée (MMSI invalide)")
                        continue

                    mmsi = int(row["MMSI"])
                    nom = row["VesselName"]
                    longueur = float(row["Length"])
                    largeur = float(row["Width"])
                    vessel_type = int(row["VesselType"])

                    # Champs position
                    date_heure = row["BaseDateTime"]
                    lat = float(row["LAT"])
                    lon = float(row["LON"])
                    draft = float(row["Draft"])
                    sog = float(row["SOG"])
                    cog = float(row["COG"])
                    heading = float(row["Heading"])
                    status = int(row["Status"]) if row["Status"].isdigit() else 0

                    inserer_bateau(cur, mmsi, nom, longueur, largeur, vessel_type)
                    inserer_position(cur, date_heure, lat, lon, draft, sog, cog, heading, status, mmsi)

                except Exception as e:
                    print(f"❌ Erreur ligne {i} : {e}")

        conn.commit()
        cur.close()
        conn.close()
        print("✅ Importation terminée avec succès.")

    except Exception as e:
        print(f"❌ Erreur de connexion ou d'exécution : {e}")

if __name__ == "__main__":
    import_csv_dans_bdd("vessel-clean-final.csv")
