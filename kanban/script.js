const apiUrl = 'api.php';

document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        
        document.getElementById('todo').innerHTML = '<h3>📌 To Do</h3>';
        document.getElementById('doing').innerHTML = '<h3>⚡ In Progress</h3>';
        document.getElementById('done').innerHTML = '<h3>✅ Done</h3>';

        if (Array.isArray(tasks)) {
            tasks.forEach(task => renderTask(task));
        }
    } catch (e) { console.error("Error loading tasks:", e); }
}

function renderTask(task) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.id = `task-${task.id}`;
    card.ondragstart = drag;

    card.innerHTML = `
        <div class="card-header">
            <h4>${task.title}</h4>
            <button class="delete-btn" title="Delete Task" onclick="deleteTask(${task.id})">×</button>
        </div>
        <p id="desc-${task.id}">${task.description || 'Learn more via Wikipedia below.'}</p>
        <button class="wiki-btn" onclick="fetchWikipediaData(${task.id}, '${task.title}')">
            📚 WIKIPEDIA SUMMARY
        </button>
    `;

    document.getElementById(task.status).appendChild(card);
}

async function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDesc');
    
    if (!titleInput.value) return alert("Please provide a title.");

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleInput.value, description: descInput.value })
    });

    titleInput.value = '';
    descInput.value = '';
    loadTasks();
}

async function deleteTask(taskId) {
    if (!confirm("Permanently delete this task?")) return;

    await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId })
    });
    loadTasks();
}

async function fetchWikipediaData(taskId, title) {
    const descElement = document.getElementById(`desc-${taskId}`);
    descElement.innerText = "Connecting to Wikipedia...";
    
    try {
        const response = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
        if (response.ok) {
            const data = await response.json();
            descElement.innerText = data.extract;
        } else {
            descElement.innerText = "No specific Wikipedia article found.";
        }
    } catch (e) { descElement.innerText = "API Error."; }
}

// Drag & Drop
function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }

async function drop(ev) {
    ev.preventDefault();
    const cardId = ev.dataTransfer.getData("text");
    const cardElement = document.getElementById(cardId);
    let target = ev.target;
    while (target && !target.classList.contains('column')) target = target.parentElement;

    if (target) {
        target.appendChild(cardElement);
        const idNumeric = cardId.replace('task-', '');
        await fetch(apiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: idNumeric, status: target.id })
        });
    }
}
