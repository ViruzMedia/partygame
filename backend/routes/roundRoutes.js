// backend/routes/roundRoutes.js
const express = require('express');
const router = express.Router();
const { startNewRound } = require('../controllers/roundController');

router.post('/start', startNewRound);

module.exports = router;
