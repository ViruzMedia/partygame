const express = require('express');
const { createLobby, joinLobby, closeLobby } = require('../controllers/lobbyController');

const router = express.Router();

// Route: Lobby erstellen
router.post('/create', createLobby);

// Route: Lobby beitreten
router.post('/join', joinLobby);

// Route: Lobby schließen
router.post('/close', closeLobby);

module.exports = router;