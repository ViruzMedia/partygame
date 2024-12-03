const Session = require('../models/sessionModel');

// Funktion zum Erstellen einer neuen Lobby
exports.createLobby = async (req, res) => {
    try {
        const { host } = req.body;
        const shortCode = generateShortCode();
        const sessionId = generateSessionId();

        const newSession = new Session({
            sessionId,
            host,
            shortCode,
            players: [{ userId: host, name: host, points: 0 }],
        });

        await newSession.save();
        res.status(201).json(newSession);  // Erfolgreiche Antwort zurückgeben
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Erstellen der Lobby', error });
    }
};

// Funktion zum Beitreten einer bestehenden Lobby
exports.joinLobby = async (req, res) => {
    try {
        const { shortCode, userId, name } = req.body;
        const session = await Session.findOne({ shortCode });
        if (!session) {
            return res.status(404).json({ message: 'Lobby nicht gefunden' });
        }

        if (!session.players.some(player => player.userId === userId)) {
            session.players.push({ userId, name, points: 0 });
            await session.save();
        }
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Beitreten der Lobby', error });
    }
};

// Funktion zum Schließen einer bestehenden Lobby
exports.closeLobby = async (req, res) => {
    try {
        const { shortCode } = req.body;
        await Session.deleteOne({ shortCode });
        res.status(200).json({ message: 'Lobby geschlossen' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Schließen der Lobby', error });
    }
};

function generateShortCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateSessionId() {
    return Math.random().toString(36).substring(2, 10);
}
