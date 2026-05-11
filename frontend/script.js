const API_URL = "http://localhost:8000/backend/tasks.php";

let tarefas = [];

function enviarParaAPI(dados) {
    return fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
        .then(res => res.json())
        .catch(err => {
            console.error("Erro na API:", err);
        })
}

function adicionarTarefa() {
    const input = document.getElementById("nova-tarefa");
    const texto = input.value.trim();

    if (texto === "") return;

    enviarParaAPI({ texto: texto })
        .then(data => {
            console.log("Resposta do PHP:", data);

            input.value = "";

            carregarTarefas();
        });
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement("li");

    const texto = document.createElement("span");
    texto.textContent = tarefa.texto;

    const input = document.createElement("input");
    input.value = tarefa.texto;
    input.style.display = "none";

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "X";

    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "✏️";

    //estilo de concluída
    if (tarefa.concluida) {
        texto.style.textDecoration = "line-through";
    }

    //marcar como concluída (UPDATE)
    texto.onclick = () => {
        const novaSituacao = !tarefa.concluida;

        enviarParaAPI({
            acao: "atualizar",
            id: tarefa.id,
            texto: tarefa.texto,
            concluida: novaSituacao
        }).then(() => {
            carregarTarefas();
        });
    };

    //deletar (DELETE)
    botaoExcluir.onclick = () => {
        const confirmar = confirm("Deseja excluir essa tarefa?");
        if (!confirmar) return;

        enviarParaAPI({
            acao: "deletar",
            id: tarefa.id
        }).then(() => {
            carregarTarefas();
        });
    };


    botaoEditar.onclick = () => {
        texto.style.display = "none";
        input.style.display = "inline";

        input.focus();

        input.onblur = () => {
            const novoTexto = input.value.trim();

            if (novoTexto === "") {
                input.style.display = "none";
                texto.style.display = "inline";
                return;
            }

            enviarParaAPI({
                acao: "atualizar",
                id: tarefa.id,
                texto: novoTexto,
                concluida: tarefa.concluida
            }).then(() => {
                carregarTarefas();
            })
        };
    };

    li.appendChild(texto);
    li.appendChild(input);
    li.appendChild(botaoExcluir);
    li.appendChild(botaoEditar);

    return li;
}


function renderizar() {
    const lista = document.getElementById("lista-tarefas");
    lista.innerHTML = "";

    tarefas.forEach((tarefa) => {
        const li = criarElementoTarefa(tarefa);
        lista.appendChild(li);
    });
}

function carregarTarefas() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            tarefas = data;
            renderizar();
        })
        .catch(err => {
            console.error("Erro ao carregar tarefas:", err);
        });
}

carregarTarefas();