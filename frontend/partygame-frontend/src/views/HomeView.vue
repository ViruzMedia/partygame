<template>
  <div>
    <h1>Willkommen zum Partyspiel!</h1>
    <task-list></task-list> <!-- Einbindung der TaskList-Komponente -->
  </div>
</template>

<script>
import TaskList from '../components/TaskList.vue';

export default {
  name: 'HomeView',
  components: {
    TaskList,
  },
};
</script>
