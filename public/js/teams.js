// Seleciona o contêiner onde as equipes serão exibidas
const teamsContainer = document.getElementById("teams-container");
let currentTeamId = null; // Variável para armazenar o ID da equipe sendo editada

// Função para carregar equipes do servidor
async function loadTeams() {
    try {
        const response = await fetch("http://localhost:3000/teams");
        if (!response.ok) throw new Error("Erro ao carregar equipes");

        const teams = await response.json();
        renderTeams(teams);
    } catch (error) {
        console.error(error.message);
        alert("Erro ao carregar equipes. Tente novamente mais tarde.");
    }
}




// Função para renderizar as equipes no DOM
function renderTeams(teamsData) {
    teamsContainer.innerHTML = ""; // Limpa o contêiner antes de renderizar

    teamsData.forEach(team => {
        const teamCard = document.createElement("div");
        teamCard.className = "team-card";
        teamCard.innerHTML = `
            <h3>${team.name}</h3>
            <img src="${team.emblem || 'assets/images/default.png'}" alt="${team.name} emblem">
            <p>Pontuação: ${team.points}</p>
            <button onclick="deleteTeam(${team.id})">Remover</button>
            <button onclick="openEditModal(${team.id}, '${team.name}', '${team.emblem}')">Editar</button>
        `;
        teamsContainer.appendChild(teamCard);
    });
}

// Função para abrir o modal de edição com dados da equipe
function openEditModal(teamId, name, emblem) {
    currentTeamId = teamId; // Define o ID da equipe sendo editada
    document.getElementById("edit-team-name").value = name;
    document.getElementById("edit-team-emblem").value = emblem;
    document.getElementById("edit-modal").style.display = "block";
}

// Fecha o modal de edição
document.querySelector(".modal .close").addEventListener("click", () => {
    document.getElementById("edit-modal").style.display = "none";
});

// Função para adicionar uma nova equipe
document.getElementById("add-team-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("team-name").value;
    const emblem = document.getElementById("team-emblem").value;

    try {
        const response = await fetch("http://localhost:3000/teams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, emblem, points: 0 }),
        });

        if (!response.ok) throw new Error("Erro ao adicionar equipe");

        alert("Equipe adicionada com sucesso!");
        loadTeams();
    } catch (error) {
        console.error(error.message);
        alert("Erro ao adicionar equipe.");
    }
});

// Função para editar uma equipe existente
document.getElementById("edit-team-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("edit-team-name").value;
    const emblem = document.getElementById("edit-team-emblem").value;

    try {
        const response = await fetch(`http://localhost:3000/teams/${currentTeamId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, emblem }),
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

// Função para deletar uma equipe
async function deleteTeam(teamId) {
    if (!confirm("Tem certeza que deseja remover esta equipe?")) return;

    try {
        const response = await fetch(`http://localhost:3000/teams/${teamId}`, {
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

const leaderboardContainer = document.getElementById("leaderboard-container");

// Função para carregar o placar
async function loadLeaderboard() {
    try {
        const response = await fetch("http://localhost:3000/teams");
        if (!response.ok) {
            throw new Error("Erro ao carregar o placar.");
        }

        const teams = await response.json();
        // Ordenar as equipes por pontuação (maior para menor)
        teams.sort((a, b) => b.points - a.points);

        // Renderizar o placar
        leaderboardContainer.innerHTML = "";
        teams.forEach(team => {
            const teamRow = document.createElement("div");
            teamRow.className = "team-row";
            teamRow.innerHTML = `
                <span>${team.name}</span>
                <span>${team.points} pontos</span>
                <button onclick="changePoints(${team.id}, 1)">+1</button>
                <button onclick="changePoints(${team.id}, -1)">-1</button>
            `;
            leaderboardContainer.appendChild(teamRow);
        });
    } catch (error) {
        console.error(error.message);
    }
}

async function changePoints(teamId, delta) {
    try {
        const response = await fetch(`http://localhost:3000/teams/${teamId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ delta }), // Envia o delta para o servidor
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao atualizar os pontos.");
        }

        // Recarregar o placar após a atualização
        loadLeaderboard();
    } catch (error) {
        console.error("Erro ao alterar pontos:", error.message);
        alert(`Erro: ${error.message}`);
    }
}


// Carregar o placar ao iniciar
document.addEventListener("DOMContentLoaded", loadLeaderboard);


// Carrega equipes ao inicializar a página
document.addEventListener("DOMContentLoaded", loadTeams);
