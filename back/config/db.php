<?php
function db_connect() {
    $host = 'localhost';
    $dbname = 'projet_web_isen_bateau';
    $username = 'projet_web';
    $password = '123';

    try {
        $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die('Erreur de connexion à la base de données : ' . $e->getMessage());
    }
}
?>