<?php
session_start();
header('Content-Type: application/json');
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email'], $data['mot_de_passe'], $data['username'])) {
    echo json_encode(['success' => false, 'message' => 'Champs manquants.']);
    exit;
}

try {
    $pdo = db_connect();

    // Vérifie si l'email existe déjà
    $stmt = $pdo->prepare('SELECT id FROM Utilisateur WHERE email = ?');
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Cet e-mail est déjà utilisé.']);
        exit;
    }

    // Hash du mot de passe
    $hash = password_hash($data['mot_de_passe'], PASSWORD_DEFAULT);

    // Insertion dans la table Utilisateur
    $stmt = $pdo->prepare('INSERT INTO Utilisateur (username, email, mot_de_passe) VALUES (?, ?, ?)');
    $success = $stmt->execute([
        $data['username'],
        $data['email'],
        $hash
    ]);

    if ($success) {
        // Récupère l'utilisateur nouvellement créé
        $user_id = $pdo->lastInsertId();
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $data['username'];
        $_SESSION['email'] = $data['email'];
        echo json_encode(['success' => true, 'message' => 'Inscription réussie !', 'username' => $data['username']]);
    } else {
        echo json_encode(['success' => false, 'message' => "Erreur lors de l'inscription."]);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur : ' . $e->getMessage()]);
}
?>