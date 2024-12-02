const express = require('express');
const router = express.Router();
const { createLobby, joinLobby } = require('../controllers/lobbyController');

// Route zum Erstellen einer neuen Lobby
router.post('/create', createLobby);

// Route zum Beitreten einer bestehenden Lobby
router.post('/join', joinLobby);

module.exports = router;
