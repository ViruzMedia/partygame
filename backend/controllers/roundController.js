// backend/controllers/roundController.js
const Session = require('../models/sessionModel');
const Task = require('../models/taskModel');
const { handleError } = require('../utils/helpers'); // Reusable error handler

// Neue Runde starten
const startNewRound = async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ message: 'Session-ID ist erforderlich.' });
    }

    try {
        const session = await Session.findOne({ sessionId }).populate('players').populate('tasks');

        if (!session) {
            return res.status(404).json({ message: 'Session nicht gefunden.' });
        }

        // Aufgabe und Spieler für die neue Runde auswählen
        const availableTasks = session.tasks.filter(task => task.active);
        if (availableTasks.length === 0) {
            return res.status(400).json({ message: 'Keine aktiven Aufgaben verfügbar.' });
        }

        const task = availableTasks[Math.floor(Math.random() * availableTasks.length)];
        const players = session.players.sort(() => Math.random() - 0.5).slice(0, task.requiredPlayers || 1);

        // Aufgabe als aktiv markieren
        session.currentRound = { task, players };
        await session.save();

        res.status(200).json({ message: 'Neue Runde gestartet.', round: session.currentRound });
    } catch (error) {
        handleError(res, error, 'Fehler beim Starten einer neuen Runde');
    }
};

// Aufgabe bewerten
const evaluateTask = async (req, res) => {
    const { sessionId, success } = req.body;

    if (!sessionId || success === undefined) {
        return res.status(400).json({ message: 'Session-ID und Bewertung sind erforderlich.' });
    }

    try {
        const session = await Session.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ message: 'Session nicht gefunden.' });
        }

        if (!session.currentRound || !session.currentRound.task) {
            return res.status(400).json({ message: 'Keine aktive Runde zum Bewerten gefunden.' });
        }

        const task = await Task.findById(session.currentRound.task);
        if (!task) {
            return res.status(404).json({ message: 'Aufgabe nicht gefunden.' });
        }

        // Punktevergabe
        const points = success ? 10 : -5;
        session.players = session.players.map(player => ({
            ...player,
            points: player._id === session.currentRound.players[0]._id ? player.points + points : player.points,
        }));

        // Runde abschließen
        session.currentRound = null;
        await session.save();

        res.status(200).json({ message: 'Aufgabe bewertet.', points });
    } catch (error) {
        handleError(res, error, 'Fehler beim Bewerten der Aufgabe');
    }
};

module.exports = { startNewRound, evaluateTask };
