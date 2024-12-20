const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Caminho para os arquivos JSON
const dataFolderPath = path.join(__dirname, "data");
const teamsFilePath = path.join(dataFolderPath, "teams.json");

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

// Garantir que a pasta e os arquivos de dados existam
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

// Função para carregar equipes do arquivo JSON
function loadTeams() {
    const data = fs.readFileSync(teamsFilePath, "utf8");
    return JSON.parse(data);
}

// Função para salvar equipes no arquivo JSON
function saveTeams(teams) {
    fs.writeFileSync(teamsFilePath, JSON.stringify(teams, null, 2), "utf8");
}

// Rota para buscar todas as equipes
app.get("/teams", (req, res) => {
    try {
        const teams = loadTeams();
        res.json(teams);
    } catch (error) {
        res.status(500).send({ error: "Erro ao carregar dados das equipes." });
    }
});

// Rota para adicionar uma nova equipe
app.post("/teams", (req, res) => {
    try {
        const teams = loadTeams();
        const newTeam = { id: Date.now(), ...req.body }; // Gera um ID único para cada equipe
        teams.push(newTeam);
        saveTeams(teams);
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).send({ error: "Erro ao adicionar equipe." });
    }
});

// Rota para remover uma equipe
app.delete("/teams/:id", (req, res) => {
    try {
        const teams = loadTeams();
        const updatedTeams = teams.filter(team => team.id !== parseInt(req.params.id));
        saveTeams(updatedTeams);
        res.status(200).send();
    } catch (error) {
        res.status(500).send({ error: "Erro ao remover equipe." });
    }
});

// Rota para atualizar os pontos de uma equipe
app.post("/update-team", (req, res) => {
    const { name, points } = req.body;

    if (!name || points == null) {
        return res.status(400).send({ error: "Dados inválidos." });
    }

    try {
        const teams = loadTeams();
        const team = teams.find(t => t.name === name);

        if (!team) {
            return res.status(404).send({ error: "Equipe não encontrada." });
        }

        team.points = points;
        saveTeams(teams);
        res.send({ message: "Equipe atualizada com sucesso." });
    } catch (error) {
        res.status(500).send({ error: "Erro ao atualizar equipe." });
    }
});

// Rota para atualizar os dados de uma equipe
app.put('/teams/:id', (req, res) => {
    const teamId = parseInt(req.params.id);
    const { name, emblem } = req.body;

    if (!name) {
        return res.status(400).send({ error: 'O novo nome é obrigatório.' });
    }

    const teams = loadTeams();
    const teamIndex = teams.findIndex(team => team.id === teamId);

    if (teamIndex === -1) {
        return res.status(404).send({ error: 'Equipe não encontrada.' });
    }

    // Rota para alterar os pontos de uma equipe
app.patch("/teams/:id", (req, res) => {
    const teamId = parseInt(req.params.id);
    const { delta } = req.body;

    // Validar se o delta foi enviado
    if (typeof delta !== "number") {
        return res.status(400).send({ error: "Delta deve ser um número." });
    }

    const teams = loadTeams();
    const team = teams.find(t => t.id === teamId);

    // Verificar se a equipe existe
    if (!team) {
        return res.status(404).send({ error: "Equipe não encontrada." });
    }

    // Atualizar a pontuação
    team.points += delta;

    try {
        saveTeams(teams);
        res.status(200).send({ message: "Pontuação atualizada com sucesso.", team });
    } catch (error) {
        res.status(500).send({ error: "Erro ao salvar as alterações." });
    }
});




    // Atualiza os dados da equipe
    teams[teamIndex].name = name;
    if (emblem) {
        teams[teamIndex].emblem = emblem;
    }

    try {
        saveTeams(teams);
        res.send({ message: 'Equipe atualizada com sucesso.', team: teams[teamIndex] });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao salvar as alterações.' });
    }
});

// Rota inicial
app.get("/", (req, res) => {
    res.send("Bem-vindo ao servidor do Projeto Aquarius!");
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
