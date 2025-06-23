<?php
session_start();
header('Content-Type: application/json');
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email'], $data['mot_de_passe'])) {
    echo json_encode(['success' => false, 'message' => 'Champs manquants.']);
    exit;
}

try {
    $pdo = db_connect();
    $stmt = $pdo->prepare('SELECT id, username, mot_de_passe FROM Utilisateur WHERE email = ?');
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data['mot_de_passe'], $user['mot_de_passe'])) {
        // On stocke l'utilisateur en session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $data['email'];
        echo json_encode(['success' => true, 'message' => 'Connexion réussie !', 'username' => $user['username']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Identifiants incorrects.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur : ' . $e->getMessage()]);
}
?>