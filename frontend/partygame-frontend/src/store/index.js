import { createStore } from 'vuex';
import lobby from './modules/lobby';
import tasks from './modules/tasks';

export default createStore({
    modules: {
        lobby,
        tasks,
    },
});
