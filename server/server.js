const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Paths for data files
const dataFolderPath = path.join(__dirname, "data");
const teamsFilePath = path.join(dataFolderPath, "teams.json");

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

// Ensure the data folder and files exist
function ensureFileExists(filePath, defaultContent) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, defaultContent, "utf8");
        console.log(`File created: ${filePath}`);
    }
}

if (!fs.existsSync(dataFolderPath)) {
    fs.mkdirSync(dataFolderPath);
    console.log(`Folder created: ${dataFolderPath}`);
}

ensureFileExists(teamsFilePath, "[]");

// Function to load teams from JSON file
function loadTeams() {
    const data = fs.readFileSync(teamsFilePath, "utf8");
    return JSON.parse(data);
}

// Function to save teams to JSON file
function saveTeams(teams) {
    fs.writeFileSync(teamsFilePath, JSON.stringify(teams, null, 2), "utf8");
}

// Routes
app.get("/teams", (req, res) => {
    try {
        const teams = loadTeams();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: "Error loading teams data" });
    }
});

app.post("/teams", (req, res) => {
    try {
        const teams = loadTeams();
        const newTeam = { id: Date.now(), ...req.body };
        teams.push(newTeam);
        saveTeams(teams);
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ error: "Error adding team" });
    }
});

app.delete("/teams/:id", (req, res) => {
    try {
        const teams = loadTeams();
        const updatedTeams = teams.filter(team => team.id !== parseInt(req.params.id));
        saveTeams(updatedTeams);
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ error: "Error removing team" });
    }
});

app.put("/teams/:id", (req, res) => {
    const teamId = parseInt(req.params.id);
    const { name, emblem } = req.body;

    if (!name) {
        return res.status(400).json({ error: "New name is required" });
    }

    const teams = loadTeams();
    const teamIndex = teams.findIndex(team => team.id === teamId);

    if (teamIndex === -1) {
        return res.status(404).json({ error: "Team not found" });
    }

    teams[teamIndex].name = name;
    if (emblem) {
        teams[teamIndex].emblem = emblem;
    }

    try {
        saveTeams(teams);
        res.json({ message: "Team updated successfully", team: teams[teamIndex] });
    } catch (error) {
        res.status(500).json({ error: "Error saving changes" });
    }
});

app.patch("/teams/:id", (req, res) => {
    const teamId = parseInt(req.params.id);
    const { delta } = req.body;

    if (typeof delta !== "number") {
        return res.status(400).json({ error: "Delta must be a number" });
    }

    const teams = loadTeams();
    const team = teams.find(t => t.id === teamId);

    if (!team) {
        return res.status(404).json({ error: "Team not found" });
    }

    team.points += delta;

    try {
        saveTeams(teams);
        res.json({ message: "Points updated successfully", team });
    } catch (error) {
        res.status(500).json({ error: "Error saving changes" });
    }
});

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
