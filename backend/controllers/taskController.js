const Task = require('../models/taskModel');
const Session = require('../models/sessionModel');

// Funktion: Aufgaben nach Kategorie abrufen
const getTasksByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const tasks = await Task.find({ category, active: true });
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Keine Aufgaben in dieser Kategorie gefunden' });
        }
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Fehler beim Abrufen der Aufgaben:', error);
        res.status(500).json({ message: 'Fehler beim Abrufen der Aufgaben', error });
    }
};

// Funktion: Neue Aufgabe erstellen
const createTask = async (req, res) => {
    const { title, description, category, points } = req.body;
    try {
        const newTask = new Task({ title, description, category, points });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Fehler beim Erstellen der Aufgabe:', error);
        res.status(500).json({ message: 'Fehler beim Erstellen der Aufgabe', error });
    }
};

// Funktion: Task-Ergebnis einreichen
const submitTaskResult = async (req, res) => {
    const { sessionId, taskId, userId } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ message: 'UserId ist erforderlich' });
        }

        const session = await Session.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ message: 'Session nicht gefunden' });
        }

        let player = session.players.find((player) => player.userId === userId);
        if (!player) {
            // Spieler hinzufügen, falls nicht vorhanden
            player = { userId, points: 0 };
            session.players.push(player);
        }

        // Punkte hinzufügen
        player.points += 10; // Beispiel: 10 Punkte
        await session.save();

        res.status(200).json({ message: 'Task erfolgreich abgeschlossen', points: player.points });
    } catch (error) {
        console.error('Fehler beim Abschließen der Aufgabe:', error);
        res.status(500).json({ message: 'Fehler beim Abschließen der Aufgabe', error });
    }
};

module.exports = { getTasksByCategory, createTask, submitTaskResult };
