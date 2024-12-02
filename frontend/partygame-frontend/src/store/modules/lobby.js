import api from '../../api';

const state = {
    sessionId: null,
    players: [],
};

const mutations = {
    SET_SESSION_ID(state, sessionId) {
        state.sessionId = sessionId;
    },
    SET_PLAYERS(state, players) {
        state.players = players;
    },
};

const actions = {
    async createLobby({ commit }, { hostId }) {
        try {
            const response = await api.post('/api/lobby/create', { hostId });
            commit('SET_SESSION_ID', response.data.sessionId);
            return response; // API-Antwort zurückgeben
        } catch (error) {
            console.error('Fehler beim Erstellen der Lobby:', error);
            throw error; // Fehler weiterreichen
        }
    },
};

const getters = {
    getSessionId: (state) => state.sessionId,
    getPlayers: (state) => state.players,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
