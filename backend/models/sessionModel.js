const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, default: uuidv4, unique: true },
    host: { type: String, required: true }, // String statt ObjectId
    players: [{ type: String }], // String-Array für Spielerplatzhalter
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
