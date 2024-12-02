import api from '../../api';
const state = {
    tasks: [],
    category: 'Party', // Standardkategorie
};

const mutations = {
    SET_TASKS(state, tasks) {
        state.tasks = tasks;
    },
    SET_CATEGORY(state, category) {
        state.category = category;  // Korrektes Setzen der Kategorie
    },
};

const actions = {
    async fetchTasks({ commit, state }) {
        console.log('Aktuelle Kategorie im Store:', state.category); // Logging im Store
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
