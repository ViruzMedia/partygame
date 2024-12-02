<template>
  <div>
    <h1>Willkommen zum Partyspiel!</h1>
    <button @click="createLobby">Erstelle eine neue Lobby</button>

    <!-- TaskList wird nur angezeigt, wenn sessionId und Aufgaben im Store vorhanden sind -->
    <task-list v-if="sessionId && tasks.length > 0"></task-list>
    <!-- Nur anzeigen, wenn Aufgaben im Store vorhanden sind -->

    <!-- Debug-Ausgabe der Tasks und Session-ID -->
    <p v-if="tasks.length > 0">Aktuelle Aufgaben im Store: {{ tasks.length }} Aufgaben</p>
    <p v-if="sessionId">Session-ID im Store: {{ sessionId }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TaskList from '../components/TaskList.vue';
import api from '../api';

export default {
  name: 'HomeView',
  components: {
    TaskList,
  },
  computed: {
    ...mapState(['sessionId', 'tasks']), // Zugriff auf sessionId und tasks direkt aus dem Store
  },
  methods: {
    async createLobby() {
      console.log('Lobby erstellen...');
      try {
        const response = await api.post('/api/lobby/create', { hostId: 'Host123' });
        const sessionId = response.data.sessionId;
        console.log('Erstellte Session-ID:', sessionId);
        this.$store.dispatch('setSessionId', sessionId);  // Speichern der Session-ID im Vuex-Store

        // Aufgaben nach Setzen der Session-ID abrufen
        this.$store.dispatch('fetchTasks');
        console.log('Aufgaben abgerufen');
      } catch (error) {
        console.error('Fehler beim Erstellen der Lobby:', error);
      }
    },
  },
  watch: {
    sessionId(newSessionId) {
      console.log('Neue Session-ID gesetzt:', newSessionId);
      if (newSessionId) {
        this.$store.dispatch('fetchTasks');
        console.log('Aufgaben nach Session-ID geändert abgerufen');
      }
    },
    tasks(newTasks) {
      console.log('Tasks im Watcher geändert:', newTasks);
      if (newTasks.length > 0) {
        this.$forceUpdate(); // Erzwinge ein Neurendering
      }
    },
  },
  mounted() {
    console.log('HomeView wurde gemountet');
    console.log('Aktuelle Tasks im Store:', this.tasks); // Log zur Überprüfung der tasks im Store

    if (this.sessionId && this.tasks.length === 0) {
      console.log('Session-ID gesetzt, aber Aufgaben leer – rufe fetchTasks auf');
      this.$store.dispatch('fetchTasks');
    }
  },
};
</script>
