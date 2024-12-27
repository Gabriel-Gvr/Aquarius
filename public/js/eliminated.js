const eliminatedContainer = document.getElementById("eliminated-teams-container");

// Função para carregar equipes eliminadas do servidor
async function loadEliminatedTeams() {
    try {
        const response = await fetch("http://localhost:3000/eliminated-teams");
        if (!response.ok) throw new Error("Erro ao carregar equipes eliminadas");

        const eliminatedTeams = await response.json();
        renderEliminatedTeams(eliminatedTeams);
    } catch (error) {
        console.error(error.message);
        alert("Erro ao carregar equipes eliminadas.");
    }
}

// Renderiza as equipes eliminadas no DOM
function renderEliminatedTeams(eliminatedTeams) {
    eliminatedContainer.innerHTML = "";

    eliminatedTeams.forEach(team => {
        const teamCard = document.createElement("div");
        teamCard.className = "team-card eliminated";
        teamCard.innerHTML = `
            <h3>${team.name}</h3>
            <img src="${team.emblemPath}" alt="${team.name} emblem">
            <button onclick="restoreTeam(${team.id})">Restaurar</button>
        `;
        eliminatedContainer.appendChild(teamCard);
    });
}

// Função para restaurar uma equipe eliminada
async function restoreTeam(teamId) {
    try {
        const response = await fetch(`http://localhost:3000/teams/${teamId}/restore`, {
            method: "PATCH",
        });

        if (!response.ok) throw new Error("Erro ao restaurar equipe");

        alert("Equipe restaurada com sucesso!");
        loadTeams();
        loadEliminatedTeams(); // Atualiza as listas
    } catch (error) {
        console.error(error.message);
        alert("Erro ao restaurar equipe.");
    }
}

// Carregar equipes eliminadas ao iniciar
document.addEventListener("DOMContentLoaded", loadEliminatedTeams);
