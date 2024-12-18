document.addEventListener('DOMContentLoaded', function() {
    const playerTable = document.getElementById('playerTable');
    const showFormButton = document.getElementById('showFormButton');
    const closeFormButton = document.getElementById('closeFormButton');
    const addPlayerForm = document.getElementById('addPlayerForm');
    const playerNameInput = document.getElementById('playerName');
    const playerWinsInput = document.getElementById('playerWins');
    const playerDrawsInput = document.getElementById('playerDraws');
    const playerLossesInput = document.getElementById('playerLosses');
    const submitButton = addPlayerForm.querySelector('button[type="submit"]');
    const overlayTitle = document.querySelector('.overlay-content h2');
    const editDataButton = document.createElement('button');
    editDataButton.id = 'editDataButton';
    editDataButton.textContent = 'Editar Dados';
    editDataButton.style.display = 'block';
    editDataButton.style.margin = '20px auto';
    editDataButton.style.padding = '10px 20px';
    editDataButton.style.backgroundColor = '#333';
    editDataButton.style.color = 'white';
    editDataButton.style.border = 'none';
    editDataButton.style.borderRadius = '5px';
    editDataButton.style.cursor = 'pointer';
    document.body.appendChild(editDataButton);

    const saveButton = document.createElement('button');
    saveButton.id = 'saveButton';
    saveButton.textContent = 'Salvar Dados';
    saveButton.style.display = 'none';
    saveButton.style.margin = '20px auto';
    saveButton.style.padding = '10px 20px';
    saveButton.style.backgroundColor = '#333';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '5px';
    saveButton.style.cursor = 'pointer';
    document.body.appendChild(saveButton);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.appendChild(editDataButton);
    buttonContainer.appendChild(saveButton);
    document.body.appendChild(buttonContainer);

    let players = [];
    let isEditing = false;
    let editIndex = -1;
    let isEditMode = false;
    const correctPassword = 'nvs'; // Defina a senha correta aqui

    const loadPlayers = async () => {
        try {
            const response = await fetch('http://localhost:3000/players');
            players = await response.json();
            renderTable(); // Re-renderizar a tabela com os dados atualizados
        } catch (error) {
            console.error('Erro ao carregar jogadores:', error);
        }
    };

    const savePlayer = async (player) => {
        try {
            const response = await fetch('http://localhost:3000/players', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(player)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao salvar jogador:', error);
        }
    };

    const updatePlayer = async (id, player) => {
        try {
            const response = await fetch(`http://localhost:3000/players/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(player)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar jogador:', error);
        }
    };

    const deletePlayer = async (index) => {
        try {
            await fetch(`http://localhost:3000/players/${index}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Erro ao remover jogador:', error);
        }
    };

    function renderTable() {
        playerTable.innerHTML = '';
        players.sort((a, b) => b.points - a.points);

        players.forEach((player, index) => {
            const totalGames = player.wins + player.draws + player.losses;
            const score = totalGames > 0 ? (player.points / totalGames).toFixed(2) : 0;

            const row = document.createElement('tr');
            row.setAttribute('data-id', player.id); // Adiciona o id do jogador à linha
            row.innerHTML = `
                <td>${index + 1}</td>
                <td class="editable" contenteditable="false">${player.name}</td>
                <td>${player.points}</td>
                <td>${score}</td>
                <td class="editable" contenteditable="false">${player.wins}</td>
                <td class="editable" contenteditable="false">${player.draws}</td>
                <td class="editable" contenteditable="false">${player.losses}</td>
                <td>${totalGames}</td>
            `;
            playerTable.appendChild(row);
        });
    }

    function resetForm() {
        playerNameInput.value = '';
        playerWinsInput.value = '';
        playerDrawsInput.value = '';
        playerLossesInput.value = '';
    }

    function addPlayer(event) {
        event.preventDefault();
        const wins = parseInt(playerWinsInput.value);
        const draws = parseInt(playerDrawsInput.value);
        const losses = parseInt(playerLossesInput.value);
        const points = (wins * 2) + draws;
        const games = wins + draws + losses;

        const newPlayer = {
            id: Date.now(), // Gera um ID único baseado na data/hora atual
            name: playerNameInput.value,
            points: points,
            wins: wins,
            draws: draws,
            losses: losses,
            games: games
        };

        savePlayer(newPlayer).then(() => {
            players.push(newPlayer);
            renderTable();
            addPlayerForm.reset();
            document.getElementById('overlay').style.display = 'none';
        });
    }

    function editPlayer(index) {
        const player = players[index];
        playerNameInput.value = player.name;
        playerWinsInput.value = player.wins;
        playerDrawsInput.value = player.draws;
        playerLossesInput.value = player.losses;

        document.getElementById('overlay').style.display = 'block';
        isEditing = true;
        editIndex = index;
        submitButton.textContent = 'Gravar';
        overlayTitle.textContent = 'Editar Jogador';

        addPlayerForm.onsubmit = function(event) {
            event.preventDefault();
            const wins = parseInt(playerWinsInput.value);
            const draws = parseInt(playerDrawsInput.value);
            const losses = parseInt(playerLossesInput.value);
            const points = (wins * 2) + draws;
            const games = wins + draws + losses;

            player.name = playerNameInput.value;
            player.points = points;
            player.wins = wins;
            player.draws = draws;
            player.losses = losses;
            player.games = games;

            updatePlayer(player.id, player).then(() => {
                renderTable();
                addPlayerForm.reset();
                addPlayerForm.onsubmit = addPlayer;
                document.getElementById('overlay').style.display = 'none';
                submitButton.textContent = 'Adicionar Jogador';
                overlayTitle.textContent = 'Adicionar Novo Jogador';
            });
        };
    }

    function removePlayer(index) {
        const player = players[index];
        deletePlayer(player.id).then(() => {
            players.splice(index, 1);
            renderTable();
        });
    }

    showFormButton.addEventListener('click', function() {
        resetForm();
        submitButton.textContent = 'Gravar';
        overlayTitle.textContent = 'Adicionar Novo Jogador';
        document.getElementById('overlay').style.display = 'block';
    });

    closeFormButton.addEventListener('click', function() {
        resetForm();
        document.getElementById('overlay').style.display = 'none';
    });

    editDataButton.addEventListener('click', function() {
        if (!isEditMode) {
            const password = prompt('Por favor, insira a senha para editar os dados:');
            if (password === correctPassword) {
                document.querySelectorAll('.editable').forEach(cell => {
                    cell.setAttribute('contenteditable', 'true'); // Tornar todas as células com a classe 'editable' editáveis
                    cell.addEventListener('input', updateValues); // Adicionar evento para atualizar valores em tempo real
                });
                saveButton.style.display = 'block'; // Mostrar botão "Salvar Dados"
                editDataButton.textContent = 'Sair de Edição';
                isEditMode = true;
            } else {
                alert('Não tem permissões para editar.');
            }
        } else {
            document.querySelectorAll('.editable').forEach(cell => {
                cell.setAttribute('contenteditable', 'false'); // Tornar todas as células com a classe 'editable' não editáveis
                cell.removeEventListener('input', updateValues); // Remover evento para atualizar valores
            });
            saveButton.style.display = 'none'; // Esconder botão "Salvar Dados"
            editDataButton.textContent = 'Editar Dados';
            isEditMode = false;
        }
    });
    
    function updateValues() {
        const row = this.parentElement;
        const wins = parseInt(row.querySelector('td:nth-child(5)').textContent) || 0;
        const draws = parseInt(row.querySelector('td:nth-child(6)').textContent) || 0;
        const losses = parseInt(row.querySelector('td:nth-child(7)').textContent) || 0;
        
        const points = (wins * 2) + draws;
        const totalGames = wins + draws + losses;
        const score = totalGames > 0 ? (points / totalGames).toFixed(2) : 0;
    
        row.querySelector('td:nth-child(3)').textContent = points; // Atualizar pontos
        row.querySelector('td:nth-child(4)').textContent = score; // Atualizar score
        row.querySelector('td:nth-child(8)').textContent = totalGames; // Atualizar total de jogos
    }
    
    saveButton.addEventListener('click', async function() {
        const rows = document.querySelectorAll('tbody tr');
        const updatedPlayers = [];
    
        rows.forEach((row) => {
            const id = row.getAttribute('data-id'); // Obter o id do jogador
            const cells = row.querySelectorAll('td');
            const player = {
                id: parseInt(id), // Manter o id
                name: cells[1].textContent.trim(),
                points: parseInt(cells[2].textContent) || 0,
                wins: parseInt(cells[4].textContent) || 0,
                draws: parseInt(cells[5].textContent) || 0,
                losses: parseInt(cells[6].textContent) || 0,
                games: parseInt(cells[7].textContent) || 0
            };
            updatedPlayers.push(player);
        });
    
        // Atualizar todos os jogadores no servidor
        try {
            await Promise.all(updatedPlayers.map(player => updatePlayer(player.id, player)));
            alert('Dados salvos com sucesso!');
            await loadPlayers(); // Carregar os dados atualizados e re-renderizar a tabela
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            alert('Ocorreu um erro ao salvar os dados.');
        }
    
        saveButton.style.display = 'none'; // Esconder botão "Salvar Dados" após salvar
        editDataButton.textContent = 'Editar Dados';
        isEditMode = false;
    });
    
    addPlayerForm.addEventListener('submit', addPlayer);
    loadPlayers();
});
