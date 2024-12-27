const medalsList = document.getElementById("medals-list");
const medalsEarnedList = document.getElementById("medals-earned-list");
const medalsProgressList = document.getElementById("medals-progress-list");

// Função para carregar medalhas do servidor
async function loadMedals() {
    try {
        const response = await fetch("http://localhost:3000/medals");
        if (!response.ok) throw new Error("Erro ao carregar medalhas");

        const medals = await response.json();
        renderMedals(medals);
    } catch (error) {
        console.error(error.message);
        alert("Erro ao carregar medalhas.");
    }
}

// Função para renderizar medalhas
function renderMedals(medals) {
    medalsList.innerHTML = "";
    medalsEarnedList.innerHTML = "";
    medalsProgressList.innerHTML = "";

    medals.forEach(medal => {
        const medalCard = document.createElement("div");
        medalCard.className = "medal-card";
        medalCard.innerHTML = `
            <img src="${medal.icon}" alt="${medal.name} icon">
            <div>
                <h4>${medal.name}</h4>
                <p>${medal.description}</p>
                <p><strong>Critério:</strong> ${medal.criteria}</p>
            </div>
        `;

        medalsList.appendChild(medalCard);
    });

    // Exemplo de como renderizar medalhas conquistadas e em progresso
    // Substitua pelos dados reais das equipes
    const earnedMedals = medals.filter(medal => medal.id === 1); // Exemplo
    const progressMedals = medals.filter(medal => medal.id === 2); // Exemplo

    earnedMedals.forEach(medal => {
        const medalCard = document.createElement("div");
        medalCard.className = "medal-card";
        medalCard.innerHTML = `
            <img src="${medal.icon}" alt="${medal.name} icon">
            <div>
                <h4>${medal.name}</h4>
                <p>${medal.description}</p>
            </div>
        `;

        medalsEarnedList.appendChild(medalCard);
    });

    progressMedals.forEach(medal => {
        const medalCard = document.createElement("div");
        medalCard.className = "medal-card";
        medalCard.innerHTML = `
            <img src="${medal.icon}" alt="${medal.name} icon">
            <div>
                <h4>${medal.name}</h4>
                <p>${medal.description}</p>
                <p><strong>Progresso:</strong> 80%</p> <!-- Exemplo de progresso -->
            </div>
        `;

        medalsProgressList.appendChild(medalCard);
    });
}

// Carregar medalhas ao iniciar
document.addEventListener("DOMContentLoaded", loadMedals);
