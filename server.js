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

const loadPlayers2 = () => {
    try {
        const data = fs.readFileSync('players2.json', 'utf8');
        players = JSON.parse(data);
    } catch (err) {
        players = [];
    }
};

const savePlayers2 = () => {
    fs.writeFileSync('players2.json', JSON.stringify(players, null, 2));
};

const loadPlayers3 = () => {
    try {
        const data = fs.readFileSync('players3.json', 'utf8');
        players = JSON.parse(data);
    } catch (err) {
        players = [];
    }
};

const savePlayers3 = () => {
    fs.writeFileSync('players3.json', JSON.stringify(players, null, 2));
};

// Rotas para players.json
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
    players[index-1] = req.body;
    savePlayers();
    res.json(players[index-1]);
});

app.delete('/players/:index', (req, res) => {
    const index = req.params.index;
    players.splice(index, 1);
    savePlayers();
    res.status(204).send();
});

// Rotas para players2.json
app.get('/players2', (req, res) => {
    loadPlayers2();
    res.json(players);
});

app.post('/players2', (req, res) => {
    const newPlayer = req.body;
    players.push(newPlayer);
    savePlayers2();
    res.status(201).json(newPlayer);
});

app.put('/players2/:index', (req, res) => {
    const index = req.params.index;
    players[index-1] = req.body;
    savePlayers2();
    res.json(players[index-1]);
});

app.delete('/players2/:index', (req, res) => {
    const index = req.params.index;
    players.splice(index, 1);
    savePlayers2();
    res.status(204).send();
});

// Rotas para players3.json
app.get('/players3', (req, res) => {
    loadPlayers3();
    res.json(players);
});

app.post('/players3', (req, res) => {
    const newPlayer = req.body;
    players.push(newPlayer);
    savePlayers3();
    res.status(201).json(newPlayer);
});

app.put('/players3/:index', (req, res) => {
    const index = req.params.index;
    players[index-1] = req.body;
    savePlayers3();
    res.json(players[index-1]);
});

app.delete('/players3/:index', (req, res) => {
    const index = req.params.index;
    players.splice(index, 1);
    savePlayers3();
    res.status(204).send();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
