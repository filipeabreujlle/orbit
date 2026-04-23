<?php

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

$tarefas = [
    ["texto" => "Estudar programação", "Concluida" => false],
    ["texto" => "Treinar", "Concluida" => true]
];

if ($method === 'GET') {
    echo json_encode($tarefas);
}

if ($method === 'POST') {
    $dados = json_decode(file_get_contents("php://input"), true);

    if (empty(trim($dados["texto"]))) {
        echo json_encode(["erro" => "Texto inválido"]);
        exit;
    }

    $novaTarefa = [
        "texto" => $dados['texto'],
        "concluida" => false
    ];

    echo json_encode($novaTarefa);
}
