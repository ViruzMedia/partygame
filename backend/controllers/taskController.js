const Task = require('../models/taskModel');

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

module.exports = { getTasksByCategory, createTask };
