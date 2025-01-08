// score-history.js - Histórico de Pontuações
const historyContainer = document.getElementById("history-container");
const scoreHistory = [];

// Função para registrar alteração de pontuação
function logScoreChange(team, points, reason) {
    const timestamp = new Date().toLocaleString();
    const entry = { team, points, reason, timestamp };
    scoreHistory.push(entry);
    updateHistory();
    notify(`A pontuação de ${team} foi alterada em ${points} pontos.`, "info");
}

// Atualizar painel de histórico
function updateHistory() {
    historyContainer.innerHTML = "";
    scoreHistory.forEach(entry => {
        const historyCard = document.createElement("div");
        historyCard.className = "history-card";
        historyCard.innerHTML = `
            <p><strong>Equipe:</strong> ${entry.team}</p>
            <p><strong>Alteração:</strong> ${entry.points} pontos</p>
            <p><strong>Razão:</strong> ${entry.reason}</p>
            <p><strong>Data:</strong> ${entry.timestamp}</p>
        `;
        historyContainer.appendChild(historyCard);
    });
}
