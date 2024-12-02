<template>
    <div>
      <h1>Aktuelle Aufgaben</h1>
      <div v-if="tasks.length > 0">
        <div v-for="task in tasks" :key="task._id" class="task">
          <h2>{{ task.title }}</h2>
          <p>{{ task.description }}</p>
          <p><strong>Kategorie:</strong> {{ task.category }}</p>
          <p><strong>Punkte:</strong> {{ task.points }}</p>
          <button @click="submitTaskResult(task._id)">Erledigt!</button>
        </div>
      </div>
      <p v-else>Es gibt derzeit keine Aufgaben in dieser Kategorie.</p>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  import api from '../api';
  
  export default {
    name: 'TaskList',
    data() {
      return {
        tasks: [],
      };
    },
    computed: {
      ...mapState(['category']), // Stelle sicher, dass die Kategorie im Vuex-Store definiert ist
    },
    async created() {
      try {
        const response = await api.get(`/api/tasks/${this.category}`); // Jetzt wird die Kategorie korrekt verwendet
        this.tasks = response.data;
      } catch (error) {
        console.error('Fehler beim Laden der Aufgaben:', error);
      }
    },
    methods: {
      async submitTaskResult(taskId) {
        try {
          const response = await api.post('/api/tasks/submit', { taskId });
          console.log('Ergebnis gesendet:', response.data);
          // Optional: Feedback an den Benutzer anzeigen
        } catch (error) {
          console.error('Fehler beim Senden des Ergebnisses:', error);
        }
      },
    },
  };
  </script>
  