<template>
    <div>
      <h1>Lobby</h1>
      <button @click="createNewLobby">Neue Lobby erstellen</button>
      <input v-model="sessionId" placeholder="Session ID eingeben" />
      <button @click="joinExistingLobby">Lobby beitreten</button>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        sessionId: '',
      };
    },
    methods: {
      ...mapActions(['createLobby', 'joinLobby']),
      async createNewLobby() {
        const hostId = 'ID_DES_HOSTS'; // Ersetze durch die tatsächliche Host-ID
        await this.createLobby(hostId);
        alert(`Lobby erstellt! Deine Session-ID ist: ${this.$store.getters.getSessionId}`);
      },
      async joinExistingLobby() {
        const userId = 'ID_DES_USERS'; // Ersetze durch die tatsächliche User-ID
        await this.joinLobby({ sessionId: this.sessionId, userId });
        alert(`Lobby erfolgreich beigetreten: ${this.sessionId}`);
      },
    },
  };
  </script>
  