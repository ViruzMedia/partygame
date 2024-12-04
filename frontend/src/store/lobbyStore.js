import { defineStore } from 'pinia';
import axios from 'axios';

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    lobbyId: '',
    joinCode: '',
    lobbyName: '',
    maxPlayers: 0,
    category: '',
    players: [],
    isHost: false,
  }),
  
  actions: {
    async createLobby(hostName, lobbyName, maxPlayers, category) {
      try {
        const response = await axios.post('http://localhost:5000/api/lobby/create', {
          hostName,
          lobbyName,
          maxPlayers,
          category,
        });
        this.lobbyId = response.data.lobbyId;
        this.joinCode = response.data.joinCode;
        this.lobbyName = lobbyName;
        this.maxPlayers = maxPlayers;
        this.category = category;
        this.isHost = true;
      } catch (error) {
        console.error('Error creating lobby:', error);
      }
    },

    async joinLobby(joinCode, playerName) {
      try {
        const response = await axios.post('http://localhost:5000/api/lobby/join', {
          joinCode,
          playerName,
        });
        this.lobbyId = response.data.lobbyId;
        this.players.push({ playerId: response.data.playerId, playerName });
        this.isHost = false;
      } catch (error) {
        console.error('Error joining lobby:', error);
      }
    },

    async leaveLobby(playerId) {
      try {
        await axios.post('http://localhost:5000/api/lobby/leave', {
          lobbyId: this.lobbyId,
          playerId,
        });
        this.players = this.players.filter((player) => player.playerId !== playerId);
      } catch (error) {
        console.error('Error leaving lobby:', error);
      }
    },

    async closeLobby() {
      try {
        await axios.post('http://localhost:5000/api/lobby/close', {
          lobbyId: this.lobbyId,
        });
        this.resetLobby();
      } catch (error) {
        console.error('Error closing lobby:', error);
      }
    },

    addPlayer(player) {
      if (!this.players.find((p) => p.playerId === player.playerId)) {
        this.players.push(player);
      }
    },

    removePlayer(playerId) {
      this.players = this.players.filter((player) => player.playerId !== playerId);
    },

    resetLobby() {
      this.lobbyId = '';
      this.joinCode = '';
      this.lobbyName = '';
      this.maxPlayers = 0;
      this.category = '';
      this.players = [];
      this.isHost = false;
    },
  },
});
