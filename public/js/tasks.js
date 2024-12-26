const tasksContainer = document.getElementById("tasks-container");
const notificationsContainer = document.getElementById("notifications");
let currentTaskId = null; // Variável para armazenar o ID da tarefa sendo editada

// Função para carregar tarefas do servidor
async function loadTasks() {
    try {
        console.log("Carregando tarefas..."); // Log para depuração
        const response = await fetch("http://localhost:3000/tasks");
        if (!response.ok) throw new Error(`Erro ao carregar tarefas: ${response.status}`);

        const tasks = await response.json();
        console.log("Tarefas carregadas com sucesso:", tasks); // Log para verificar as tarefas retornadas
        renderTasks(tasks);
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error.message); // Log detalhado
        showNotification("Erro ao carregar tarefas. Tente novamente mais tarde.", "error");
    }
}


// Função para renderizar as tarefas no DOM
function renderTasks(tasksData) {
    console.log("Renderizando tarefas:", tasksData); // Log para verificar os dados recebidos
    tasksContainer.innerHTML = ""; // Limpa o contêiner antes de renderizar

    if (!tasksData || tasksData.length === 0) {
        tasksContainer.innerHTML = "<p>Sem tarefas para exibir.</p>";
        return;
    }

    tasksData.forEach(task => {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";
        taskCard.innerHTML = `
            <h3>${task.name}</h3>
            <p>${task.details}</p>
            <p>Pontos: ${task.points}</p>
            <label>
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskComplete(${task.id}, this.checked)">
                Completa
            </label>
            <button onclick="deleteTask(${task.id})">Remover</button>
            <button onclick="openEditTaskModal(${task.id}, '${task.name}', '${task.details}', ${task.points})">Editar</button>
        `;
        tasksContainer.appendChild(taskCard);
    });
}


// Função para adicionar uma nova tarefa
document.getElementById("add-task-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("task-name").value;
    const details = document.getElementById("task-details").value;
    const points = parseInt(document.getElementById("task-points").value, 10);

    try {
        const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, details, points, completed: false }),
        });

        if (!response.ok) throw new Error("Erro ao adicionar tarefa");

        alert("Tarefa adicionada com sucesso!");
        loadTasks();
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error.message); // Log
        alert("Erro ao adicionar tarefa.");
    }
});

// Função para marcar tarefa como completa/incompleta
async function toggleTaskComplete(taskId, isComplete) {
    try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completed: isComplete }),
        });

        if (!response.ok) throw new Error("Erro ao atualizar tarefa");

        // Exibir notificação ao marcar como completa
        if (isComplete) {
            showNotification("Tarefa marcada como completa!", "success");
        } else {
            showNotification("Tarefa marcada como incompleta.", "info");
        }

        loadTasks();
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error.message); // Log
        showNotification("Erro ao atualizar tarefa.", "error");
    }
}

// Função para deletar uma tarefa
async function deleteTask(taskId) {
    if (!confirm("Tem certeza que deseja remover esta tarefa?")) return;

    try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Erro ao remover tarefa");

        alert("Tarefa removida com sucesso!");
        loadTasks();
    } catch (error) {
        console.error("Erro ao remover tarefa:", error.message); // Log
        alert("Erro ao remover tarefa.");
    }
}

// Função para abrir o modal de edição de tarefa com dados da tarefa
function openEditTaskModal(taskId, name, details, points) {
    currentTaskId = taskId; // Define o ID da tarefa sendo editada
    document.getElementById("edit-task-name").value = name || "";
    document.getElementById("edit-task-details").value = details || "";
    document.getElementById("edit-task-points").value = points || "";
    document.getElementById("edit-task-modal").style.display = "flex"; // Exibe o modal
}

// Fecha o modal de edição de tarefa
document.querySelector(".modal .close").addEventListener("click", () => {
    document.getElementById("edit-task-modal").style.display = "none"; // Oculta o modal
});

// Fecha o modal ao clicar fora dele
window.addEventListener("click", (event) => {
    const modal = document.getElementById("edit-task-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Função para editar uma tarefa existente
document.getElementById("edit-task-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("edit-task-name").value;
    const details = document.getElementById("edit-task-details").value;
    const points = parseInt(document.getElementById("edit-task-points").value, 10);

    try {
        const response = await fetch(`http://localhost:3000/tasks/${currentTaskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, details, points }),
        });

        if (!response.ok) throw new Error("Erro ao atualizar tarefa");

        alert("Tarefa atualizada com sucesso!");
        document.getElementById("edit-task-modal").style.display = "none";
        loadTasks();
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error.message); // Log
        alert("Erro ao atualizar tarefa.");
    }
});

function showNotification(message, type) {
    console.log(`[Notificação - ${type}]: ${message}`); // Log adicional
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === "success" ? "✔️" : type === "error" ? "❌" : "ℹ️"}</span>
        ${message}
    `;
    notificationsContainer.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}


// Carregar tarefas ao inicializar a página
document.addEventListener("DOMContentLoaded", () => loadTasks());
