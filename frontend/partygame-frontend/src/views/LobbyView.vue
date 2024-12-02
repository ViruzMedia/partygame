<template>
  <div>
    <h1>Lobby</h1>
    <p>Session-ID: {{ sessionId }}</p>
    <button @click="startGame">Spiel starten</button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "LobbyView",
  computed: {
    ...mapState(["sessionId"]), // Zugriff auf die Session-ID
  },
  methods: {
    startGame() {
      alert("Spiel wird gestartet!");
    },
  },
};
</script>

<style scoped>
h1 {
  color: #333;
}
</style>
