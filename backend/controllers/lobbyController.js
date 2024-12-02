const Session = require('../models/sessionModel');
const User = require('../models/userModel');

// Funktion zum Erstellen einer neuen Lobby
const createLobby = async (req, res) => {
    const { hostId } = req.body;
    try {
        const newSession = new Session({ host: hostId });
        await newSession.save();
        res.status(201).json({ sessionId: newSession.sessionId });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Erstellen der Lobby' });
    }
};

// Funktion zum Beitreten einer bestehenden Lobby
const joinLobby = async (req, res) => {
    const { sessionId, userId } = req.body;
    try {
        const session = await Session.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ message: 'Lobby nicht gefunden' });
        }
        session.players.push(userId);
        await session.save();
        res.status(200).json({ message: 'Erfolgreich beigetreten' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Beitreten der Lobby' });
    }
};

module.exports = { createLobby, joinLobby };
