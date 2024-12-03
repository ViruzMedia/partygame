Hier ist die vollständig strukturierte Softwarebeschreibung für eure README.md, einschließlich aller API-Routen und relevanten Details:

---

# 🎉 Partyspiel - Multiplayer Trink- und Partyspiel 🎉

## 📋 Projektübersicht

**Partyspiel** ist ein plattformübergreifendes Multiplayer-Trink- und Partyspiel, das für 2 bis 20 Spieler konzipiert ist. Es bietet verschiedene Spielmodi, ein dynamisches Punktesystem, Echtzeit-Kommunikation und ein intuitives Admin-Panel zur Verwaltung und Moderation. Das Spiel ist sowohl als Web-App als auch als mobile App verfügbar und legt großen Wert auf Benutzerfreundlichkeit, Sicherheit und eine ansprechende Benutzeroberfläche mit integriertem Darkmode.

---

## 🛠️ Technologie-Stack

- **Frontend:**
  - Vue 3
  - Pinia (State-Management)
  - BootstrapVue (UI-Komponenten, Darkmode)
  - Vue Router (Navigation)
  - I18n (Internationalisierung)

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (über MongoAtlas)
  - Socket.IO (Echtzeit-Kommunikation)
  - JWT & bcrypt (Authentifikation & Sicherheit)
  - Helmet.js (Sicherheitsheader)
  - Rate Limiting

- **Datenbank:**
  - MongoDB (Datenbankmodelle: Lobby, Player, Task)

---

## 👥 Rollen und Berechtigungen

### **In-Game Rollen**

1. **Host:**
   - **Beschreibung:** Der Host ist der Spieler, der die Lobby erstellt hat.
   - **Rechte:**
     - Spieler aus der Lobby entfernen.
     - Lobby schließen (alle Spieler entfernen und Lobby als inaktiv markieren).
   - **Keine Sonderrechte im Spielablauf:** Der Host ist ein normaler Mitspieler ohne administrative Aufgaben außerhalb der Lobby-Verwaltung.

2. **Spieler:**
   - **Beschreibung:** Teilnehmer des Spiels ohne besondere Verwaltungsrechte.
   - **Rechte:**
     - Aufgaben annehmen und erfüllen.
     - Andere Spieler bewerten.

### **Administratoren und Moderatoren**

- **Beschreibung:** Verantwortlich für die Administration der App und das Management über ein spezielles Admin-Panel.
- **Rechte:**
  - Verwaltung und Moderation von Inhalten im Admin-Panel.
  - Zugriff auf spezielle Verwaltungsfunktionen, die nicht im Spielablauf verfügbar sind.

---

## 🔌 REST-API Endpunkte

### **1. Lobby-Management**

1. **Lobby erstellen**
   - **Endpoint:** `POST /lobby/create`
   - **Funktion:** Erstellt eine neue Lobby und weist dem Host eine eindeutige ID zu.
   - **Eingabe:**
     ```json
     {
       "hostName": "string",
       "lobbyName": "string",
       "maxPlayers": "number",
       "category": "string"
     }
     ```
   - **Antwort:**
     ```json
     {
       "lobbyId": "string",
       "hostId": "string",
       "joinCode": "string"
     }
     ```

2. **Spieler beitreten**
   - **Endpoint:** `POST /lobby/join`
   - **Funktion:** Fügt einen Spieler mithilfe des Lobby-Codes hinzu.
   - **Eingabe:**
     ```json
     {
       "joinCode": "string",
       "playerName": "string"
     }
     ```
   - **Antwort:**
     ```json
     {
       "lobbyId": "string",
       "playerId": "string",
       "players": ["player1", "player2"]
     }
     ```

3. **Spieler entfernen (Host-Recht)**
   - **Endpoint:** `POST /lobby/kick`
   - **Funktion:** Entfernt einen Spieler aus der Lobby.
   - **Eingabe:**
     ```json
     {
       "lobbyId": "string",
       "playerId": "string"
     }
     ```
   - **Antwort:**
     ```json
     {
       "message": "Player removed successfully"
     }
     ```

