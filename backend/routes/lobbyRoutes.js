const express = require('express');
const router = express.Router();
const { createLobby, joinLobby } = require('../controllers/lobbyController');

// Route: Neue Lobby erstellen
router.post('/create', createLobby);

// Route: Beitreten einer bestehenden Lobby
router.post('/join', joinLobby);

module.exports = router;
