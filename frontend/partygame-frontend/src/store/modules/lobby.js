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
    async createLobby({ commit }, hostId) {
        try {
            const response = await api.post('/api/lobby/create', { hostId });
            commit('SET_SESSION_ID', response.data.sessionId);
        } catch (error) {
            console.error('Fehler beim Erstellen der Lobby:', error);
        }
    },
    async joinLobby({ commit }, { sessionId, userId }) {
        try {
            await api.post('/api/lobby/join', { sessionId, userId });
            commit('SET_SESSION_ID', sessionId);
        } catch (error) {
            console.error('Fehler beim Beitreten der Lobby:', error);
        }
    },
};

const getters = {
    getSessionId: (state) => state.sessionId,
    getPlayers: (state) => state.players,
};

export default {
    state,
    mutations,
    actions,
    getters,
};
