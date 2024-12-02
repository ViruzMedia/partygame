// backend/controllers/lobbyController.js
const Session = require('../models/sessionModel');
const Task = require('../models/taskModel');

// Lobby erstellen
const createLobby = async (req, res) => {
  const { host, category = 'Party' } = req.body;  // Kategorie ist optional, Standardwert 'Party'

  try {
    console.log(host)
    // Aufgaben aus der Datenbank für die gewählte Kategorie abrufen
    const tasks = await Task.find({ active: true, category });

    if (tasks.length === 0) {
      return res.status(400).json({ message: 'Keine verfügbaren Aufgaben gefunden.' });
    }

    // Neue Session erstellen
    const newSession = new Session({
      host,
      tasks: tasks.map(task => task._id), // Zuordnen der Aufgaben-IDs zur Session
      category,
      players: [],  // Anfangs noch keine Spieler in der Session
    });

    await newSession.save();
    res.status(201).json({ sessionId: newSession.sessionId });
  } catch (error) {
    console.error("Fehler beim Erstellen der Lobby:", error);
    res.status(500).json({ message: "Fehler beim Erstellen der Lobby", error });
  }
};

const joinLobby = async (req, res) => {
  const { sessionId, userId } = req.body; // Sicherstellen, dass userId in der Anfrage übergeben wird

  try {
    // Finde die Session anhand der Session-ID
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ message: 'Session nicht gefunden' });
    }

    // Füge den Spieler zur Session hinzu
    session.players.push({ userId, points: 0 }); // Setze die userId hier korrekt
    await session.save();

    res.status(200).json({ message: 'Spieler erfolgreich der Lobby beigetreten' });
  } catch (error) {
    console.error("Fehler beim Beitreten der Lobby:", error);
    res.status(500).json({ message: "Fehler beim Beitreten der Lobby", error });
  }
};


// Runde starten
const startRound = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await Session.findOne({ sessionId }).populate('tasks');

    if (!session) {
      return res.status(404).json({ message: 'Session nicht gefunden' });
    }

    // Zufällige Aufgabe auswählen
    const availableTasks = session.tasks.filter((task) => task.active);
    if (availableTasks.length === 0) {
      return res.status(400).json({ message: 'Keine verfügbaren Aufgaben' });
    }

    const task = availableTasks[Math.floor(Math.random() * availableTasks.length)];

    // Zufällige Auswahl der Spieler basierend auf `requiredPlayers`
    const playersForTask = [];
    while (playersForTask.length < task.requiredPlayers) {
      const randomPlayer = session.players[Math.floor(Math.random() * session.players.length)];
      if (!playersForTask.includes(randomPlayer)) {
        playersForTask.push(randomPlayer);
      }
    }

    res.status(200).json({
      message: 'Runde gestartet',
      task: task,
      playersForTask: playersForTask,  // Spieler, die die Aufgabe ausführen müssen
    });

  } catch (error) {
    console.error('Fehler beim Starten der Runde:', error);
    res.status(500).json({ message: 'Fehler beim Starten der Runde', error });
  }
};

module.exports = { createLobby, joinLobby };
