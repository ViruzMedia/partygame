<template>
    <div class="container mt-5">
        <b-card title="Create Lobby">
            <b-form @submit.prevent="createLobby">
                <b-form-group label="Lobby Name:" label-for="lobbyName">
                    <b-form-input id="lobbyName" v-model="lobbyName" required></b-form-input>
                </b-form-group>

                <b-form-group label="Player Name:" label-for="playerName">
                    <b-form-input id="playerName" v-model="playerName" required></b-form-input>
                </b-form-group>

                <b-form-group label="Category:" label-for="category">
                    <b-form-select id="category" v-model="category" :options="categories" required></b-form-select>
                </b-form-group>

                <b-form-group label="Maximum Players:" label-for="maxPlayers">
                    <b-form-input id="maxPlayers" type="number" v-model="maxPlayers" required></b-form-input>
                </b-form-group>

                <b-button type="submit" variant="primary">Create Lobby</b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            lobbyName: '',
            playerName: '', // Hinzufügen des Spielernamens für den Host
            maxPlayers: 4, // Standardwert für maximale Spieleranzahl
            category: 'Party', // Kategorie für die Lobby
            categories: ['Party', 'Spicy', 'Romantic', 'Casual'], // Beispielkategorien zur Auswahl
        };
    },
    methods: {
        async createLobby() {
            try {
                const response = await axios.post('http://localhost:5000/api/lobby/create', {
                    hostName: this.playerName,
                    lobbyName: this.lobbyName,
                    maxPlayers: this.maxPlayers,
                    category: this.category,
                });

                // Spielerinformationen im SessionStorage speichern
                sessionStorage.setItem('playerName', this.playerName);
                sessionStorage.setItem('playerId', response.data.playerId); // Die vom Backend erhaltene PlayerID speichern
                sessionStorage.setItem('lobbyId', response.data.lobbyId);
                console.log('[CREATE LOBBY] Stored playerName:', this.playerName);
                console.log('[CREATE LOBBY] Stored playerId:', response.data.playerId);

                // Weiterleitung zur Lobby
                this.$router.push(`/lobby/${response.data.lobbyId}`);
            } catch (error) {
                console.error('Error creating lobby:', error);
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
