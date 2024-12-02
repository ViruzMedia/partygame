const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Titel der Aufgabe
    description: { type: String, required: true }, // Beschreibung der Aufgabe
    category: {
        type: String,
        enum: ['Party', 'Spicy', 'Romantic', 'Friends'], // Kategorien der Aufgaben
        required: true,
    },
    points: { type: Number, default: 10 }, // Punkte für die Erfüllung
    active: { type: Boolean, default: true }, // Aufgabe aktiv oder deaktiviert
    createdAt: { type: Date, default: Date.now }, // Erstellungsdatum
});

module.exports = mongoose.model('Task', taskSchema);
