// tasks.js - Painel de Tarefas e Missões
const tasksContainer = document.getElementById("tasks-container");

// Dados fictícios de tarefas
const tasksData = [
    { id: 1, description: "Completar desafio de lógica", points: 50, status: "incomplete", responsible: "Equipe Alpha" },
    { id: 2, description: "Apresentar projeto", points: 100, status: "incomplete", responsible: "Equipe Beta" }
];

// Função para carregar tarefas
function loadTasks() {
    tasksContainer.innerHTML = "";
    tasksData.forEach(task => {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";
        taskCard.innerHTML = `
            <h4>${task.description}</h4>
            <p>Pontuação: ${task.points}</p>
            <p>Responsável: ${task.responsible}</p>
            <p>Status: ${task.status === "complete" ? "✅ Completa" : "⏳ Incompleta"}</p>
            <button onclick="markTaskComplete(${task.id})">Marcar como Completa</button>
        `;
        tasksContainer.appendChild(taskCard);
    });
}

// Função para marcar tarefa como completa
function markTaskComplete(taskId) {
    const task = tasksData.find(t => t.id === taskId);
    if (task) {
        task.status = "complete";
        notify(`Tarefa "${task.description}" concluída!`, "success");
        loadTasks();
    }
}

// Carregar tarefas ao iniciar o script
document.addEventListener("DOMContentLoaded", loadTasks);

document.getElementById("add-task-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("task-name").value;
    const points = document.getElementById("task-points").value;

    const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, points }),
    });

    if (response.ok) {
        alert("Tarefa criada!");
        loadTasks();
    } else {
        alert("Erro ao criar tarefa.");
    }
});

