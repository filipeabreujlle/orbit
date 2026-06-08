// ====================
// CONFIGURAÇÕES
// ====================

const API_URL = "http://localhost:8000/backend/tasks.php";

let tarefas = [];
let filtroAtual = "todas";


// ====================
// MENSAGENS
// ====================

const mensagens = [
    "Pequenos avanços contam.",
    "Um passo de cada vez.",
    "Feito é melhor que perfeito.",
    "Comece por qualquer lugar.",
    "O importante é continuar.",
    "Você não precisa fazer tudo hoje.",
    "Uma tarefa de cada vez."
];

function mostrarMensagemDoDia() {
    const elementoMensagem = document.getElementById("mensagem-dia");

    const indiceAleatorio = Math.floor(Math.random() * mensagens.length);

    elementoMensagem.textContent = mensagens[indiceAleatorio];
}


// ====================
// FILTROS
// ====================

function mudarFiltro(novoFiltro) {
    filtroAtual = novoFiltro;

    atualizarBotoesFiltro();

    renderizar();
}

function atualizarBotoesFiltro() {
    const botaoTodas = document.getElementById("filtro-todas");
    const botaoPendentes = document.getElementById("filtro-pendentes");
    const botaoConcluidas = document.getElementById("filtro-concluidas");

    botaoTodas.classList.remove("filtro-ativo");
    botaoPendentes.classList.remove("filtro-ativo");
    botaoConcluidas.classList.remove("filtro-ativo");

    if (filtroAtual === "todas") {
        botaoTodas.classList.add("filtro-ativo");
    }

    if (filtroAtual === "pendentes") {
        botaoPendentes.classList.add("filtro-ativo");
    }

    if (filtroAtual === "concluidas") {
        botaoConcluidas.classList.add("filtro-ativo");
    }
}


// ====================
// API
// ====================

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


// ====================
// TAREFAS
// ====================

function adicionarTarefa() {
    const input = document.getElementById("nova-tarefa");
    const texto = input.value.trim();

    if (texto === "") return;

    enviarParaAPI({ texto: texto })
        .then(() => {
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
    botaoExcluir.textContent = "✕";

    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "✎";

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
        };
    };

    li.appendChild(texto);
    li.appendChild(input);
    li.appendChild(botaoExcluir);
    li.appendChild(botaoEditar);

    return li;
}


// ====================
// RENDERIZAÇÃO
// ====================

function renderizar() {
    const lista = document.getElementById("lista-tarefas");
    lista.innerHTML = "";

    const contador = document.getElementById("contador-tarefas");

    const filtros = document.getElementById("filtros");

    const tarefasPendentes = tarefas.filter((tarefa) => {
        return !tarefa.concluida;
    });

    if (tarefasPendentes.length === 0) {
        contador.textContent = "Tudo concluído ✨";
    } else if (tarefasPendentes.length === 1) {
        contador.textContent = "Você já sabe por onde começar.";
    } else {
        contador.textContent = `${tarefasPendentes.length} passos aguardam sua atenção.`;
    }

    if (tarefas.length === 0) {
        contador.textContent = "";

        filtros.style.display = "none";

        lista.innerHTML = "";
        return;
    }

    filtros.style.display = "flex";

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


// ====================
// EVENTOS
// ====================

const inputNovaTarefa = document.getElementById("nova-tarefa");

inputNovaTarefa.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        adicionarTarefa();
    }
});


// ====================
// INICIALIZAÇÃO
// ====================

mostrarMensagemDoDia();

atualizarBotoesFiltro();

carregarTarefas();