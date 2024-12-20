// admin.js - Gerenciamento administrativo
const adminContainer = document.getElementById("admin-container");

// Dados iniciais para missões
const tasksData = [
    { id: 1, description: "Completar relatório", points: 20, status: "incomplete" },
    { id: 2, description: "Organizar estoque", points: 30, status: "complete" }
];

// Função para carregar tarefas no painel
function loadTasks() {
    adminContainer.innerHTML = "";
    tasksData.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";
        taskItem.innerHTML = `
            <p><strong>Tarefa:</strong> ${task.description}</p>
            <p><strong>Pontos:</strong> ${task.points}</p>
            <p><strong>Status:</strong> ${task.status}</p>
        `;
        adminContainer.appendChild(taskItem);
    });
}

// Função para adicionar uma nova tarefa
function addTask(description, points) {
    const newTask = {
        id: tasksData.length + 1,
        description: description,
        points: points,
        status: "incomplete"
    };
    tasksData.push(newTask);
    loadTasks();
}

// Exemplo: Adicionar nova tarefa
addTask("Treinamento de vendas", 40);

// Carregar tarefas ao iniciar o script
document.addEventListener("DOMContentLoaded", loadTasks);

async function loadHistory() {
    const response = await fetch("http://localhost:3000/history");
    const history = await response.json();
    document.getElementById("history-container").innerHTML = history
        .map(entry => `<p>${entry}</p>`)
        .join("");
}

