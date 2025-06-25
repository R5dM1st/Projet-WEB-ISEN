<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once '../config/db.php';

try {
    $pdo = db_connect();

    // Paramètres DataTables
    $draw = isset($_GET['draw']) ? intval($_GET['draw']) : 0;
    $start = isset($_GET['start']) ? intval($_GET['start']) : 0;
    $length = isset($_GET['length']) ? intval($_GET['length']) : 30;

    // Colonnes disponibles
    $columns = [
        'p.MMSI',
        'b.Nom',
        'p.Date_Heure',
        'p.Latitude',
        'p.Longitude',
        'p.Vitesse',
        'p.Heading',
        'p.CAP',
        'p.Status',
        'b.Longueur',
        'b.Largeur',
        'p.Draft'
    ];

    // Construction des filtres
    $where = [];
    $params = [];

    // Filtre dateStart / dateEnd
    if (!empty($_GET['dateStart']) && !empty($_GET['dateEnd'])) {
        $where[] = "p.Date_Heure BETWEEN :dateStart AND :dateEnd";
        $params[':dateStart'] = $_GET['dateStart'] . " 00:00:00";
        $params[':dateEnd'] = $_GET['dateEnd'] . " 23:59:59";
    }

    // Filtre nom bateau
    if (!empty($_GET['nom'])) {
        $where[] = "b.Nom ILIKE :nom";
        $params[':nom'] = "%" . $_GET['nom'] . "%";
    }

    // Recherche globale DataTables
    $searchValue = $_GET['search']['value'] ?? '';
    if ($searchValue !== '') {
        $searchClauses = [];
        foreach ($columns as $col) {
            $searchClauses[] = "$col::text ILIKE :search";
        }
        $where[] = '(' . implode(' OR ', $searchClauses) . ')';
        $params[':search'] = '%' . $searchValue . '%';
    }

    $whereSQL = $where ? "WHERE " . implode(" AND ", $where) : "";

    // Tri
    $orderSQL = "ORDER BY p.Date_Heure DESC"; // par défaut
    if (isset($_GET['order'][0]['column'], $_GET['order'][0]['dir'])) {
        $colIndex = intval($_GET['order'][0]['column']);
        $dir = strtolower($_GET['order'][0]['dir']) === 'asc' ? 'ASC' : 'DESC';
        if (isset($columns[$colIndex])) {
            $orderSQL = "ORDER BY {$columns[$colIndex]} $dir";
        }
    }

    // Comptage total (sans filtre)
    $stmtTotal = $pdo->query("SELECT COUNT(*) FROM Position p JOIN Bateau b ON p.MMSI = b.MMSI");
    $recordsTotal = $stmtTotal->fetchColumn();

    // Comptage total (avec filtre)
    $stmtFiltered = $pdo->prepare("SELECT COUNT(*) FROM Position p JOIN Bateau b ON p.MMSI = b.MMSI $whereSQL");
    $stmtFiltered->execute($params);
    $recordsFiltered = $stmtFiltered->fetchColumn();

    // Requête principale avec limite et offset
    $sql = "
        SELECT 
            p.MMSI,
            b.Nom AS nom,
            p.Date_Heure AS date_heure,
            p.Latitude,
            p.Longitude,
            p.Vitesse AS sog,
            p.Heading AS cog,
            p.CAP AS cap,
            p.Status AS status,
            b.Longueur AS longueur,
            b.Largeur AS largeur,
            p.Draft AS draft
        FROM Position p
        JOIN Bateau b ON p.MMSI = b.MMSI
        $whereSQL
        $orderSQL
        LIMIT :length OFFSET :start
    ";

    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':length', $length, PDO::PARAM_INT);
    $stmt->bindValue(':start', $start, PDO::PARAM_INT);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Réponse JSON
    echo json_encode([
        'draw' => $draw,
        'recordsTotal' => intval($recordsTotal),
        'recordsFiltered' => intval($recordsFiltered),
        'data' => $data,
        'success' => true
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur SQL : ' . $e->getMessage()
    ]);
}
