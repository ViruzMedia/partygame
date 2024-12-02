const Session = require('../models/sessionModel');

// Funktion zum Erstellen einer neuen Lobby
const createLobby = async (req, res) => {
  try {
    const newSession = new Session({
      host: "default-host", // Platzhalter-Host (kann später angepasst werden)
    });
    await newSession.save();
    res.status(201).json({ sessionId: newSession.sessionId });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Erstellen der Lobby', error });
  }
};

// Funktion zum Beitreten einer bestehenden Lobby
const joinLobby = async (req, res) => {
  const { sessionId } = req.body;
  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Lobby nicht gefunden' });
    }
    // Temporäre Spieler-ID hinzufügen (ohne userModel)
    session.players.push("player-placeholder");
    await session.save();
    res.status(200).json({ message: 'Erfolgreich beigetreten', session });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Beitreten der Lobby', error });
  }
};

module.exports = { createLobby, joinLobby };
