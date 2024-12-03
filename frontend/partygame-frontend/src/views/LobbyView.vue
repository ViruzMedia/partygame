<template>
  <div v-if="lobby">
    <h1>Lobby: {{ lobby.shortCode }}</h1>
    <div v-if="lobby.host === 'b1'">
      <button @click="closeLobby">Lobby schließen</button>
    </div>
    <div>
      <h3>Spieler:</h3>
      <ul>
        <li v-for="player in lobby.players" :key="player.userId">{{ player.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    lobby() {
      return this.$store.state.lobby.lobby;
    }
  },
  methods: {
    closeLobby() {
      this.$store.dispatch('closeLobby');
    }
  },
  created() {
    // Initialisiere die Store-Daten und den Socket
    this.$store.dispatch('initializeStore');
  },
  watch: {
    // Beobachten von lobby, um sofortige Änderungen im Store zu erkennen
    lobby(newLobby) {
      console.log('Lobby-Daten haben sich geändert:', newLobby);
    }
  }
}
</script>
