// prizes.js - Gerenciamento de Premiações
const prizesContainer = document.getElementById("prizes-container");

// Dados fictícios de premiações
const prizesData = [
    { name: "Café da manhã especial", description: "Café da manhã completo para a equipe vencedora.", image: "prizes/breakfast.png" },
    { name: "Dia de folga", description: "Um dia de folga para todos os integrantes da equipe.", image: "prizes/dayoff.png" },
    { name: "Vale compras", description: "Vale compras no valor de R$500 para cada membro.", image: "prizes/voucher.png" }
];

// Função para carregar premiações
function loadPrizes() {
    prizesContainer.innerHTML = "";
    prizesData.forEach(prize => {
        const prizeCard = document.createElement("div");
        prizeCard.className = "prize-card";
        prizeCard.innerHTML = `
            <img src="assets/images/${prize.image}" alt="${prize.name}">
            <h3>${prize.name}</h3>
            <p>${prize.description}</p>
        `;
        prizesContainer.appendChild(prizeCard);
    });
}

// Carregar premiações ao iniciar o script
document.addEventListener("DOMContentLoaded", loadPrizes);
