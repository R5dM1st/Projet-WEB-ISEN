<?php
header('Content-Type: application/json');
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

// Vérifie les champs nécessaires
$required = ['mmsi', 'horodatage', 'latitude', 'longitude', 'draft', 'status', 'vitesse', 'cap', 'heading'];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        echo json_encode(['success' => false, 'message' => "Champ manquant : $field"]);
        exit;
    }
}
try {
    $pdo = db_connect();

    $stmt = $pdo->prepare("
        INSERT INTO Position (
            Date_Heure, Latitude, longitude,statut,
            Vitesse, CAP, Heading, MMSI
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['horodatage'],
        $data['latitude'],
        $data['longitude'],
        $data['draft'],
        $data['status'],
        $data['vitesse'],
        $data['cap'],
        $data['heading'],
        $data['mmsi']
    ]);

    echo json_encode(['success' => true, 'message' => 'Point de position ajouté avec succès.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur BDD : ' . $e->getMessage()]);
}
?>
