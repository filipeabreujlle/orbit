<?php

$pdo = new PDO('sqlite:' . __DIR__ . '/banco.sqlite');

$pdo->exec("
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT,
        concluida INTEGER
    )
");

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

$arquivo = __DIR__ . "/tarefas.json";

$json = file_get_contents($arquivo);

$tarefas = json_decode($json, true);

if ($method === 'GET') {

    $stmt = $pdo->query("SELECT * FROM tarefas");

    $tarefas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($tarefas);
}

if ($method === 'POST') {
    $dados = json_decode(file_get_contents("php://input"), true);

    if (($dados["acao"] ?? "") === "atualizar") {
        $id = $dados["id"];
        $novaSituacao = $dados["concluida"];

        $stmt = $pdo->prepare("UPDATE tarefas SET concluida = ? WHERE id = ?");
        $stmt->execute([$novaSituacao, $id]);

        echo json_encode(["status" => "atualizado"]);
        exit;
    }

    if (($dados["acao"] ?? "") === "deletar") {
        $id = $dados["id"];

        $stmt = $pdo->prepare('DELETE FROM tarefas WHERE id = ?');
        $stmt->execute([$id]);

        echo json_encode(["status" => "deletado"]);
        exit;
    }

    if (empty(trim($dados["texto"]))) {
        echo json_encode(["erro" => "Texto inválido"]);
        exit;
    }

    $stmt = $pdo->prepare(
        "INSERT INTO tarefas (texto, concluida) VALUES (?, ?)"
    );

    $stmt->execute([
        $dados["texto"],
        $dados["concluida"] ?? 0
    ]);

    echo json_encode([
        "status" => "criado"
    ]);
}
