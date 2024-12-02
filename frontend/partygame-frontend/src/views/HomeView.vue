<template>
  <div>
    <h1>Willkommen zum Partyspiel!</h1>
    <button @click="createLobby">Erstelle eine neue Lobby</button>

    <!-- Debug-Ausgabe -->
    <p>Raw Tasks: {{ getTasks }}</p>
    <p>Tasks Länge: {{ getTasks ? getTasks.length : 'Keine Daten' }}</p>

    <!-- TaskList wird basierend auf der Bedingung angezeigt -->
    <task-list v-if="showTaskList"></task-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TaskList from "../components/TaskList.vue";
import api from "../api";

export default {
  name: "HomeView",
  components: {
    TaskList,
  },
  computed: {
    ...mapGetters(["getTasks"]), // Verwende den Getter, um die Daten zu erhalten
    showTaskList() {
      return this.getTasks && this.getTasks.length > 0; // Bedingung reaktiv berechnen
    },
  },
  methods: {
    async createLobby() {
      console.log("Lobby erstellen...");
      try {
        const response = await api.post("/api/lobby/create", { hostId: "Host123" });
        const sessionId = response.data.sessionId;
        console.log("Erstellte Session-ID:", sessionId);
        this.$store.dispatch("setSessionId", sessionId); // Speichern der Session-ID im Vuex-Store

        // Aufgaben nach Setzen der Session-ID abrufen
        this.$store.dispatch("fetchTasks");
        console.log("Aufgaben abgerufen");
      } catch (error) {
        console.error("Fehler beim Erstellen der Lobby:", error);
      }
    },
  },
  mounted() {
    console.log("HomeView wurde gemountet");
    console.log("Aktuelle Tasks im Store:", this.tasks); // Log zur Überprüfung der tasks im Store
  },
};
</script>
