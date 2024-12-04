<template>
    <div class="container mt-5">
        <b-card title="Join Lobby">
            <b-form @submit.prevent="joinLobby">
                <b-form-group label="Join Code:" label-for="joinCode">
                    <b-form-input id="joinCode" v-model="joinCode" required></b-form-input>
                </b-form-group>

                <b-form-group label="Player Name:" label-for="playerName">
                    <b-form-input id="playerName" v-model="playerName" required></b-form-input>
                </b-form-group>

                <b-button type="submit" variant="primary">Join Lobby</b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            joinCode: '',
            playerName: '',
        };
    },
    methods: {
        async joinLobby() {
            try {
                const response = await axios.post('http://localhost:5000/api/lobby/join', {
                    joinCode: this.joinCode,
                    playerName: this.playerName,
                });

                // Spielername und Lobby-Daten im SessionStorage speichern
                sessionStorage.setItem('playerName', this.playerName);
                sessionStorage.setItem('playerId', response.data.playerId);
                sessionStorage.setItem('lobbyId', response.data.lobbyId);
                console.log('[JOIN LOBBY] Stored playerName:', this.playerName);

                // Weiterleitung zur Lobby
                this.$router.push(`/lobby/${response.data.lobbyId}`);
            } catch (error) {
                console.error('Fehler beim Beitritt zur Lobby:', error.response?.data?.error || error.message);
                this.errorMessage = error.response?.data?.error || 'Fehler beim Beitritt zur Lobby';
            }
        },

    },
};
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>