4. **Lobby verlassen**
   - **Endpoint:** `POST /lobby/leave`
   - **Funktion:** Ein Spieler verlässt die Lobby.
   - **Eingabe:**
     ```json
     {
       "lobbyId": "string",
       "playerId": "string"
     }
     ```
   - **Antwort:**
     ```json
     {
       "message": "Player left successfully"
     }
     ```

5. **Lobby schließen (Host-Recht)**
   - **Endpoint:** `POST /lobby/close`
   - **Funktion:** Der Host schließt die Lobby, entfernt alle Spieler und markiert die Lobby als inaktiv.
   - **Eingabe:**
     ```json
     {
       "lobbyId": "string",
       "hostId": "string"
     }
     ```
   - **Antwort:**
     ```json
     {
       "message": "Lobby closed successfully"
     }
     ```

### **2. Aufgabenmanagement**

1. **Aufgaben abrufen**
   - **Endpoint:** `GET /tasks`
   - **Funktion:** Liefert Aufgaben basierend auf der Kategorie und Spieleranzahl.
   - **Query Parameter:** `category`, `requiredPlayers`
   - **Antwort:**
     ```json
     [
       {
         "taskId": "string",
         "description": "string",
         "requiredPlayers": "number",
         "category": "string"
       }
     ]
     ```

2. **Aufgabe abschließen**
   - **Endpoint:** `POST /tasks/complete`
   - **Funktion:** Markiert eine Aufgabe als abgeschlossen oder nicht.
   - **Eingabe:**
     ```json
     {
       "taskId": "string",
       "lobbyId": "string",
       "playerId": "string",
       "success": "boolean"
     }
     ```
   - **Antwort:**
     ```json
     {
       "points": "number",
       "newRank": "number"
     }
     ```

### **3. Benutzerrollen (Admin-Panel)**

1. **Host und Adminrechte überprüfen**
   - **Endpoint:** `GET /auth/roles`
   - **Funktion:** Überprüft die Rollen eines Nutzers.
   - **Query Parameter:** `userId`
   - **Antwort:**
     ```json
     {
       "isAdmin": true,
       "isHost": false
     }
     ```

2. **Moderator hinzufügen/entfernen**
   - **Endpoint:** `POST /auth/moderator`
   - **Funktion:** Fügt einen Moderator hinzu oder entfernt ihn.
   - **Eingabe:**
     ```json
     {
       "userId": "string",
       "action": "add" | "remove"
     }
     ```
   - **Antwort:**
     ```json
     {
       "message": "Moderator added successfully" | "Moderator removed successfully"
     }
     ```

---

## ⚡ Socket.IO Integration

### **1. Events für Lobby-Management**

1. **joinLobby**
   - **Beschreibung:** Spieler tritt einer Lobby bei.
   - **Payload:**
     ```json
     {
       "lobbyId": "string",
       "playerName": "string"
     }
     ```
   - **Broadcast:** An alle Spieler in der Lobby, aktualisiert die Teilnehmerliste.

2. **leaveLobby**
   - **Beschreibung:** Spieler verlässt die Lobby.
   - **Payload:**
     ```json
     {
       "lobbyId": "string",
       "playerId": "string"
     }
     ```
   - **Broadcast:** An alle Spieler in der Lobby, aktualisiert die Teilnehmerliste.

3. **kickPlayer**
   - **Beschreibung:** Host entfernt einen Spieler aus der Lobby.
   - **Payload:**
     ```json
     {
       "lobbyId": "string",
       "playerId": "string"
     }
     ```
   - **Broadcast:** An alle Spieler in der Lobby, Spieler wird aus der Liste entfernt.

4. **closeLobby**
   - **Beschreibung:** Host schließt die Lobby.
   - **Payload:**
     ```json
     {
       "lobbyId": "string",
       "hostId": "string"
     }
     ```
   - **Broadcast:** An alle Spieler in der Lobby, alle Spieler werden entfernt und die Lobby wird als inaktiv markiert.

