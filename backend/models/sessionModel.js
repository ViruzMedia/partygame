const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    points: { type: Number, default: 0 },
});

const sessionSchema = new mongoose.Schema({
    host: { type: String, required: true },
    sessionId: {
        type: String,
        required: true,  // sessionId muss vorhanden sein
        default: () => generateSessionId()  // Generiere automatisch eine sessionId, falls nicht vorhanden
    },
    shortCode: { type: String, required: true, unique: true },
    category: { type: String, default: 'Party' }, // Standardkategorie
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    players: [playerSchema],
});

// Hilfsfunktion für die Generierung des sessionId
function generateSessionId() {
    return Math.random().toString(36).substring(2, 15);  // Session-ID basierend auf Zufallszahlen
}
module.exports = mongoose.model('Session', sessionSchema);
