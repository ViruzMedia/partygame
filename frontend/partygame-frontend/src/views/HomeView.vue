<template>
  <div class="home">
    <button @click="createLobby">Erstelle Lobby</button>
    <div v-if="lobby">
      <p><strong>Kurzcode:</strong> {{ lobby.shortCode }}</p>
      <router-link :to="{ name: 'Lobby' }">Zur Lobby</router-link>
    </div>

    <div>
      <h3>Lobby beitreten</h3>
      <input
        v-model="shortCode"
        placeholder="Kurzcode eingeben"
      />
      <input
        v-model="name"
        placeholder="Name eingeben"
      />
      <button @click="joinLobby">Tritt Lobby bei</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lobby: null, // Speichert die Lobby-Daten
      shortCode: '', // Kurzcode für Beitritt
      name: '', // Name des Spielers
    };
  },
  methods: {
    async createLobby() {
      try {
        const response = await this.$store.dispatch('createLobby', { host: 'HostName' });
        this.lobby = response; // Lobby-Daten inkl. Kurzcode speichern
        this.$router.push({ name: 'Lobby' }); // Weiterleitung zur Lobby
      } catch (error) {
        console.error('Fehler beim Erstellen der Lobby:', error);
      }
    },
    async joinLobby() {
      if (!this.shortCode.trim() || !this.name.trim()) {
        console.error('Kurzcode oder Name fehlt!');
        return;
      }
      try {
        const response = await this.$store.dispatch('joinLobby', {
          shortCode: this.shortCode.trim(),
          userId: this.name.trim(), // Spielername als ID nutzen
          name: this.name.trim(),
        });
        this.lobby = response; // Lobby-Daten speichern
        this.$router.push({ name: 'Lobby' }); // Weiterleitung nach erfolgreichem Beitritt
      } catch (error) {
        console.error('Fehler beim Beitreten der Lobby:', error);
      }
    },
  },
};
</script>