### **2. Events für Aufgaben-Management**

1. **taskStart**
   - **Beschreibung:** Aufgabe wird gestartet.
   - **Payload:**
     ```json
     {
       "taskId": "string",
       "playerIds": ["string"],
       "description": "string"
     }
     ```
   - **Broadcast:** Nur an die betroffenen Spieler.

2. **taskComplete**
   - **Beschreibung:** Aufgabe abgeschlossen.
   - **Payload:**
     ```json
     {
       "taskId": "string",
       "success": "boolean",
       "points": "number"
     }
     ```
   - **Broadcast:** An alle Spieler in der Lobby.

### **3. Rundensynchronisation**

1. **startRound**
   - **Beschreibung:** Neue Runde wird gestartet.
   - **Payload:**
     ```json
     {
       "roundNumber": "number",
       "activePlayers": ["string"]
     }
     ```
   - **Broadcast:** An alle Spieler in der Lobby.

### **4. Echtzeit-Updates**

1. **playerUpdate**
   - **Beschreibung:** Aktualisierung der Spielerstatistiken.
   - **Payload:**
     ```json
     {
       "playerId": "string",
       "points": "number",
       "rank": "number"
     }
     ```
   - **Broadcast:** Nur an den betroffenen Spieler.

### **5. Synchronisation und Sicherheit**

- **Middleware zur Validierung:**
  ```javascript
  io.use(async (socket, next) => {
    const lobby = await Lobby.findById(socket.handshake.query.lobbyId);
    if (!lobby || !lobby.isActive) {
      return next(new Error("Invalid or inactive lobby ID"));
    }
    next();
  });
  ```

- **Broadcast-Strategien:**
  - **An spezifische Spieler:** Für private Aufgaben oder Feedback.
  - **An die Lobby:** Für allgemeine Spielupdates.
  - **An alle:** Für globale Ankündigungen oder Statusupdates.

---

## 🗄️ Datenbankmanagement

### **1. Aufräumen inaktiver Lobbys**

- **Automatisierte Bereinigung:**
  - **Trigger:** Wenn alle Spieler die Lobby verlassen oder der Host die Lobby schließt.
  - **Aktionen:**
    - Alle Spieler aus der Lobby entfernen.
    - Lobby in der Datenbank als inaktiv (`isActive: false`) markieren.

- **Beispiel-Implementierung:**
  ```javascript
  // Funktion zum Schließen der Lobby
  async function closeLobby(lobbyId, hostId) {
    const lobby = await Lobby.findById(lobbyId);
    if (lobby.hostId === hostId) {
      lobby.players = [];
      lobby.isActive = false;
      await lobby.save();
      // Emit Socket.IO Event
      io.to(lobbyId).emit('closeLobby', { lobbyId });
      io.in(lobbyId).socketsLeave(lobbyId);
    } else {
      throw new Error("Only the host can close the lobby.");
    }
  }

  // Middleware zur Überprüfung und Bereinigung
  io.on('disconnect', async (socket) => {
    const { lobbyId, playerId } = socket.handshake.query;
    const lobby = await Lobby.findById(lobbyId);
    if (lobby) {
      lobby.players = lobby.players.filter(p => p !== playerId);
      if (lobby.players.length === 0 || lobby.hostId === playerId) {
        lobby.isActive = false;
        await lobby.save();
        io.to(lobbyId).emit('closeLobby', { lobbyId });
        io.in(lobbyId).socketsLeave(lobbyId);
      } else {
        await lobby.save();
        io.to(lobbyId).emit('updatePlayers', { players: lobby.players });
      }
    }
  });
  ```

### **2. Datenbankstruktur**

