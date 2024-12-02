import api from '../../api';

const state = {
    tasks: [],
    category: 'Party', // Standardkategorie, die auf 'Party' gesetzt ist
};

const mutations = {
    SET_TASKS(state, tasks) {
        state.tasks = tasks;
    },
    SET_CATEGORY(state, category) {
        state.category = category;
    },
};

const actions = {
    async fetchTasks({ commit, state }) {
        try {
            const response = await api.get(`/api/tasks/${state.category}`);
            commit('SET_TASKS', response.data);
        } catch (error) {
            console.error('Fehler beim Laden der Aufgaben:', error);
        }
    },
    setCategory({ commit }, category) {
        commit('SET_CATEGORY', category);
    },
};

const getters = {
    getTasks: (state) => state.tasks,
    getCategory: (state) => state.category,
};

export default {
    state,
    mutations,
    actions,
    getters,
};
