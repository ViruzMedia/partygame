// Import notwendiger Module
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Logging-Tool
const taskRoutes = require('./routes/taskRoutes');
const lobbyRoutes = require('./routes/lobbyRoutes');
const roundRoutes = require('./routes/roundRoutes')

// .env-Konfiguration laden
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev')); // Praktisches Logging-Format für die Entwicklung
app.use(cors()); // Cross-Origin-Anfragen erlauben
app.use(express.json()); // JSON-Payloads parsen

// MongoDB-Verbindung herstellen
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB verbunden!'))
  .catch((err) => console.error('❌ Fehler bei der MongoDB-Verbindung:', err));

// Routen einbinden
app.use('/api/tasks', taskRoutes);
app.use('/api/lobby', lobbyRoutes);
app.use('/api/round', roundRoutes);

// Beispiel-Route
app.get('/', (req, res) => {
  res.send('🚀 API läuft...');
});

// Server starten
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
