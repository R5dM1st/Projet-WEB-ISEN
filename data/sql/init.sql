DROP TABLE IF EXISTS Position CASCADE;
DROP TABLE IF EXISTS Bateau CASCADE;
DROP TABLE IF EXISTS TYPE_Bateau CASCADE;
DROP TABLE IF EXISTS Utilisateur CASCADE;

-- Table TYPE_Bateau
CREATE TABLE TYPE_Bateau (
    Vessel_type INT PRIMARY KEY,
    Labelle VARCHAR(50)
);

-- Table Bateau
CREATE TABLE Bateau (
    MMSI INT PRIMARY KEY,
    Nom VARCHAR(50),
    Longueur FLOAT,
    Largeur FLOAT,
    Vessel_type INT,
    FOREIGN KEY (Vessel_type) REFERENCES TYPE_Bateau(Vessel_type)
);

-- Table Position
CREATE TABLE Position (
    id SERIAL PRIMARY KEY,
    Date_Heure TIMESTAMP,
    Latitude FLOAT,
    Longitude FLOAT,
    Draft FLOAT,
    Vitesse FLOAT,
    CAP FLOAT,
    Heading FLOAT,
    Status int default 0,
    MMSI INT,
    FOREIGN KEY (MMSI) REFERENCES Bateau(MMSI)
);

-- Table Utilisateur
CREATE TABLE Utilisateur (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
);