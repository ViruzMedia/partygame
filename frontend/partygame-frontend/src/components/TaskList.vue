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
import { mapState } from "vuex";

export default {
  name: "TaskList",
  computed: {
    ...mapState('tasks', {
      tasks: (state) => state.tasks,
    }),
  },
  methods: {
    async submitTaskResult(taskId) {
      try {
        const response = await this.$store.dispatch('tasks/submitTask', { taskId });
        console.log('Task erfolgreich abgeschlossen:', response);
      } catch (error) {
        console.error('Fehler beim Abschließen der Aufgabe:', error);
      }
    },
  },
};
</script>
