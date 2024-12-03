// backend/controllers/roundController.js
const Session = require('../models/sessionModel');
const Task = require('../models/taskModel');
const { handleError } = require('../utils/helpers'); // Reusable error handler

// Neue Runde starten
const startNewRound = async (req, res) => {
    const { sessionId } = req.body;

    try {
        const session = await Session.findById(sessionId).populate('tasks players');
        if (!session) {
            return res.status(404).json({ message: 'Session nicht gefunden.' });
        }

        // Zufällige Aufgabe auswählen
        const task = session.tasks.find(task => task.active);
        if (!task) {
            return res.status(400).json({ message: 'Keine Aufgaben verfügbar.' });
        }

        // Spieler zuweisen
        const playersForTask = session.players.sort(() => Math.random() - 0.5).slice(0, task.requiredPlayers);

        session.currentRound = {
            task: task._id,
            players: playersForTask.map(player => player._id),
        };

        await session.save();
        res.status(200).json({ message: 'Neue Runde gestartet.', round: { task, players: playersForTask } });
    } catch (error) {
        console.error('Fehler beim Starten der Runde:', error);
        res.status(500).json({ message: 'Fehler beim Starten der Runde', error });
    }
};


module.exports = { startNewRound };
