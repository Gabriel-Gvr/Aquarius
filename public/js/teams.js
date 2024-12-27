import config from "./config.js";

// Seleciona o contêiner onde as equipes serão exibidas
const teamsContainer = document.getElementById("teams-container");
let currentTeamId = null; // Variável para armazenar o ID da equipe sendo editada

// Função para carregar equipes do servidor
async function loadTeams() {
    try {
        const response = await fetch(`${config.apiBaseUrl}/teams`);
        if (!response.ok) throw new Error("Erro ao carregar equipes");

        const teams = await response.json();
        renderTeams(teams);
    } catch (error) {
        console.error(error.message);
        alert("Erro ao carregar equipes. Tente novamente mais tarde.");
    }
}

// Função para mover equipe para a lista de eliminadas
async function eliminateTeam(teamId) {
    if (!confirm("Tem certeza que deseja eliminar esta equipe?")) return;

    try {
        const response = await fetch(`${config.apiBaseUrl}/teams/${teamId}/eliminate`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error("Erro ao eliminar equipe");

        alert("Equipe eliminada com sucesso!");
        loadTeams();
    } catch (error) {
        console.error(error.message);
        alert("Erro ao eliminar equipe.");
    }
}

// Adicionar botão "Eliminar" no renderTeams
function renderTeams(teamsData) {
    teamsContainer.innerHTML = "";

    teamsData.forEach(team => {
        const teamCard = document.createElement("div");
        teamCard.className = "team-card";
        teamCard.innerHTML = `
            <h3>${team.name}</h3>
            <img src="${team.emblemPath}" alt="${team.name} emblem">
            <p>Pontuação: ${team.points}</p>
            <button onclick="deleteTeam(${team.id})">Remover</button>
            <button onclick="openEditModal(${team.id}, '${team.name}', '${team.emblemPath}')">Editar</button>
            <button onclick="eliminateTeam(${team.id})">Eliminar</button>
        `;
        teamsContainer.appendChild(teamCard);
    });
}

// Função para abrir o modal de edição com dados da equipe
function openEditModal(teamId, name, emblemPath) {
    currentTeamId = teamId; // Define o ID da equipe sendo editada
    document.getElementById("edit-team-name").value = name || "";
    document.getElementById("edit-team-emblem").value = emblemPath || "";
    document.getElementById("edit-modal").style.display = "flex"; // Exibe o modal
}

// Função para editar uma equipe existente
document.getElementById("edit-team-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("edit-team-name").value;
    const emblemPath = document.getElementById("edit-team-emblem").value;

    try {
        const response = await fetch(`${config.apiBaseUrl}/teams/${currentTeamId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, emblemPath }),
        });

        if (!response.ok) throw new Error("Erro ao atualizar equipe");

        alert("Equipe atualizada com sucesso!");
        document.getElementById("edit-modal").style.display = "none";
        loadTeams();
    } catch (error) {
        console.error(error.message);
        alert("Erro ao atualizar equipe.");
    }
});

// Garante que o modal esteja oculto ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("edit-modal").style.display = "none";
});

// Fecha o modal de edição
document.querySelector(".modal .close").addEventListener("click", () => {
    document.getElementById("edit-modal").style.display = "none"; // Oculta o modal
});

// Fecha o modal ao clicar fora dele
window.addEventListener("click", (event) => {
    const modal = document.getElementById("edit-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Função para adicionar uma nova equipe
document.getElementById("add-team-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("team-name").value;
    const emblemPath = document.getElementById("team-emblem").value;

    try {
        const response = await fetch(`${config.apiBaseUrl}/teams`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, emblemPath, points: 0 }),
        });

        if (!response.ok) throw new Error("Erro ao adicionar equipe");

        alert("Equipe adicionada com sucesso!");
        loadTeams();
    } catch (error) {
        console.error(error.message);
        alert("Erro ao adicionar equipe.");
    }
});

// Função para deletar uma equipe
async function deleteTeam(teamId) {
    if (!confirm("Tem certeza que deseja remover esta equipe?")) return;

    try {
        const response = await fetch(`${config.apiBaseUrl}/teams/${teamId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Erro ao remover equipe");

        alert("Equipe removida com sucesso!");
        loadTeams();
    } catch (error) {
        console.error(error.message);
        alert("Erro ao remover equipe.");
    }
}

// Carregar o placar ao iniciar
document.addEventListener("DOMContentLoaded", loadTeams);
