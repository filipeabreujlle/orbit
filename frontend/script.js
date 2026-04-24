let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function adicionarTarefa() {
    const input = document.getElementById("nova-tarefa");
    const texto = input.value

    if (texto.trim() === "") return;

    fetch("http://localhost:8000/backend/tasks.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ texto: texto })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Resposta do PHP:", data);

            input.value = "";

            carregarTarefas();
        })
        .catch(err => {
            console.error("Erro:", err);
        });
}

function renderizar() {
    const lista = document.getElementById("lista-tarefas");

    lista.innerHTML = "";

    tarefas.forEach((tarefa, index) => {
        const li = document.createElement("li");

        const texto = document.createElement("span");
        texto.textContent = tarefa.texto;

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "X";

        botaoExcluir.onclick = () => {
            const confirmar = confirm("Deseja excluir essa tarefa?");

            if (!confirmar) return;

            tarefas.splice(index, 1);
            renderizar();
        };

        if (tarefa.concluida) {
            texto.style.textDecoration = "line-through";
        }

        texto.onclick = () => {
            const novaSituacao = !tarefas[index].concluida;

            fetch("http://localhost:8000/backend/tasks.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    texto: tarefas[index].texto,
                    concluida: novaSituacao
                })
            })
                .then(() => {
                    carregarTarefas();
                });
        };

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "✏️"

        botaoEditar.onclick = () => {
            const novoTexto = prompt("Editar tarefa:", tarefa.texto);

            if (novoTexto === null || novoTexto.trim() === "") return;

            tarefas[index].texto = novoTexto;
            renderizar();
        }

        li.appendChild(texto);
        li.appendChild(botaoExcluir);
        li.appendChild(botaoEditar);

        lista.appendChild(li);
    });

    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
    fetch("http://localhost:8000/backend/tasks.php")
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