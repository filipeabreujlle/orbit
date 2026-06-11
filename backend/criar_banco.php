<?php

$pdo = new PDO('sqlite:' . __DIR__ . '/banco.sqlite');

$pdo->exec("
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT,
        concluida INTEGER,
        posicao INTEGER DEFAULT 0
    )
");

echo "Banco criado com sucesso!";