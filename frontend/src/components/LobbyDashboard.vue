<template>
    <div class="container mt-5">
        <b-card title="Lobby Dashboard">
            <p><strong>Lobby ID:</strong> {{ lobbyId }}</p>
            <p><strong>Join Code:</strong> {{ joinCode }}</p>
            <p><strong>Dein Spielername:</strong> {{ localPlayerName }}</p>
            <b-list-group>
                <b-list-group-item v-for="player in players" :key="player.playerId">
                    <span :class="{ 'font-weight-bold': player.playerId === localPlayerId }">{{ player.playerName
                        }}</span>
                </b-list-group-item>
            </b-list-group>
            <b-button variant="danger" class="mt-3" @click="leaveLobby">Lobby verlassen</b-button>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';

export default {
    data() {
        return {
            joinCode: '',
            players: [],
            localPlayerId: sessionStorage.getItem('playerId'),
            localPlayerName: sessionStorage.getItem('playerName'),
            socket: null,
        };
    },
    computed: {
        lobbyId() {
            return this.$route.params.lobbyId;
        },
    },
    async created() {
        // Sicherstellen, dass playerId und playerName im SessionStorage vorhanden sind
        if (!this.localPlayerId || !this.localPlayerName) {
            console.error('[LOBBY DASHBOARD ERROR] Missing playerId or playerName, cannot join lobby');
            this.$router.push('/'); // Zurück zur Startseite, wenn Daten fehlen
            return;
        }

        try {
            this.socket = io('http://localhost:5000');

            // Dem Lobby-Raum beitreten
            this.socket.emit('joinLobby', {
                lobbyId: this.lobbyId,
                playerName: this.localPlayerName,
            });

            // Lobby-Daten abrufen
            const response = await axios.get(`http://localhost:5000/api/lobby/${this.lobbyId}`);
            this.joinCode = response.data.joinCode;
            this.players = response.data.players;

            // Socket.IO-Event für Spieler-Updates empfangen
            this.socket.on('updatePlayers', (players) => {
                console.log('[SOCKET UPDATE PLAYERS] Received players update', players);
                this.players = players;
            });

            this.socket.on('lobbyClosed', () => {
                console.log('[SOCKET LOBBY CLOSED]');
                this.$router.push('/');
            });
        } catch (error) {
            console.error('Error fetching lobby details:', error);
        }
    },
    methods: {
        async leaveLobby() {
            try {
                const playerId = sessionStorage.getItem('playerId');
                const lobbyId = this.$route.params.lobbyId;

                if (!playerId || !lobbyId) {
                    console.error('[LOBBY DASHBOARD ERROR] Missing playerId or lobbyId, cannot leave lobby');
                    return;
                }

                await axios.post('http://localhost:5000/api/lobby/leave', {
                    lobbyId: lobbyId,
                    playerId: playerId,
                });

                console.log(`[LEAVE LOBBY] Player ${playerId} requested to leave lobby ${lobbyId}`);
                this.$router.push('/');
            } catch (error) {
                console.error('Error leaving lobby:', error);
            }
        },
    },
    beforeUnmount() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 600px;
}

.font-weight-bold {
    font-weight: bold;
}
</style>