<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once '../config/db.php';

try {
    $pdo = db_connect();

    $draw = isset($_GET['draw']) ? intval($_GET['draw']) : 0;
    $start = isset($_GET['start']) ? intval($_GET['start']) : 0;
    $length = isset($_GET['length']) ? intval($_GET['length']) : 30;

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

    $where = [];
    $params = [];

    if (!empty($_GET['dateStart']) && !empty($_GET['dateEnd'])) {
        $where[] = "p.Date_Heure BETWEEN :dateStart AND :dateEnd";
        $params[':dateStart'] = $_GET['dateStart'] . " 00:00:00";
        $params[':dateEnd'] = $_GET['dateEnd'] . " 23:59:59";
    }

    if (!empty($_GET['nom'])) {
        $where[] = "b.Nom ILIKE :nom";
        $params[':nom'] = "%" . $_GET['nom'] . "%";
    }

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

    $orderSQL = "ORDER BY p.Date_Heure DESC";
    if (isset($_GET['order'][0]['column'], $_GET['order'][0]['dir'])) {
        $colIndex = intval($_GET['order'][0]['column']);
        $dir = strtolower($_GET['order'][0]['dir']) === 'asc' ? 'ASC' : 'DESC';
        if (isset($columns[$colIndex])) {
            $orderSQL = "ORDER BY {$columns[$colIndex]} $dir";
        }
    }

    $stmtTotal = $pdo->query("SELECT COUNT(*) FROM Position p JOIN Bateau b ON p.MMSI = b.MMSI");
    $recordsTotal = $stmtTotal->fetchColumn();

    $stmtFiltered = $pdo->prepare("SELECT COUNT(*) FROM Position p JOIN Bateau b ON p.MMSI = b.MMSI $whereSQL");
    $stmtFiltered->execute($params);
    $recordsFiltered = $stmtFiltered->fetchColumn();

    $sql = "
        SELECT 
            p.MMSI AS \"MMSI\",
            b.Nom AS \"nom\",
            p.Date_Heure AS \"date_heure\",
            p.Latitude AS \"Latitude\",
            p.Longitude AS \"Longitude\",
            p.Vitesse AS \"sog\",
            p.Heading AS \"cog\",
            p.CAP AS \"cap\",
            p.Status AS \"status\",
            b.Longueur AS \"longueur\",
            b.Largeur AS \"largeur\",
            p.Draft AS \"draft\"
        FROM Position p
        JOIN Bateau b ON p.MMSI = b.MMSI
        $whereSQL
        $orderSQL
        " . ($length > 0 ? "LIMIT :length OFFSET :start" : "") . "
    ";

    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    if ($length > 0) {
        $stmt->bindValue(':length', $length, PDO::PARAM_INT);
        $stmt->bindValue(':start', $start, PDO::PARAM_INT);
    }

    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
