<template>
  <div class="home">
    <h1>Partyspiel Lobby</h1>

    <div>
      <h2>Lobby erstellen</h2>
      <input type="text" v-model="hostName" placeholder="Dein Name" />
      <button @click="createLobby">Lobby erstellen</button>
    </div>

    <div>
      <h2>Lobby beitreten</h2>
      <input type="text" v-model="joinCode" placeholder="Kurzcode" />
      <input type="text" v-model="playerName" placeholder="Dein Name" />
      <button @click="joinLobby">Beitreten</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hostName: '',
      joinCode: '',
      playerName: '',
    };
  },
  methods: {
    async createLobby() {
      if (!this.hostName) {
        alert('Bitte gib deinen Namen ein!');
        return;
      }
      try {
        await this.$store.dispatch('createLobby', { host: this.hostName });
        this.$router.push('/lobby');
      } catch (error) {
        console.error('Fehler beim Erstellen der Lobby:', error);
        alert('Lobby konnte nicht erstellt werden.');
      }
    },
    async joinLobby() {
      if (!this.joinCode || !this.playerName) {
        alert('Bitte gib Kurzcode und deinen Namen ein!');
        return;
      }
      try {
        await this.$store.dispatch('joinLobby', { shortCode: this.joinCode, name: this.playerName });
        this.$router.push('/lobby');
      } catch (error) {
        console.error('Fehler beim Beitreten der Lobby:', error);
        alert('Lobby konnte nicht beigetreten werden.');
      }
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
</style>
