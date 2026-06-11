<?php

$pdo = new PDO('sqlite:' . __DIR__ . '/banco.sqlite');

$pdo->exec("
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT,
        concluida INTEGER
    )
");

try {

    $pdo->exec("
        ALTER TABLE tarefas ADD COLUMN posicao INTEGER DEFAULT 0
    ");

} catch (PDOException $e) {

}

echo "Banco criado com sucesso!";