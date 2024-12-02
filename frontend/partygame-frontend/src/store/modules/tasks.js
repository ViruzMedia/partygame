import api from '../../api';

const state = {
    sessionId: null,
    category: 'Party',
    tasks: [],
};

const mutations = {
    SET_SESSION_ID(state, sessionId) {
        state.sessionId = sessionId;
    },
    SET_TASKS(state, tasks) {
        state.tasks.splice(0, state.tasks.length, ...tasks); // Reaktive Änderung
    },
};

const actions = {
    setSessionId({ commit }, sessionId) {
        commit('SET_SESSION_ID', sessionId);
    },
    async fetchTasks({ commit, state }) {
        if (state.sessionId && state.category) {
            try {
                const response = await api.get(`/api/tasks/${state.category}`);
                commit('SET_TASKS', response.data);
                return response; // Aufgaben-Antwort zurückgeben
            } catch (error) {
                console.error('Fehler beim Laden der Aufgaben:', error);
                throw error; // Fehler weiterreichen
            }
        }
    },
    async submitTask({ state }, { taskId, userId }) {
        try {
            const response = await api.post("/api/tasks/submit", {
                taskId,
                sessionId: state.sessionId,
                userId,
            });
            console.log("Task erfolgreich abgeschlossen:", response.data);
            return response.data;
        } catch (error) {
            console.error("Fehler beim Abschließen der Aufgabe:", error);
            throw error;
        }
    },
};

const getters = {
    getSessionId: (state) => state.sessionId,
    getTasks: (state) => state.tasks,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
