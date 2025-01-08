// avatars.js - Avatares e Conquistas
const avatarsContainer = document.getElementById("avatars-container");

// Dados fictícios de avatares e conquistas
const avatarsData = [
    { name: "João", avatar: "avatars/joao.png", achievements: ["Conquistou 50 pontos", "Completou 5 missões"] },
    { name: "Maria", avatar: "avatars/maria.png", achievements: ["Conquistou 100 pontos", "Ganhou medalha de ouro"] },
    { name: "Carlos", avatar: "avatars/carlos.png", achievements: ["Participou de todas as missões"] }
];

// Função para carregar avatares e conquistas
function loadAvatars() {
    avatarsContainer.innerHTML = "";
    avatarsData.forEach(participant => {
        const avatarCard = document.createElement("div");
        avatarCard.className = "avatar-card";
        avatarCard.innerHTML = `
            <img src="assets/images/${participant.avatar}" alt="${participant.name}">
            <h3>${participant.name}</h3>
            <ul>
                ${participant.achievements.map(ach => `<li>${ach}</li>`).join("")}
            </ul>
        `;
        avatarsContainer.appendChild(avatarCard);
    });
}

// Carregar avatares ao iniciar o script
document.addEventListener("DOMContentLoaded", loadAvatars);
