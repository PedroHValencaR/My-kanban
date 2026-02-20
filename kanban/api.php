<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

// Configurações específicas da sua máquina (Porta 3307)
$host = '127.0.0.1'; 
$port = '3307'; 
$db   = 'kanban_db';
$user = 'root'; 
$pass = ''; 

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Retorna o erro em JSON para o Console do navegador te avisar
    die(json_encode(["error" => "Erro de conexão: " . $e->getMessage()]));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM tasks");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if(isset($data->title)) {
        $stmt = $pdo->prepare("INSERT INTO tasks (title, description, status) VALUES (?, ?, 'todo')");
        $stmt->execute([$data->title, $data->description]);
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    }
}