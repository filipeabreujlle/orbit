<?php

$pdo = new PDO('sqlite:' . __DIR__ . '/banco.sqlite');

$pdo->exec("
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT,
        concluida INTEGER
    )
");

echo "Tabela criada com sucesso!";

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

$arquivo = __DIR__ . "/tarefas.json";

$json = file_get_contents($arquivo);

$tarefas = json_decode($json, true);

if ($method === 'GET') {
    echo json_encode($tarefas);
}

if ($method === 'POST') {
    $dados = json_decode(file_get_contents("php://input"), true);

    if (($dados["acao"] ?? "") === "atualizar") {
        $id = $dados["id"];
        $novaSituacao = $dados["concluida"];

        foreach ($tarefas as &$tarefa) {
            if ($tarefa["id"] === $id) {
                $tarefa["concluida"] = $novaSituacao;
                break;
            }
        }

        file_put_contents($arquivo, json_encode($tarefas));

        echo json_encode(["status" => "atualizado"]);
        exit;
    }

    if (($dados["acao"] ?? "") === "deletar") {
        $id = $dados["id"];

        $tarefas = array_filter($tarefas, function ($tarefa) use ($id) {
            return $tarefa["id"] !== $id;
        });

        $tarefas = array_values($tarefas);

        file_put_contents($arquivo, json_encode($tarefas));

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
