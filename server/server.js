const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Caminho para arquivos de dados
const dataFolderPath = path.join(__dirname, "..", "data");
const teamsFilePath = path.join(dataFolderPath, "teams.json");
const tasksFilePath = path.join(dataFolderPath, "tasks.json");
const eliminateFilePath = path.join(dataFolderPath, "eliminate.json");

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

// Confirma se as pastas e arquivos JSON existem
function ensureFileExists(filePath, defaultContent) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, defaultContent, "utf8");
        console.log(`Arquivo criado: ${filePath}`);
    }
}

if (!fs.existsSync(dataFolderPath)) {
    fs.mkdirSync(dataFolderPath);
    console.log(`Pasta criada: ${dataFolderPath}`);
}

ensureFileExists(teamsFilePath, "[]");
ensureFileExists(tasksFilePath, "[]");
ensureFileExists(eliminateFilePath, "[]");

// Função para carregar dados de um arquivo JSON
function loadData(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`Erro ao carregar dados de ${filePath}:`, error);
        return [];
    }
}

// Função para salvar dados em um arquivo JSON
function saveData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
        console.log(`Dados salvos em: ${filePath}`);
    } catch (error) {
        console.error(`Erro ao salvar dados em ${filePath}:`, error);
    }
}

// Funções específicas para equipes
function loadTeams() {
    return loadData(teamsFilePath);
}

function saveTeams(teams) {
    saveData(teamsFilePath, teams);
}

// Funções específicas para eliminações
function loadEliminatedTeams() {
    return loadData(eliminateFilePath);
}

function saveEliminatedTeams(teams) {
    saveData(eliminateFilePath, teams);
}

// Funções específicas para tarefas
function loadTasks() {
    return loadData(tasksFilePath);
}

function saveTasks(tasks) {
    saveData(tasksFilePath, tasks);
}

// Rotas para equipes
app.get("/teams", (req, res) => {
    try {
        const teams = loadTeams();
        res.json(teams);
    } catch (error) {
        console.error("Erro ao carregar dados das equipes:", error);
        res.status(500).json({ error: "Erro ao carregar dados das equipes" });
    }
});

app.post("/teams", (req, res) => {
    try {
        const teams = loadTeams();
        const newTeam = { id: Date.now(), points: 0, ...req.body };
        teams.push(newTeam);
        saveTeams(teams);
        res.status(201).json(newTeam);
    } catch (error) {
        console.error("Erro ao adicionar equipe:", error);
        res.status(500).json({ error: "Erro ao adicionar equipe" });
    }
});

app.delete("/teams/:id", (req, res) => {
    try {
        const teams = loadTeams();
        const updatedTeams = teams.filter(team => team.id !== parseInt(req.params.id));
        saveTeams(updatedTeams);
        res.status(200).send();
    } catch (error) {
        console.error("Erro ao remover equipe:", error);
        res.status(500).json({ error: "Erro ao remover equipe" });
    }
});

app.put("/teams/:id", (req, res) => {
    const teamId = parseInt(req.params.id);
    const { name, emblem } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Necessário novo nome" });
    }

    const teams = loadTeams();
    const teamIndex = teams.findIndex(team => team.id === teamId);

    if (teamIndex === -1) {
        return res.status(404).json({ error: "Equipe não encontrada" });
    }

    teams[teamIndex].name = name;
    if (emblem) {
        teams[teamIndex].emblem = emblem;
    }

    try {
        saveTeams(teams);
        res.json({ message: "Equipe atualizada!", team: teams[teamIndex] });
    } catch (error) {
        console.error("Erro ao salvar mudanças:", error);
        res.status(500).json({ error: "Erro ao salvar mudanças" });
    }
});

app.patch("/teams/:id", (req, res) => {
    const teamId = parseInt(req.params.id);
    const { delta } = req.body;

    if (typeof delta !== "number") {
        return res.status(400).json({ error: "Delta precisa ser um número" });
    }

    const teams = loadTeams();
    const team = teams.find(t => t.id === teamId);

    if (!team) {
        return res.status(404).json({ error: "Equipe não encontrada" });
    }

    team.points += delta;

    try {
        saveTeams(teams);
        res.json({ message: "Pontuação atualizada", team });
    } catch (error) {
        console.error("Erro ao salvar pontuação:", error);
        res.status(500).json({ error: "Erro ao salvar pontuação" });
    }
});

