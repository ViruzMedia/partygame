// Import notwendiger Module
const express = require('express');
const http = require('http'); // Für Socket.IO
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Logging-Tool
const { Server } = require('socket.io'); // Socket.IO
const taskRoutes = require('./routes/taskRoutes');
const lobbyRoutes = require('./routes/lobbyRoutes');
const roundRoutes = require('./routes/roundRoutes');

// .env-Konfiguration laden
dotenv.config();

const app = express();
const server = http.createServer(app); // HTTP-Server für Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

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
app.use('/tasks', taskRoutes);
app.use('/lobby', lobbyRoutes);
app.use('/round', roundRoutes);

// Beispiel-Route
app.get('/', (req, res) => {
  res.send('🚀 API läuft...');
});

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path);
  }
});
// Temporäre Speicherstruktur für aktive Lobbys
const activeLobbies = {};

// Socket.IO-Logik
io.on('connection', (socket) => {
  console.log('[SOCKET] Benutzer verbunden:', socket.id);


  socket.on('join-lobby', async ({ shortCode, userId, name }) => {
    console.log('[SOCKET] Spieler tritt Lobby bei. ShortCode:', shortCode, 'Name:', name);
    const lobby = activeLobbies[shortCode] || (await updateLobbyFromDB(shortCode));
    if (!lobby) {
      console.error('[SOCKET] Lobby nicht gefunden:', shortCode);
      return socket.emit('error', 'Lobby nicht gefunden.');
    }

    if (!lobby.players.some(player => player.userId === userId)) {
      lobby.players.push({ socketId: socket.id, userId, name });
      activeLobbies[shortCode] = lobby;
      socket.join(shortCode);

      io.to(shortCode).emit('lobby-updated', lobby);
      console.log('[SOCKET] Lobby aktualisiert:', lobby);
    }
  });

  socket.on('remove-player', async ({ shortCode, userId }) => {
    const lobby = activeLobbies[shortCode];
    if (lobby) {
      console.log('[SOCKET] Entferne Spieler:', userId);
      lobby.players = lobby.players.filter(player => player.userId !== userId);
      activeLobbies[shortCode] = lobby;

      io.to(shortCode).emit('lobby-updated', lobby);
      io.to(lobby.players.find(p => p.userId === userId)?.socketId).emit('removed-from-lobby');
    }
  });

  socket.on('close-lobby', async (shortCode) => {
    console.log('[SOCKET] Schließe Lobby:', shortCode);
    if (activeLobbies[shortCode]) {
      io.to(shortCode).emit('lobby-closed');
      delete activeLobbies[shortCode];
      await deleteLobbyFromDB(shortCode);
    }
  });

  socket.on('disconnect', () => {
    console.log('[SOCKET] Benutzer getrennt:', socket.id);
    // Verarbeite Disconnect
  });
});

// Hilfsfunktionen
async function updateLobbyFromDB(shortCode) {
  const session = await mongoose.model('Session').findOne({ shortCode });
  if (!session) return null;
  activeLobbies[shortCode] = { players: session.players, host: session.host };
  return activeLobbies[shortCode];
}

async function deleteLobbyFromDB(shortCode) {
  await mongoose.model('Session').deleteOne({ shortCode });
}

// Server starten
server.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
