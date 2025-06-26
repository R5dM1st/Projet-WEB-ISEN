<?php
require_once '../config/db.php';
header('Content-Type: application/json');

try {
    if (empty($_POST['action']) || empty($_POST['mmsi']) || empty($_POST['date_heure'])) {
        throw new Exception("Paramètres requis manquants.");
    }

    $pdo = db_connect();
    $action = $_POST['action'];
    $mmsi = $_POST['mmsi'];
    $date_heure = $_POST['date_heure'];

    if ($action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM Position WHERE MMSI = :mmsi AND Date_Heure = :date_heure");
        $stmt->execute([
            ':mmsi' => $mmsi,
            ':date_heure' => $date_heure
        ]);
        echo json_encode(['success' => true, 'message' => 'Suppression réussie.']);
    }

    elseif ($action === 'update') {
        $requiredFields = ['latitude', 'longitude', 'vitesse', 'heading', 'cap', 'status', 'draft'];
        foreach ($requiredFields as $field) {
            if (!isset($_POST[$field])) {
                throw new Exception("Champ requis manquant : $field");
            }
        }

        $sql = "UPDATE Position SET
                    Latitude = :latitude,
                    Longitude = :longitude,
                    Vitesse = :vitesse,
                    Heading = :heading,
                    CAP = :cap,
                    Status = :status,
                    Draft = :draft
                WHERE MMSI = :mmsi AND Date_Heure = :date_heure";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':latitude' => $_POST['latitude'],
            ':longitude' => $_POST['longitude'],
            ':vitesse' => $_POST['vitesse'],
            ':heading' => $_POST['heading'],
            ':cap' => $_POST['cap'],
            ':status' => $_POST['status'],
            ':draft' => $_POST['draft'],
            ':mmsi' => $mmsi,
            ':date_heure' => $date_heure
        ]);

        echo json_encode(['success' => true, 'message' => 'Mise à jour réussie.']);
    }

    else {
        throw new Exception("Action inconnue : $action");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur : ' . $e->getMessage()
    ]);
}
