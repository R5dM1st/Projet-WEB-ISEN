-- Suppression des tables existantes
DROP TABLE IF EXISTS Position CASCADE;
DROP TABLE IF EXISTS Bateau CASCADE;
DROP TABLE IF EXISTS Utilisateur CASCADE;

-- Table Bateau (sans référence à TYPE_Bateau)
CREATE TABLE Bateau (
    MMSI INT PRIMARY KEY,
    Nom VARCHAR(50),
    Longueur FLOAT,
    Largeur FLOAT,
    Vessel_type INT -- laissé ici comme simple champ informatif
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
    Status INT DEFAULT 0,
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
