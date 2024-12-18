const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let players = [];

const loadPlayers = () => {
    try {
        const data = fs.readFileSync('players.json', 'utf8');
        players = JSON.parse(data);
    } catch (err) {
        players = [];
    }
};

const savePlayers = () => {
    fs.writeFileSync('players.json', JSON.stringify(players, null, 2));
};

app.get('/players', (req, res) => {
    loadPlayers();
    res.json(players);
});

app.post('/players', (req, res) => {
    const newPlayer = req.body;
    players.push(newPlayer);
    savePlayers();
    res.status(201).json(newPlayer);
});

app.put('/players/:index', (req, res) => {
    const index = req.params.index;
    players[index] = req.body;
    savePlayers();
    res.json(players[index]);
});

app.delete('/players/:index', (req, res) => {
    const index = req.params.index;
    players.splice(index, 1);
    savePlayers();
    res.status(204).send();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
