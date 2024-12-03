const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const taskRoutes = require('./routes/taskRoutes');
const lobbyRoutes = require('./routes/lobbyRoutes');
const roundRoutes = require('./routes/roundRoutes');

// .env-Konfiguration laden
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// MongoDB-Verbindung herstellen
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB verbunden!'))
  .catch((err) => console.error('❌ Fehler bei der MongoDB-Verbindung:', err));

// Routen
app.use('/tasks', taskRoutes);
app.use('/lobby', lobbyRoutes);
app.use('/round', roundRoutes);

// Beispiel-Route
app.get('/', (req, res) => {
  res.send('🚀 API läuft...');
});

// Temporäre Speicherstruktur für aktive Lobbys
const activeLobbies = {};

// Socket.IO-Logik
io.on('connection', (socket) => {
  console.log('Ein Benutzer hat sich verbunden:', socket.id);

  socket.on('join-lobby', async ({ shortCode, userId, name }) => {
    const lobby = activeLobbies[shortCode] || (await updateLobbyFromDB(shortCode));
    if (!lobby) {
      return socket.emit('error', 'Lobby nicht gefunden.');
    }

    if (!lobby.players.some(player => player.userId === userId)) {
      lobby.players.push({ socketId: socket.id, userId, name });
      activeLobbies[shortCode] = lobby;
      socket.join(shortCode);

      io.to(shortCode).emit('lobby-updated', lobby);
    }
  });

  socket.on('remove-player', async ({ shortCode, userId }) => {
    const lobby = activeLobbies[shortCode];
    if (lobby) {
      lobby.players = lobby.players.filter(player => player.userId !== userId);
      activeLobbies[shortCode] = lobby;

      io.to(shortCode).emit('lobby-updated', lobby);
      io.to(lobby.players.find(p => p.userId === userId)?.socketId).emit('removed-from-lobby');
    }
  });

  socket.on('close-lobby', async (shortCode) => {
    if (activeLobbies[shortCode]) {
      io.to(shortCode).emit('lobby-closed');
      delete activeLobbies[shortCode];
      await deleteLobbyFromDB(shortCode);
    }
  });

  socket.on('disconnect', () => {
    Object.keys(activeLobbies).forEach(shortCode => {
      const lobby = activeLobbies[shortCode];
      lobby.players = lobby.players.filter(player => player.socketId !== socket.id);
      activeLobbies[shortCode] = lobby;
      io.to(shortCode).emit('lobby-updated', lobby);
    });
  });
});

// Hilfsfunktionen
async function updateLobbyFromDB(shortCode) {
  const session = await Session.findOne({ shortCode });
  if (!session) return null;
  activeLobbies[shortCode] = { players: session.players, host: session.host };
  return activeLobbies[shortCode];
}

async function deleteLobbyFromDB(shortCode) {
  await Session.deleteOne({ shortCode });
}

// Server starten
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
