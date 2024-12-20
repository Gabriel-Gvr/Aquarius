async function addPlayer(teamId, playerName) {
    const response = await fetch(`http://localhost:3000/teams/${teamId}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName }),
    });

    if (response.ok) {
        alert("Jogador adicionado!");
        loadTeams();
    } else {
        alert("Erro ao adicionar jogador.");
    }
}

async function removePlayer(teamId, playerId) {
    const response = await fetch(`http://localhost:3000/teams/${teamId}/players/${playerId}`, {
        method: "DELETE",
    });

    if (response.ok) {
        alert("Jogador removido!");
        loadTeams();
    } else {
        alert("Erro ao remover jogador.");
    }
}
