// medals.js - Painel de Medalhas
const medalsContainer = document.getElementById("medals-container");

// Dados fictícios de medalhas
const medalsData = [
    { team: "Equipe Alpha", type: "Ouro", image: "medals/gold.png" },
    { team: "Equipe Beta", type: "Prata", image: "medals/silver.png" },
    { team: "Equipe Gamma", type: "Bronze", image: "medals/bronze.png" }
];

// Função para carregar medalhas
function loadMedals() {
    medalsContainer.innerHTML = "";
    medalsData.forEach(medal => {
        const medalCard = document.createElement("div");
        medalCard.className = "medal-card";
        medalCard.innerHTML = `
            <img src="assets/images/${medal.image}" alt="Medalha ${medal.type}">
            <p>${medal.team} - Medalha de ${medal.type}</p>
        `;
        medalsContainer.appendChild(medalCard);
    });
}

// Carregar medalhas ao iniciar o script
document.addEventListener("DOMContentLoaded", loadMedals);

async function assignMedal(teamId, medalId) {
    const response = await fetch(`http://localhost:3000/teams/${teamId}/medals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medalId }),
    });

    if (response.ok) {
        alert("Medalha atribuída!");
        loadTeams();
    } else {
        alert("Erro ao atribuir medalha.");
    }
}