// Nova rota para eliminar equipes
app.patch("/teams/:id/eliminate", (req, res) => {
    const teamId = parseInt(req.params.id);

    console.log(`Eliminando equipe com ID: ${teamId}`);

    const teams = loadTeams();
    const eliminatedTeams = loadEliminatedTeams();
    const team = teams.find(t => t.id === teamId);

    if (!team) {
        console.error("Equipe não encontrada ao tentar eliminar:", teamId);
        return res.status(404).json({ error: "Equipe não encontrada" });
    }

    eliminatedTeams.push(team);

    try {
        saveEliminatedTeams(eliminatedTeams);
        const updatedTeams = teams.filter(t => t.id !== teamId);
        saveTeams(updatedTeams);
        console.log(`Equipe ${teamId} eliminada com sucesso`);
        res.json({ message: "Equipe eliminada com sucesso", team });
    } catch (error) {
        console.error("Erro ao salvar mudanças ao eliminar equipe:", error);
        res.status(500).json({ error: "Erro ao salvar mudanças" });
    }
});

// Nova rota para restaurar equipes eliminadas
app.patch("/teams/:id/restore", (req, res) => {
    const teamId = parseInt(req.params.id);

    console.log(`Restaurando equipe com ID: ${teamId}`);

    const teams = loadTeams();
    const eliminatedTeams = loadEliminatedTeams();
    const teamIndex = eliminatedTeams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) {
        console.error("Equipe não encontrada ao tentar restaurar:", teamId);
        return res.status(404).json({ error: "Equipe não encontrada" });
    }

    const team = eliminatedTeams.splice(teamIndex, 1)[0];
    teams.push(team);

    try {
        saveEliminatedTeams(eliminatedTeams);
        saveTeams(teams);
        console.log(`Equipe ${teamId} restaurada com sucesso`);
        res.json({ message: "Equipe restaurada com sucesso", team });
    } catch (error) {
        console.error("Erro ao salvar mudanças ao restaurar equipe:", error);
        res.status(500).json({ error: "Erro ao salvar mudanças" });
    }
});

// Rota para obter equipes eliminadas
app.get("/eliminated-teams", (req, res) => {
    try {
        const eliminatedTeams = loadEliminatedTeams();
        res.json(eliminatedTeams);
    } catch (error) {
        console.error("Erro ao carregar equipes eliminadas:", error);
        res.status(500).json({ error: "Erro ao carregar equipes eliminadas" });
    }
});


// Rotas para tarefas
app.get("/tasks", (req, res) => {
    try {
        const tasks = loadTasks();
        res.json(tasks);
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        res.status(500).json({ error: "Erro ao carregar tarefas" });
    }
});

app.post("/tasks", (req, res) => {
    try {
        const tasks = loadTasks();
        const newTask = { id: Date.now(), ...req.body };
        tasks.push(newTask);
        saveTasks(tasks);
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
        res.status(500).json({ error: "Erro ao adicionar tarefa" });
    }
});

app.delete("/tasks/:id", (req, res) => {
    try {
        const tasks = loadTasks();
        const updatedTasks = tasks.filter(task => task.id !== parseInt(req.params.id));
        saveTasks(updatedTasks);
        res.status(200).send();
    } catch (error) {
        console.error("Erro ao remover tarefa:", error);
        res.status(500).json({ error: "Erro ao remover tarefa" });
    }
});

app.put("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const { name, details, points } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Necessário novo nome" });
    }

    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    tasks[taskIndex].name = name;
    tasks[taskIndex].details = details;
    tasks[taskIndex].points = points;

    try {
        saveTasks(tasks);
        res.json({ message: "Tarefa atualizada!", task: tasks[taskIndex] });
    } catch (error) {
        console.error("Erro ao salvar mudanças:", error);
        res.status(500).json({ error: "Erro ao salvar mudanças" });
    }
});

app.patch("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const { completed } = req.body;

    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    task.completed = completed;

    try {
        saveTasks(tasks);
        res.json({ message: "Status da tarefa atualizado com sucesso", task });
    } catch (error) {
        console.error("Erro ao salvar status da tarefa:", error);
        res.status(500).json({ error: "Erro ao salvar status da tarefa" });
    }
});

// Middleware para tratar erros 404
app.use((req, res, next) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

// Middleware para tratar outros erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Erro interno do servidor" });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
