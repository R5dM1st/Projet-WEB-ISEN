<?php
session_start();
header('Content-Type: application/json');

// Vérification de session utilisateur (enlève si tu n'as pas de gestion de session)
//if (!isset($_SESSION['user_id'])) {
    //echo json_encode(['success' => false, 'message' => 'Vous devez être connecté.']);
    //exit;
//}

$input = json_decode(file_get_contents('php://input'), true);

$required = ['mmsi', 'date_heure', 'latitude', 'longitude', 'draft', 'status', 'vitesse', 'cap', 'heading'];
foreach ($required as $key) {
    if (!isset($input[$key]) || $input[$key] === '') {
        echo json_encode(['success' => false, 'message' => "Champ manquant : $key"]);
        exit;
    }
}

require_once '../config/db.php';
$pdo = db_connect();

try {
    $stmt = $pdo->prepare("
        INSERT INTO Position (MMSI, Date_Heure, Latitude, Longitude, Draft, Status, Vitesse, CAP, Heading)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $input['mmsi'],
        $input['date_heure'],
        $input['latitude'],
        $input['longitude'],
        $input['draft'],
        $input['status'],
        $input['vitesse'],
        $input['cap'],
        $input['heading']
    ]);

    echo json_encode(['success' => true, 'message' => 'Position enregistrée avec succès.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur SQL : ' . $e->getMessage()]);
}
