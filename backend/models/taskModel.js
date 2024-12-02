const mongoose = require('mongoose');

// Schema für Aufgaben
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Party', 'Spicy', 'Romantic', 'Friends'], required: true },
    points: { type: Number, default: 10 },
    requiredPlayers: { type: Number, default: 1 }, // Hinzugefügt: benötigte Spieleranzahl
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model('Task', taskSchema);
