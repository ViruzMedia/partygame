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
        res.status(500).json({ message: 'Fehler beim Erstellen der Aufgabe', error });
    }
};
const submitTaskResult = async (req, res) => {
    const { taskId, sessionId, userId } = req.body;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Aufgabe nicht gefunden' });
        }

        const session = await Session.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ message: 'Session nicht gefunden' });
        }

        const player = session.players.find(player => player.userId === userId);
        if (!player) {
            return res.status(404).json({ message: 'Spieler nicht in der Session' });
        }

        player.points += task.points;

        await session.save();
        res.status(200).json({ message: 'Aufgabe abgeschlossen, Punkte vergeben', points: player.points });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Fehler bei der Aufgabenbewertung' });
    }
};
module.exports = { getTasksByCategory, createTask, submitTaskResult };
