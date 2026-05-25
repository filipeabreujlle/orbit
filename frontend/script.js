const API_URL = "http://localhost:8000/backend/tasks.php";

let tarefas = [];

let filtroAtual = "todas";

function mostrarDataAtual() {
    const elementoData = document.getElementById("data-atual");

    const data = new Date();

    const opcoes = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    const dataFormatada = data.toLocaleDateString("pt-BR", opcoes);

    elementoData.textContent = `Hoje é ${dataFormatada}`;
}

function mudarFiltro(novoFiltro) {
    filtroAtual = novoFiltro;
    renderizar();
}

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


    if (tarefa.concluida) {
        texto.style.textDecoration = "line-through";
        texto.style.opacity = "0.5";

        li.style.backgroundColor = "#f0f0f0";
    }


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
        input.select();

        const salvarEdicao = () => {
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
            });
        };

        input.onblur = salvarEdicao;

        input.onkeydown = (event) => {
            if (event.key === "Enter") {
                salvarEdicao();
            }
            if (event.key === "Escape") {
                input.value = tarefa.texto;

                input.style.display = "none";
                texto.style.display = "inline";
            }
        }
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

    const contador = document.getElementById("contador-tarefas");

    const tarefasPendentes = tarefas.filter((tarefa) => {
        return !tarefa.concluida;
    });

    if (tarefasPendentes.length === 0) {
        contador.textContent = "Sem tarefas pendentes!";
    } else {
        contador.textContent = `${tarefasPendentes.length} tarefas pendentes`;
    }

    if (tarefas.length === 0) {
        lista.innerHTML = "<p>Tudo certo por hoje ✨</p>";
        return;
    }

    let tarefasFiltradas = tarefas;

    if (filtroAtual === "pendentes") {
        tarefasFiltradas = tarefas.filter((tarefa) => {
            return !tarefa.concluida;
        });
    }

    if (filtroAtual === "concluidas") {
        tarefasFiltradas = tarefas.filter((tarefa) => {
            return tarefa.concluida;
        });
    }

    tarefasFiltradas.forEach((tarefa) => {
        const li = criarElementoTarefa(tarefa);
        lista.appendChild(li);
    });
}

mostrarDataAtual();

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