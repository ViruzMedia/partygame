// Path: /backend/models/Player.js
const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  playerId: { type: String, required: true, unique: true },
  playerName: { type: String, required: true },
  lobbyId: { type: String, required: true },
});

module.exports = mongoose.model('Player', PlayerSchema);
