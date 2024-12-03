// backend/routes/roundRoutes.js
const express = require('express');
const { startNewRound } = require('../controllers/roundController');

const router = express.Router();

// Route to start a new round
router.post('/start', startNewRound);

module.exports = router;