#### **Lobby Modell:**
```javascript
const LobbySchema = new mongoose.Schema({
  lobbyId: { type: String, required: true, unique: true },
  hostId: { type: String, required: true },
  lobbyName: { type: String, required: true },
  joinCode: { type: String, required: true, unique: true },
  maxPlayers: { type: Number, required: true },
  category: { type: String, required: true },
  players: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

#### **Player Modell:**
```javascript
const PlayerSchema = new mongoose.Schema({
  playerId: { type: String, required: true, unique: true },
  playerName: { type: String, required: true },
  points: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  lobbyId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

#### **Task Modell:**
```javascript
const TaskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  requiredPlayers: { type: Number, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

---

## 🔒 Sicherheitsmaßnahmen

- **Authentifikation:**
  - **JWT:** Für die Authentifikation von Hosts und Admins.
  - **bcrypt:** Zum sicheren Hashen von Passwörtern.
  - **Stay Logged In:** JWTs werden regelmäßig überprüft, um sicherzustellen, dass Änderungen an Berechtigungen sofort wirksam werden.

- **CORS:** Konfiguriert, um nur autorisierte Domains zuzulassen.

- **Eingabevalidierung:** Sowohl client- als auch serverseitig, um sicherzustellen, dass alle Daten korrekt und sicher sind.

- **Sicherheitsheader:** Mit Helmet.js implementiert.

- **Ratenbegrenzung:** Für API-Endpunkte, um Missbrauch zu verhindern.

---

## 📂 Projektstruktur

### **Frontend:**
```
/frontend
├── /src
│   ├── /components
│   ├── /views
│   ├── /store
│   ├── /assets
│   ├── App.vue
│   ├── main.js
│   └── router.js
├── package.json
└── README.md
```

### **Backend:**
```
/backend
├── /controllers
├── /models
├── /routes
├── /middlewares
├── /sockets
├── server.js
├── package.json
└── README.md
```

### **Datenbank:**
```
/backend/models
├── Lobby.js
├── Player.js
└── Task.js
```

---

## 📝 Zusammenfassung

Diese Struktur stellt sicher, dass das Partyspiel robust, sicher und effizient funktioniert. Die klare Trennung der Rollen und die regelmäßige Bereinigung der Datenbank sorgen für eine reibungslose Benutzererfahrung und eine wartbare Codebasis.

---

## 🚀 Nächste Schritte

1. **Implementierung der REST-API Endpunkte:**
   - Starte mit dem Lobby-Management und setze die Endpunkte gemäß der obigen Spezifikation um.

2. **Integration von Socket.IO:**
   - Implementiere die definierten Events und sorge für eine nahtlose Echtzeit-Kommunikation.

3. **Datenbankaufbau:**
   - Erstelle die notwendigen Modelle und sorge für die regelmäßige Bereinigung inaktiver Lobbys.

4. **Sicherheitsmaßnahmen implementieren:**
   - Setze Authentifikation, CORS, Eingabevalidierung und andere Sicherheitsfeatures um.

5. **Frontend-Entwicklung:**
   - Entwickle die Benutzeroberfläche mit Vue 3, BootstrapVue und integriertem Darkmode.
   - Implementiere Vue Router für die Navigation und Pinia mit lokaler Speicherung für das State-Management.

6. **Testing und Validierung:**
   - Führe Unit- und Integrationstests durch, um sicherzustellen, dass alle Komponenten wie erwartet funktionieren.

7. **Admin-Panel entwickeln:**
   - Erstelle ein spezielles Admin-Panel für Administratoren und Moderatoren zur Verwaltung der App.

8. **Launch vorbereiten:**
   - Führe Beta-Tests mit ausgewählten Benutzern durch, sammle Feedback und optimiere das Spiel.
   - Bereite das Deployment vor und richte Monitoring-Tools ein.

---

## 📣 Kontakt

Für Fragen, Feedback oder Unterstützung kontaktiere bitte:

- **Email:** support@partyspiel.com
- **GitHub:** [github.com/dein-repo](https://github.com/dein-repo)

---

Viel Erfolg bei der Entwicklung eures Partyspiels! 🎉 Wenn du weitere Anpassungen oder Ergänzungen benötigst, stehe ich jederzeit zur Verfügung.