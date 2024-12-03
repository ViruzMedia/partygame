<template>
  <div class="lobby">
    <h2>Lobby</h2>
    <p><strong>Kurzcode:</strong> {{ lobby?.shortCode || 'Wird geladen...' }}</p>
    <p><strong>Host:</strong> {{ lobby?.host || 'Unbekannt' }}</p>

    <h3>Spieler:</h3>
    <ul>
      <li v-for="player in players" :key="player.userId">
        {{ player.name }}
        <button v-if="isHost" @click="removePlayer(player.userId)">Entfernen</button>
      </li>
    </ul>

    <button @click="leaveLobby">Lobby verlassen</button>
    <button v-if="isHost" @click="closeLobby">Lobby schließen</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      players: [],
      localSocket: null,
    };
  },
  computed: {
    ...mapGetters(['lobby', 'socket']),
    isHost() {
      return this.lobby?.host === this.$store.state.userId;
    },
  },
  methods: {
    initializeSocket() {
      const socket = this.socket;
      if (!socket) {
        console.error('Socket.IO-Verbindung ist nicht initialisiert.');
        this.$router.push('/'); // Zurück zur Startseite, wenn Socket nicht verfügbar
        return;
      }
      this.localSocket = socket;

      // Echtzeit-Updates für Spieler
      this.localSocket.on('lobby-updated', (updatedPlayers) => {
        console.log('Lobby-Update erhalten:', updatedPlayers);
        this.players = updatedPlayers;
      });

      this.localSocket.on('lobby-closed', () => {
        alert('Die Lobby wurde geschlossen.');
        this.$router.push('/');
      });

      this.localSocket.on('lobby-removed', () => {
        alert('Du wurdest aus der Lobby entfernt.');
        this.$router.push('/');
      });
    },
    leaveLobby() {
      if (this.localSocket) {
        this.localSocket.emit('leave-lobby', this.lobby?.shortCode || '');
      }
      this.$store.dispatch('leaveLobby');
      this.$router.push('/');
    },
  },
  created() {
    this.$store.dispatch('initializeStore'); // Lobby und Socket.IO initialisieren
    if (!this.lobby || !this.socket) {
      console.error('Keine gültige Lobby oder Socket.IO-Verbindung gefunden.');
      this.$router.push('/'); // Zurück zur Startseite
    } else {
      this.initializeSocket();
      this.players = this.lobby.players || [];
    }
  },
  beforeUnmount() {
    if (this.localSocket && this.lobby?.shortCode) {
      this.localSocket.emit('leave-lobby', this.lobby.shortCode);
    }
    if (this.localSocket) {
      this.localSocket.disconnect();
    }
  },
};
</script>

