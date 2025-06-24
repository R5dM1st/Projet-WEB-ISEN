<?php
require_once '../config/db.php';
$pdo = db_connect();

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT MMSI, Nom FROM Bateau ORDER BY Nom");
    $bateaux = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $bateaux]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
