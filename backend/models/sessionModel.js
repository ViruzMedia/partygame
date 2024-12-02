const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, default: uuidv4, unique: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
