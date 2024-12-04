// Path: /backend/models/Lobby.js
const mongoose = require('mongoose');

const LobbySchema = new mongoose.Schema({
  lobbyId: { type: String, required: true, unique: true },
  hostName: { type: String, required: true },
  lobbyName: { type: String, required: true },
  maxPlayers: { type: Number, required: true },
  category: { type: String, required: true },
  joinCode: { type: String, required: true, unique: true },
  players: { type: Array, default: [] },
  kickedPlayers: { type: Array, default: [] }, // Hier wird kickedPlayers initialisiert
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Lobby', LobbySchema);
