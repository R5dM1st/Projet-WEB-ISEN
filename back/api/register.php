<?php
session_start();

// Vérifie que la méthode est POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

header('Content-Type: application/json');
require_once '../config/db.php';

// Récupère et décode les données JSON
$data = json_decode(file_get_contents('php://input'), true);

// Nettoyage des champs
$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$mot_de_passe = trim($data['mot_de_passe'] ?? '');

// Vérifie que tous les champs sont présents et non vides
if (!$username || !$email || !$mot_de_passe) {
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires.']);
    exit;
}

try {
    $pdo = db_connect();

    // Vérifie si l'email existe déjà
    $stmt = $pdo->prepare('SELECT id FROM Utilisateur WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Cet e-mail est déjà utilisé.']);
        exit;
    }

    // Hash du mot de passe
    $hash = password_hash($mot_de_passe, PASSWORD_DEFAULT);

    // Insertion dans la table Utilisateur
    $stmt = $pdo->prepare('INSERT INTO Utilisateur (username, email, mot_de_passe) VALUES (?, ?, ?)');
    $success = $stmt->execute([$username, $email, $hash]);

    if ($success) {
        // Récupère l'ID de l'utilisateur créé et démarre la session
        $user_id = $pdo->lastInsertId();
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;

        echo json_encode([
            'success' => true,
            'message' => 'Inscription réussie !',
            'username' => $username
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => "Erreur lors de l'inscription."]);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur serveur : ' . $e->getMessage()]);
}
