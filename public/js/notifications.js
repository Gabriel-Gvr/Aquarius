// notifications.js - Sistema de Notificações
const notificationsContainer = document.getElementById("notifications");

// Função para exibir notificações
function notify(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerText = message;
    notificationsContainer.appendChild(notification);

    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Tipos de notificações: success, error, info
