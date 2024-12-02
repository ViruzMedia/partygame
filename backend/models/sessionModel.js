const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Schema für Spieler in einer Session
const playerSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    points: { type: Number, default: 0 },
});

// Schema für eine Session
const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, default: uuidv4, unique: true }, // Eindeutige Session-ID
    host: { type: String, required: true }, // Host als String (z. B. Benutzer-ID)
    players: { type: [playerSchema], default: [] }, // Array von Spieler-Objekten
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // Referenzierte Aufgaben
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }, // Status der Session
    category: { type: String, enum: ['Party', 'Spicy', 'Romantic', 'Friends'], required: true },  // Kategorie hinzufügen
    createdAt: { type: Date, default: Date.now }, // Erstellungsdatum
});

module.exports = mongoose.model('Session', sessionSchema);
