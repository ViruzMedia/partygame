// frontend/src/store/modules/tasks.js
import API from '@/api';

const state = {
    tasks: [],
    currentRound: null,
};

const mutations = {
    SET_TASKS(state, tasks) {
        state.tasks = tasks;
    },
    SET_CURRENT_ROUND(state, round) {
        state.currentRound = round;
    },
    RESET_CURRENT_ROUND(state) {
        state.currentRound = null;
    },
};

const actions = {
    async fetchTasksByCategory({ commit }, category) {
        try {
            const { data } = await API.get(`/task/category/${category}`);
            commit('SET_TASKS', data);
        } catch (error) {
            console.error('Fehler beim Abrufen der Aufgaben:', error);
        }
    },
    // frontend/src/store/modules/tasks.js
    async startNewRound({ commit }, sessionId) {
        try {
            console.log('Runde wird gestartet für Session:', sessionId);
            const { data } = await API.post('/round/start', { sessionId }); // Sicherstellen, dass dies korrekt ist
            commit('SET_CURRENT_ROUND', data.round);
        } catch (error) {
            console.error('Fehler beim Starten einer neuen Runde:', error);
        }
    },


    async evaluateTask({ commit }, { sessionId, success }) {
        try {
            const { data } = await API.post('/round/evaluate', { sessionId, success });
            console.log('Bewertung abgeschlossen:', data);
            commit('RESET_CURRENT_ROUND');
        } catch (error) {
            console.error('Fehler beim Bewerten der Aufgabe:', error);
        }
    },
};

const getters = {
    tasks: state => state.tasks,
    currentRound: state => state.currentRound,
};

export default { state, mutations, actions, getters };
