// frontend/src/components/TaskList.vue
<template>
  <b-card bg-variant="dark" text-variant="light" class="mb-3">
    <b-card-header>Aktuelle Aufgabe</b-card-header>
    <b-list-group>
      <b-list-group-item
        v-for="task in tasks"
        :key="task._id"
        class="d-flex justify-content-between align-items-center"
      >
        <div>
          <h5>{{ task.title }}</h5>
          <p>{{ task.description }}</p>
        </div>
        <b-button variant="success" @click="submitTaskResult(task._id)">Erledigt!</b-button>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TaskList",
  computed: {
    ...mapState("tasks", {
      tasks: (state) => state.tasks,
    }),
  },
  methods: {
    async submitTaskResult(taskId) {
      try {
        const response = await this.$store.dispatch("tasks/submitTask", { taskId });
        console.log("Task erfolgreich abgeschlossen:", response);
      } catch (error) {
        console.error("Fehler beim Abschließen der Aufgabe:", error);
      }
    },
  },
};
</script>
