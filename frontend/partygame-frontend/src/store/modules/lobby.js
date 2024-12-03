import { io } from 'socket.io-client';
import API from '@/api';

const state = {
    lobby: null,
    socket: null,
};

const mutations = {
    SET_LOBBY(state, lobby) {
        console.log('[VUEX MUTATION] SET_LOBBY:', lobby);
        state.lobby = lobby;
        localStorage.setItem('lobby', JSON.stringify(lobby));
    },
    SET_SOCKET(state, socket) {
        state.socket = socket;
    },
    REMOVE_LOBBY(state) {
        console.log('[VUEX MUTATION] REMOVE_LOBBY');
        state.lobby = null;
        state.socket = null;
        localStorage.removeItem('lobby');
    },
};

const actions = {
    initializeStore({ commit }) {
        console.log('[ACTION] initializeStore: Überprüfe gespeicherte Lobby im LocalStorage.');
        const storedLobby = localStorage.getItem('lobby');
        if (storedLobby) {
            const lobby = JSON.parse(storedLobby);
            console.log('[ACTION] Lobby gefunden im LocalStorage:', lobby);
            commit('SET_LOBBY', lobby);

            const socket = io('http://localhost:5000', { transports: ['websocket'] });

            socket.on('lobby-updated', (updatedLobby) => {
                console.log('[SOCKET] lobby-updated Event empfangen:', updatedLobby);
                commit('SET_LOBBY', updatedLobby);
            });

            socket.on('lobby-closed', () => {
                console.warn('[SOCKET] Lobby wurde geschlossen.');
                commit('REMOVE_LOBBY');
                alert('Die Lobby wurde geschlossen.');
            });

            socket.on('removed-from-lobby', () => {
                console.warn('[SOCKET] Du wurdest aus der Lobby entfernt.');
                commit('REMOVE_LOBBY');
                alert('Du wurdest aus der Lobby entfernt.');
            });

            commit('SET_SOCKET', socket);
        } else {
            console.log('[ACTION] Keine gespeicherte Lobby im LocalStorage gefunden.');
            commit('REMOVE_LOBBY');
        }
    },

    async createLobby({ commit, state }, { host }) {
        console.log('[ACTION] Erstelle Lobby mit Host:', host);
        try {
            const { data } = await API.post('/lobby/create', { host });
            console.log('[ACTION] Lobby erfolgreich erstellt:', data);
            commit('SET_LOBBY', data);

            // Warten, bis der Socket verfügbar ist, bevor wir ihn verwenden
            if (state.socket) {
                console.log('[SOCKET] Host tritt Lobby bei, ShortCode:', data.shortCode);
                state.socket.emit('join-lobby', {
                    shortCode: data.shortCode,
                    userId: host,
                    name: host
                });
            } else {
                console.error('Socket ist nicht verfügbar, kann nicht beitreten.');
            }
        } catch (error) {
            console.error('Fehler beim Erstellen der Lobby:', error);
            throw error;
        }
    },

    async joinLobby({ commit, state }, { shortCode, name }) {
        console.log('[ACTION] Spieler tritt Lobby bei. ShortCode:', shortCode, 'Name:', name);
        try {
            const { data } = await API.post('/lobby/join', { shortCode, userId: name, name });
            console.log('[ACTION] Spieler erfolgreich in Lobby:', data);
            commit('SET_LOBBY', data);

            // Warten, bis der Socket verfügbar ist, bevor wir ihn verwenden
            if (state.socket) {
                console.log('[SOCKET] Spieler tritt Lobby bei mit ShortCode:', shortCode);
                state.socket.emit('join-lobby', { shortCode, userId: name, name });
            } else {
                console.error('Socket ist nicht verfügbar, kann nicht beitreten.');
            }
        } catch (error) {
            console.error('Fehler beim Beitreten der Lobby:', error);
            throw error;
        }
    },

    closeLobby({ state }) {
        if (state.socket) {
            console.log('[SOCKET] Lobby wird vom Host geschlossen. ShortCode:', state.lobby.shortCode);
            state.socket.emit('close-lobby', state.lobby.shortCode);
        } else {
            console.error('Socket ist nicht verfügbar, kann die Lobby nicht schließen.');
        }
    },

    removePlayer({ state }, userId) {
        if (state.socket) {
            console.log('[SOCKET] Host entfernt Spieler mit UserID:', userId, 'ShortCode:', state.lobby.shortCode);
            state.socket.emit('remove-player', { shortCode: state.lobby.shortCode, userId });
        } else {
            console.error('Socket ist nicht verfügbar, kann Spieler nicht entfernen.');
        }
    },
};

export default {
    state,
    mutations,
    actions,
};
