import API from '@/api';
import { io } from 'socket.io-client';

const state = {
    lobby: null,
    currentRound: null,
    socket: null, // Socket.IO-Instanz
};

const mutations = {
    SET_LOBBY(state, lobby) {
        state.lobby = lobby;
        localStorage.setItem('lobby', JSON.stringify(lobby));
    },
    SET_SOCKET(state, socket) {
        state.socket = socket;
    },
    REMOVE_LOBBY(state) {
        state.lobby = null;
        state.socket = null;
        localStorage.removeItem('lobby');
    },
};

const actions = {
    initializeStore({ commit }) {
        const storedLobby = localStorage.getItem('lobby');
        if (storedLobby) {
            const lobby = JSON.parse(storedLobby);
            commit('SET_LOBBY', lobby);

            // Socket.IO-Instanz initialisieren
            const socket = io('http://localhost:3000');
            socket.emit('join-lobby', { shortCode: lobby.shortCode, userId: lobby.host });
            commit('SET_SOCKET', socket);
        } else {
            commit('REMOVE_LOBBY');
        }
    },
    async createLobby({ commit }, { host }) {
        try {
            const { data } = await API.post('/lobby/create', { host });
            if (!data.shortCode) {
                throw new Error('Kurzcode konnte nicht generiert werden.');
            }
            commit('SET_LOBBY', data);

            // Socket.IO-Verbindung herstellen
            const socket = io('http://localhost:3000');
            socket.emit('join-lobby', { shortCode: data.shortCode, userId: host, name: host });
            commit('SET_SOCKET', socket);

            return data;
        } catch (error) {
            console.error('Fehler beim Erstellen der Lobby:', error);
            throw error;
        }
    },
    async joinLobby({ commit }, { shortCode, name }) {
        try {
            const { data } = await API.post('/lobby/join', { shortCode, userId: name, name });
            commit('SET_LOBBY', data);

            // Socket.IO-Verbindung herstellen
            const socket = io('http://localhost:3000');
            socket.emit('join-lobby', { shortCode, userId: name, name });
            commit('SET_SOCKET', socket);
        } catch (error) {
            console.error('Fehler beim Beitreten der Lobby:', error);
            throw error;
        }
    },
    leaveLobby({ state, commit }) {
        if (state.socket) {
            state.socket.emit('leave-lobby', state.lobby.shortCode);
            state.socket.disconnect();
        }
        commit('REMOVE_LOBBY');
    },
};

const getters = {
    lobby: (state) => state.lobby,
    socket: (state) => state.socket,
};

export default {
    state,
    mutations,
    actions,
    getters,
};
