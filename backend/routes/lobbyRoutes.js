// Path: /backend/routes/lobbyRoutes.js
const express = require('express');
const { createLobby, joinLobby, leaveLobby, closeLobby, getLobbyDetails } = require('../controllers/lobbyController');
const router = express.Router();

router.post('/create', createLobby);
router.post('/join', joinLobby);
router.post('/leave', leaveLobby);
router.post('/close', closeLobby);
router.get('/:lobbyId', getLobbyDetails);

module.exports = router;
