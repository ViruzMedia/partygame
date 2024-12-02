const express = require('express');
const router = express.Router();
const { getTasksByCategory, createTask } = require('../controllers/taskController');

// Route: Aufgaben nach Kategorie abrufen
router.get('/:category', getTasksByCategory);

// Route: Neue Aufgabe erstellen
router.post('/', createTask);

module.exports = router;
