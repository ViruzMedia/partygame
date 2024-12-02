<template>
  <div>
    <button @click="createLobby">Erstelle Lobby</button>
    <button @click="joinLobby">Tritt Lobby bei</button>
    <button @click="startRound">Starte Runde</button>

    <div v-if="currentTask">
      <h3>{{ currentTask.title }}</h3>
      <p>{{ currentTask.description }}</p>
      <button @click="finishTask">Aufgabe abgeschlossen</button>
    </div>
  </div>
</template>

<script>
import api from '../api'; // Axios API-Instanz importieren

export default {
  data() {
    return {
      sessionId: '',
      currentTask: null,
      userId: 'player1',
    };
  },
  methods: {
    async createLobby() {
      try {
        const response = await api.post('/api/lobby/create', { host: 'HostName' });
        this.sessionId = response.data.sessionId; // Verwenden der Axios Antwort
      } catch (error) {
        console.error('Fehler beim Erstellen der Lobby:', error);
      }
    },
    async joinLobby() {
      try {
        const response = await api.post('/api/lobby/join', {
          sessionId: this.sessionId,
          userId: this.userId,  // userId in der Anfrage übergeben
        });
        console.log('Spieler beigetreten:', response.data);
      } catch (error) {
        console.error('Fehler beim Beitreten der Lobby:', error);
      }
    },
    async startRound() {
      try {
        const response = await api.post('/api/lobby/start-round', {
          sessionId: this.sessionId,
        });
        this.currentTask = response.data.task; // Zeigt die Aufgabe an
        this.playersForTask = response.data.playersForTask; // Zuordnen der Spieler für die Aufgabe
      } catch (error) {
        console.error('Fehler beim Starten der Runde:', error);
      }
    },
    async finishTask() {
      // Weiterführende Logik zur Bestätigung der Aufgabe (hier kann eine API zur Bewertung hinzugefügt werden)
      console.log('Aufgabe abgeschlossen');
    }
  }
};
</script>
