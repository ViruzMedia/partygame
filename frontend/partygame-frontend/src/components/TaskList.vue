<template>
    <div>
        <h1>Aktuelle Aufgaben</h1>
        <div v-if="tasks.length > 0">
            <div v-for="task in tasks" :key="task._id" class="task">
                <h2>{{ task.title }}</h2>
                <p>{{ task.description }}</p>
                <p><strong>Kategorie:</strong> {{ task.category }}</p>
                <p><strong>Punkte:</strong> {{ task.points }}</p>
                <button @click="submitTaskResult(task._id)">Erledigt!</button>
            </div>
        </div>
        <p v-else>Es gibt derzeit keine Aufgaben in dieser Kategorie.</p>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '../api';

export default {
    name: 'TaskList',
    data() {
        return {
            tasks: [],
        };
    },
    computed: {
        ...mapState({
            category: (state) => state.tasks.category, // Holen der Kategorie aus dem Vuex-Store
        }),
    },
    async created() {
        console.log('Aktuelle Kategorie in TaskList:', this.category); // Debugging der Kategorie
        if (this.category) {
            try {
                const response = await api.get(`/api/tasks/${this.category}`);
                this.tasks = response.data;
            } catch (error) {
                console.error('Fehler beim Laden der Aufgaben:', error);
            }
        } else {
            console.error('Kategorie ist undefined!');
        }
    },
};
</script>