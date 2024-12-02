const express = require('express');
const router = express.Router();
const { getTasksByCategory, createTask, submitTaskResult } = require('../controllers/taskController');

// Route: Aufgaben nach Kategorie abrufen
router.get('/:category', getTasksByCategory);

// Route: Neue Aufgabe erstellen
router.post('/', createTask);

// Endpunkt für das Einreichen einer Aufgabe (Punkte vergeben)
router.post('/submit', submitTaskResult);
module.exports = router;
