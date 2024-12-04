// Dynamischer Import von Chalk für CommonJS
(async () => {
    const chalk = (await import('chalk')).default;

    require('dotenv').config();
    const express = require('express');
    const http = require('http');
    const mongoose = require('mongoose');
    const helmet = require('helmet');
    const cors = require('cors');
    const { Server } = require('socket.io');
    const { v4: uuidv4 } = require('uuid');

    // Importiere das Lobby-Modell, um den Zugriff auf die Datenbank zu ermöglichen
    const Lobby = require('./models/Lobby');

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    // MongoDB-Verbindung
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log(chalk.green('✅ MongoDB connected')))
        .catch((err) => console.error(chalk.red('❌ MongoDB connection error:', err)));

    // Import Routes
    const lobbyRoutes = require('./routes/lobbyRoutes');

    // Use Routes
    app.use('/api/lobby', lobbyRoutes);

    // HTTP Server Setup
    const server = http.createServer(app);

    // Socket.IO Setup
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    // Setze Socket.IO-Instanz auf die Express-App
    app.set('socketio', io);

    io.on('connection', (socket) => {
        console.log(chalk.cyan(`[${new Date().toISOString()}] 🔌 [SOCKET CONNECTED] ID: ${socket.id}`));

        socket.on('joinLobby', async ({ lobbyId, playerName }) => {
            try {
                const lobby = await Lobby.findOne({ lobbyId, isActive: true });
                if (!lobby) {
                    console.log(chalk.yellow(`[${new Date().toISOString()}] ⚠️ [SOCKET JOIN LOBBY ERROR] Lobby not found or inactive`));
                    return;
                }

                // Spieler zur Lobby hinzufügen oder vorhandenen Spieler updaten
                let player = lobby.players.find(player => player.playerName === playerName);

                if (player) {
                    // Wenn Spieler bereits existiert, Socket-ID aktualisieren
                    player.socketId = socket.id;
                    console.log(chalk.blue(`[${new Date().toISOString()}] 🔄 [SOCKET PLAYER UPDATE] Updated Socket ID for player: ${playerName}`));
                } else {
                    // Neuen Spieler hinzufügen
                    const playerId = uuidv4();
                    player = { playerId, playerName, socketId: socket.id };
                    lobby.players.push(player);
                    console.log(chalk.blue(`[${new Date().toISOString()}] ➕ [SOCKET PLAYER JOIN] New player added: ${playerName}`));
                }

                await lobby.save();
                console.log(chalk.green(`[${new Date().toISOString()}] ✅ [SOCKET PLAYER JOIN] - ${playerName} joined Lobby ${lobby.lobbyName}`));
                io.in(lobby.lobbyId).emit('updatePlayers', lobby.players);

                // Spieler dem Raum hinzufügen, damit Nachrichten an den Raum gesendet werden können
                socket.join(lobbyId);
            } catch (err) {
                console.error(chalk.red(`[${new Date().toISOString()}] ❌ [SOCKET JOIN LOBBY ERROR]`, err));
            }
        });

        socket.on('leaveLobby', async ({ lobbyId, playerId }) => {
            try {
                console.log(chalk.yellow(`[${new Date().toISOString()}] ⬅️ [SOCKET LEAVE LOBBY] Event triggered`, { lobbyId, playerId }));

                if (!playerId) {
                    console.error(chalk.red(`[${new Date().toISOString()}] ❌ [SOCKET LEAVE LOBBY ERROR] Missing playerId`));
                    return;
                }

                const lobby = await Lobby.findOne({ lobbyId, isActive: true });
                if (!lobby) {
                    console.error(chalk.red(`[${new Date().toISOString()}] ❌ [SOCKET LEAVE LOBBY ERROR] Lobby not found or inactive`));
                    return;
                }

                const playerIndex = lobby.players.findIndex(player => player.playerId === playerId);
                if (playerIndex === -1) {
                    console.error(chalk.red(`[${new Date().toISOString()}] ❌ [SOCKET LEAVE LOBBY ERROR] Player not found in lobby`));
                    return;
                }

                // Spieler aus der Lobby entfernen
                lobby.players.splice(playerIndex, 1);
                await lobby.save();
                console.log(chalk.yellow(`[${new Date().toISOString()}] ➖ [PLAYER LEAVE] Player ${playerId} left Lobby ${lobby.lobbyName}`));

                // Automatische Aktualisierung der Lobby für alle verbundenen Spieler
                io.in(lobbyId).emit('updatePlayers', lobby.players);

                // Wenn keine Spieler mehr in der Lobby sind, Lobby auf inaktiv setzen
                if (lobby.players.length === 0) {
                    lobby.isActive = false;
                    await lobby.save();
                    console.log(chalk.red(`[${new Date().toISOString()}] 🚪 [LOBBY CLOSED] Lobby ${lobby.lobbyName} set to inactive`));
                    io.in(lobbyId).emit('lobbyClosed');
                }
            } catch (err) {
                console.error(chalk.red(`[${new Date().toISOString()}] ❌ [SOCKET LEAVE LOBBY ERROR]`, err));
            }
        });

        socket.on('disconnect', async () => {
            try {
                console.log(chalk.cyan(`[${new Date().toISOString()}] 🔌 [SOCKET DISCONNECT] ID: ${socket.id}`));

                // Spieler anhand der Socket-ID finden
                const lobby = await Lobby.findOne({ 'players.socketId': socket.id });
                if (lobby) {
                    // Entferne den Spieler aus der Lobby
                    lobby.players = lobby.players.filter(player => player.socketId !== socket.id);
                    await lobby.save();

                    console.log(chalk.magenta(`[${new Date().toISOString()}] 🔄 [SOCKET PLAYER DISCONNECT] Player removed from lobby due to disconnection`));
                    io.in(lobby.lobbyId).emit('updatePlayers', lobby.players);

                    // Lobby inaktiv setzen, wenn keine Spieler mehr vorhanden sind
                    if (lobby.players.length === 0) {
                        lobby.isActive = false;
                        await lobby.save();
                        console.log(chalk.red(`[${new Date().toISOString()}] 🚪 [LOBBY CLOSED] Lobby ${lobby.lobbyName} set to inactive`));
                        io.in(lobby.lobbyId).emit('lobbyClosed');
                    }
                } else {
                    console.log(chalk.red(`[${new Date().toISOString()}] ❌ [SOCKET DISCONNECT ERROR] Lobby not found for socket ID: ${socket.id}`));
                }
            } catch (err) {
                console.error(chalk.red(`[${new Date().toISOString()}] ❌ [SOCKET DISCONNECT ERROR]`, err));
            }
        });
    });

    // Server Start
    server.listen(PORT, () => {
        console.log(chalk.green(`✅ Server running on port ${PORT}`));
    });
})();
