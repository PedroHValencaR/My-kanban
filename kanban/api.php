<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

// Local Configuration (Port 3307)
$host = '127.0.0.1'; 
$port = '3307'; 
$db   = 'kanban_db';
$user = 'root'; 
$pass = ''; 

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Database connection failed: " . $e->getMessage()]));
}

$method = $_SERVER['REQUEST_METHOD'];

// READ: Fetch all tasks
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM tasks");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
// CREATE: Add new task
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if(isset($data->title)) {
        $stmt = $pdo->prepare("INSERT INTO tasks (title, description, status) VALUES (?, ?, 'todo')");
        $stmt->execute([$data->title, $data->description]);
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    }
} 
// UPDATE: Change task status (Drag & Drop)
elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    if(isset($data->id) && isset($data->status)) {
        $stmt = $pdo->prepare("UPDATE tasks SET status = ? WHERE id = ?");
        $stmt->execute([$data->status, $data->id]);
        echo json_encode(["success" => true]);
    }
}
// DELETE: Remove task
elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    if(isset($data->id)) {
        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->execute([$data->id]);
        echo json_encode(["success" => true]);
    }
}
?>
