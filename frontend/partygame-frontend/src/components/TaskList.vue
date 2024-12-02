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
      ...mapState({
        category: (state) => state.tasks.category,
        sessionId: (state) => state.sessionId,
        tasks: (state) => state.tasks.tasks,
      }),
    },
    mounted() {
      console.log("TaskList-Komponente wurde gemountet");
      console.log("Aufgaben in TaskList:", this.tasks); // Log zur Überprüfung
      console.log("Proxy-Daten:", this.$store.state.tasks);
    },
  };
  </script>
  