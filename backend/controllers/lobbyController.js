const { v4: uuidv4 } = require('uuid');
const Session = require('../models/sessionModel');

// Kurzcode generieren
const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // 6-stelliger Code
};

// Lobby erstellen
const createLobby = async (req, res) => {
  const shortCode = generateShortCode();
  const session = new Session({
    host: req.body.host,
    sessionId: uuidv4(),
    shortCode,
    category: req.body.category || 'Party',
    tasks: [],
    players: [{ userId: req.body.host, name: req.body.host, points: 0 }], // Host tritt bei
  });

  await session.save();

  res.status(201).json({
    sessionId: session.sessionId,
    shortCode: session.shortCode,
    players: session.players,
    host: req.body.host,
  });
};

const joinLobby = async (req, res) => {
    const { shortCode, userId, name } = req.body;

    try {
        const session = await Session.findOne({ shortCode }).populate('tasks');
        if (!session) {
            return res.status(404).json({ message: 'Lobby nicht gefunden.' });
        }

        // Spieler hinzufügen, wenn er noch nicht existiert
        if (!session.players.some(player => player.userId === userId)) {
            session.players.push({ userId, name, points: 0 });
            await session.save();
        }

        res.status(200).json({
            sessionId: session.sessionId,
            shortCode: session.shortCode, // Kurzcode immer mitgeben
            players: session.players,
            host: session.host,
        });
    } catch (error) {
        console.error('Fehler beim Beitreten der Lobby:', error);
        res.status(500).json({ message: 'Fehler beim Beitreten der Lobby.', error });
    }
};


module.exports = {
  createLobby,
  joinLobby,
};
