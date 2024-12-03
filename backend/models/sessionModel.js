const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    points: { type: Number, default: 0 },
});

const sessionSchema = new mongoose.Schema({
    host: { type: String, required: true },
    sessionId: { type: String, required: true, unique: true },
    shortCode: { type: String, required: true, unique: true },
    category: { type: String, default: 'Party' }, // Standardkategorie
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    players: [playerSchema],
});

module.exports = mongoose.model('Session', sessionSchema);
