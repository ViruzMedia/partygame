<template>
  <div>
    <h1>Willkommen zum Partyspiel!</h1>
    <button @click="createLobby">Erstelle eine neue Lobby</button>
    <task-list v-if="showTaskList"></task-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TaskList from "../components/TaskList.vue";

export default {
  name: "HomeView",
  components: {
    TaskList,
  },
  computed: {
    ...mapGetters('tasks', ['getTasks']), // Zugriff auf Aufgaben
    showTaskList() {
      return this.getTasks && this.getTasks.length > 0;
    },
  },
  methods: {
    async createLobby() {
      try {
        const response = await this.$store.dispatch('lobby/createLobby', { hostId: "Host123" });
        const sessionId = response.data.sessionId;
        await this.$store.dispatch('tasks/setSessionId', sessionId);
        await this.$store.dispatch('tasks/fetchTasks');
        console.log("Lobby erstellt und Aufgaben abgerufen.");
      } catch (error) {
        console.error("Fehler beim Erstellen der Lobby:", error);
      }
    },
  },
};
</script>
