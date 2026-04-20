let tarefas = [];

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

        li.textContent = tarefa.texto;

        if (tarefa.concluida) {
            li.style.textDecoration = "line-through";
        }

        li.onclick = () => {
            tarefas[index].concluida = !tarefas[index].concluida;
            renderizar();
        };

        lista.appendChild(li);
    });
}
