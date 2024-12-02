import api from '../../api';
const state = {
    sessionId: null,
    category: 'Party',
    tasks: [],  // Aufgaben als Array im Store
};

const mutations = {
    SET_SESSION_ID(state, sessionId) {
        state.sessionId = sessionId;
    },
    SET_TASKS(state, tasks) {
        console.log('SET_TASKS Mutation aufgerufen, Aufgaben:', tasks);
        state.tasks.splice(0, state.tasks.length, ...tasks); // Aktualisiert das Array reaktiv
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
                console.log('Antwort von der API:', response);  // Log zur Überprüfung der gesamten API-Antwort
                commit('SET_TASKS', response.data);  // Aufgaben im Store speichern
                console.log('Aufgaben im Store gespeichert:', response.data);  // Log zur Überprüfung, was im Store gespeichert wird
            } catch (error) {
                console.error('Fehler beim Laden der Aufgaben:', error);
            }
        } else {
            console.error('Fehler: Keine Session-ID oder Kategorie gesetzt');
        }
    },
};

const getters = {
    getSessionId: (state) => state.sessionId,
    getCategory: (state) => state.category,
    getTasks: (state) => state.tasks,  // Getter für Aufgaben
};

export default {
    state,
    mutations,
    actions,
    getters,
};
