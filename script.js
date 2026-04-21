let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function adicionarTarefa() {
    const input = document.getElementById("nova-tarefa");
    const texto = input.value;

    if (texto === "") return;

    tarefas.push({
        texto: texto,
        concluida: false
    });

    input.value = "";

    renderizar();
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
            tarefas.splice(index, 1);
            renderizar();
        };

        li.appendChild(texto);
        li.appendChild(botaoExcluir);

        if (tarefa.concluida) {
            texto.style.textDecoration = "line-through";
        }

        texto.onclick = () => {
            tarefas[index].concluida = !tarefas[index].concluida;
            renderizar();
        };

        lista.appendChild(li);
    });

    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

renderizar();
