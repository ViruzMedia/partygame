// Path: /backend/controllers/lobbyController.js
const { v4: uuidv4 } = require('uuid');
const Lobby = require('../models/Lobby');

// Create Lobby
exports.createLobby = async (req, res) => {
  try {
    const { hostName, lobbyName, maxPlayers, category } = req.body;
    const lobbyId = uuidv4();
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const hostPlayerId = uuidv4(); // ID für den Host erstellen

    const newLobby = new Lobby({
      lobbyId,
      hostName,
      lobbyName,
      maxPlayers,
      category,
      joinCode,
      players: [{ playerId: hostPlayerId, playerName: hostName, socketId: null }], // Host als Spieler hinzufügen
      isActive: true,
    });

    await newLobby.save();
    console.log(`[LOBBY CREATED] - Lobby ${lobbyName} created by ${hostName}`);
    // Sende sowohl die Lobby-Informationen als auch die playerId des Hosts zurück
    res.status(201).json({ lobbyId, joinCode, playerId: hostPlayerId });
  } catch (err) {
    console.error('[CREATE LOBBY ERROR]', err);
    res.status(500).json({ error: 'Error creating lobby' });
  }
};



exports.joinLobby = async (req, res) => {
  try {
    const { joinCode, playerName, socketId } = req.body;

    // Lobby finden
    const lobby = await Lobby.findOne({ joinCode, isActive: true });
    if (!lobby) {
      console.log('[JOIN LOBBY ERROR] Lobby not found or inactive');
      return res.status(404).json({ error: 'Diese Lobby ist nicht mehr verfügbar.' });
    }

    // Maximale Anzahl an Spielern überprüfen
    if (lobby.players.length >= lobby.maxPlayers) {
      console.log('[JOIN LOBBY ERROR] Lobby is full');
      return res.status(400).json({ error: 'Lobby is full' });
    }

    // Spieler zur Lobby hinzufügen
    const playerId = uuidv4();
    lobby.players.push({ playerId, playerName, socketId }); // Socket-ID hinzufügen
    console.log('[BEFORE SAVE] Players:', lobby.players);

    // Lobby speichern
    await lobby.save();
    console.log('[AFTER SAVE] Players:', lobby.players);

    // Spieler erfolgreich hinzugefügt, Spieler-ID zurückgeben
    res.status(200).json({ lobbyId: lobby.lobbyId, playerId });

    // Socket.IO: Update alle Clients in der Lobby über die neuen Spieler-Daten
    const io = req.app.get('socketio');
    io.in(lobby.lobbyId).emit('updatePlayers', lobby.players);
  } catch (err) {
    console.error('[JOIN LOBBY ERROR]', err);
    res.status(500).json({ error: 'Error joining lobby' });
  }
};

// Leave Lobby
exports.leaveLobby = async (req, res) => {
  try {
    const { lobbyId, playerId } = req.body;

    if (!lobbyId || !playerId) {
      console.error('[LEAVE LOBBY ERROR] Missing lobbyId or playerId');
      return res.status(400).json({ error: 'Lobby ID or Player ID is missing' });
    }

    const lobby = await Lobby.findOne({ lobbyId, isActive: true });
    if (!lobby) {
      console.error('[LEAVE LOBBY ERROR] Lobby not found or inactive');
      return res.status(404).json({ error: 'Lobby not found or inactive' });
    }

    // Spieler entfernen
    const playerIndex = lobby.players.findIndex((player) => player.playerId === playerId);
    if (playerIndex === -1) {
      console.error('[LEAVE LOBBY ERROR] Player not found in lobby');
      return res.status(404).json({ error: 'Player not found in lobby' });
    }

    // Entfernen des Spielers
    lobby.players.splice(playerIndex, 1);
    console.log(`[PLAYER LEAVE] - Player ${playerId} left Lobby ${lobby.lobbyName}`);

    // Lobby speichern und auf inaktiv setzen, wenn keine Spieler mehr vorhanden sind
    if (lobby.players.length === 0) {
      lobby.isActive = false;
      console.log(`[LOBBY CLOSED] - Lobby ${lobby.lobbyName} set to inactive`);
    }

    await lobby.save();

    // Sende ein Update an alle Clients in der Lobby, bevor die Lobby geschlossen wird
    const io = req.app.get('socketio');
    io.in(lobbyId).emit('updatePlayers', lobby.players);

    // Erfolgreiche Antwort an den Client
    res.status(200).json({ message: 'Player left successfully' });

    // Wenn die Lobby inaktiv ist, Clients informieren
    if (!lobby.isActive) {
      io.in(lobbyId).emit('lobbyClosed');
    }

  } catch (err) {
    console.error('[LEAVE LOBBY ERROR]', err);
    res.status(500).json({ error: 'Error leaving lobby' });
  }
};
// Close Lobby
exports.closeLobby = async (req, res) => {
  try {
    const { lobbyId } = req.body;
    const lobby = await Lobby.findOne({ lobbyId });
    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }
    lobby.isActive = false;
    await lobby.save();
    console.log(`[LOBBY CLOSED] - Lobby ${lobby.lobbyName} closed by Host`);
    res.status(200).json({ message: 'Lobby closed successfully' });
  } catch (err) {
    console.error('[CLOSE LOBBY ERROR]', err);
    res.status(500).json({ error: 'Error closing lobby' });
  }
};

// In lobbyController.js
exports.getLobbyDetails = async (req, res) => {
  try {
    const { lobbyId } = req.params;
    const lobby = await Lobby.findOne({ lobbyId });
    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }
    res.status(200).json({
      joinCode: lobby.joinCode,
      players: lobby.players,
    });
  } catch (err) {
    console.error('[GET LOBBY DETAILS ERROR]', err);
    res.status(500).json({ error: 'Error fetching lobby details' });
  }
};
