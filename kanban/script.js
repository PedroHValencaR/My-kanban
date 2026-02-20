const apiUrl = 'api.php';

// Carregar tarefas assim que a página abrir
document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        
        // Verifica se o PHP enviou uma mensagem de erro em vez da lista
        if (tasks.error) {
            console.error("Erro vindo do PHP:", tasks.error);
            return;
        }

        // Limpa as colunas antes de renderizar (mantendo apenas o título)
        document.getElementById('todo').innerHTML = '<h3>A Fazer</h3>';
        document.getElementById('doing').innerHTML = '<h3>Em Andamento</h3>';
        document.getElementById('done').innerHTML = '<h3>Concluído</h3>';

        // Só tenta rodar o forEach se 'tasks' for uma lista (Array)
        if (Array.isArray(tasks)) {
            tasks.forEach(task => renderTask(task));
        }
    } catch (e) {
        console.error("Erro crítico ao carregar tarefas:", e);
    }
}

function renderTask(task) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.id = `task-${task.id}`;
    card.ondragstart = drag;

    // Estrutura do cartão com o botão da Wikipedia
    card.innerHTML = `
        <h4>${task.title}</h4>
        <p id="desc-${task.id}">${task.description || 'Sem descrição'}</p>
        <button class="wiki-btn" onclick="fetchWikipediaData(${task.id}, '${task.title}')">
            📚 Resumo Wikipedia
        </button>
    `;

    document.getElementById(task.status).appendChild(card);
}

// Função para adicionar nova tarefa via POST
async function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDesc');

    if (!titleInput.value) {
        alert("Por favor, digite um título!");
        return;
    }

    const newTask = {
        title: titleInput.value,
        description: descInput.value
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            titleInput.value = '';
            descInput.value = '';
            loadTasks(); // Atualiza o quadro
        }
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
    }
}

// INTEGRAÇÃO COM WIKIPEDIA
async function fetchWikipediaData(taskId, title) {
    const descElement = document.getElementById(`desc-${taskId}`);
    descElement.innerText = "Buscando...";

    try {
        // Consome a API REST oficial da Wikipedia
        const response = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
        
        if (response.ok) {
            const data = await response.json();
            descElement.innerText = data.extract || "Artigo encontrado, mas sem resumo disponível.";
        } else {
            descElement.innerText = "Não encontramos nada sobre isso na Wikipedia.";
        }
    } catch (error) {
        descElement.innerText = "Erro ao conectar com a Wikipedia.";
        console.error(error);
    }
}

// LÓGICA DE ARRASTAR E SOLTAR (DRAG AND DROP)
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

async function drop(ev) {
    ev.preventDefault();
    const cardId = ev.dataTransfer.getData("text");
    const cardElement = document.getElementById(cardId);
    
    // Identifica a coluna de destino (garante que caia na div .column)
    let target = ev.target;
    while (target && !target.classList.contains('column')) {
        target = target.parentElement;
    }

    if (target) {
        target.appendChild(cardElement);
        
        // Atualiza o status no Banco de Dados via PUT
        const idNumeric = cardId.replace('task-', '');
        const newStatus = target.id;

        await fetch(apiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: idNumeric, status: newStatus })
        });
    }
}