const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Erlaube Anfragen von allen Quellen
    methods: ['GET', 'POST'],
  },
});

// Speichert aktive Lobbys und Verbindungen
const lobbies = {};
io.on('connection', (socket) => {
    console.log('Ein Benutzer hat sich verbunden:', socket.id);
  
    // Spieler tritt einer Lobby bei
    socket.on('join-lobby', ({ shortCode, userId, name }) => {
      if (!lobbies[shortCode]) {
        lobbies[shortCode] = [];
      }
      lobbies[shortCode].push({ socketId: socket.id, userId, name });
  
      socket.join(shortCode);
      io.to(shortCode).emit('lobby-updated', lobbies[shortCode]); // Informiere über neuen Spieler
    });
  
    // Spieler verlässt die Lobby
    socket.on('leave-lobby', (shortCode) => {
      if (lobbies[shortCode]) {
        lobbies[shortCode] = lobbies[shortCode].filter((player) => player.socketId !== socket.id);
        io.to(shortCode).emit('lobby-updated', lobbies[shortCode]); // Informiere über aktualisierte Spieler
      }
      socket.leave(shortCode);
    });
  
    // Host entfernt einen Spieler
    socket.on('remove-player', ({ shortCode, userId }) => {
      if (lobbies[shortCode]) {
        const playerToRemove = lobbies[shortCode].find((player) => player.userId === userId);
        if (playerToRemove) {
          io.to(playerToRemove.socketId).emit('lobby-removed'); // Informiere den entfernten Spieler
          lobbies[shortCode] = lobbies[shortCode].filter((player) => player.userId !== userId);
          io.to(shortCode).emit('lobby-updated', lobbies[shortCode]); // Informiere über aktualisierte Spieler
        }
      }
    });
  
    // Host schließt die Lobby
    socket.on('close-lobby', (shortCode) => {
      if (lobbies[shortCode]) {
        io.to(shortCode).emit('lobby-closed'); // Informiere alle Spieler
        delete lobbies[shortCode];
      }
    });
  
    // Spieler verlässt die Lobby beim Schließen des Browsers
    socket.on('disconnect', () => {
      Object.keys(lobbies).forEach((shortCode) => {
        lobbies[shortCode] = lobbies[shortCode].filter((player) => player.socketId !== socket.id);
        io.to(shortCode).emit('lobby-updated', lobbies[shortCode]); // Informiere über aktualisierte Spieler
      });
    });
  });

server.listen(3000, () => {
  console.log('Server läuft auf Port 3000');
});
