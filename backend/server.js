const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');  // Import von Morgan
const taskRoutes = require('./routes/taskRoutes');
const lobbyRoutes = require('./routes/lobbyRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Morgan als Middleware für Logging einbinden
app.use(morgan('dev')); // 'dev' ist ein praktisches Format für die Konsole

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB-Verbindung
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error(err));

// Routen einbinden
app.use('/api/tasks', taskRoutes);
app.use('/api/lobby', lobbyRoutes);

// Beispiel-Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
