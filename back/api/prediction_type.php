<?php
header('Content-Type: application/json');
require_once '../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['mmsi'], $input['action'])) {
    echo json_encode(['success' => false, 'message' => 'Paramètres manquants.']);
    exit;
}

$mmsi = $input['mmsi'];
$action = $input['action'];

try {
    $pdo = db_connect();

    $stmt = $pdo->prepare("
        SELECT b.Longueur, b.Largeur, p.Draft, p.Status
        FROM Bateau b
        JOIN Position p ON b.MMSI = p.MMSI
        WHERE b.MMSI = ?
        ORDER BY p.Date_Heure DESC
        LIMIT 1
    ");
    $stmt->execute([$mmsi]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Bateau ou position introuvable']);
        exit;
    }

    $status = escapeshellarg($data['status']);
    $length = escapeshellarg($data['longueur']);
    $width = escapeshellarg($data['largeur']);
    $draft = escapeshellarg($data['draft']);
    $mmsi_esc = escapeshellarg($mmsi);

    if ($action === 'type') {
        $cmd = "/var/www/html/Projet-WEB-ISEN/scripts/venv/bin/python ../../scripts/predict_type.py $status $length $width $draft $mmsi_esc";
    } elseif ($action === 'trajectory') {
        $cmd = "/var/www/html/Projet-WEB-ISEN/scripts/venv/bin/python ../../scripts/predict_trajectory.py $status $length $width $draft $mmsi_esc";
    } else {
        echo json_encode(['success' => false, 'message' => 'Action inconnue']);
        exit;
    }

    exec($cmd . " 2>&1", $output, $return_var);

    if ($return_var !== 0) {
        echo json_encode(['success' => false, 'message' => 'Erreur script Python : ' . implode("\n", $output)]);
        exit;
    }

    $prediction = implode("\n", $output);
    echo json_encode(['success' => true, 'prediction' => $prediction]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur DB : ' . $e->getMessage()]);
    exit;
}
