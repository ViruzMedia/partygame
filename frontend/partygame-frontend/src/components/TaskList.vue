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
    computed: {
        ...mapState({
            category: (state) => state.tasks.category,
            sessionId: (state) => state.sessionId,
            tasks: (state) => state.tasks.tasks,
        }),
    },
    watch: {
        tasks(newTasks) {
            console.log('Neue Aufgaben im Store:', newTasks); // Log zur Überprüfung
        },
    },
    mounted() {
        console.log('TaskList-Komponente wurde gemountet');
        console.log('Aktuelle Aufgaben im Store:', this.tasks); // Log zur Überprüfung
        if (!this.tasks.length) {
            console.warn('Keine Aufgaben gefunden, obwohl sie erwartet wurden.');
        }
        if (this.sessionId && this.tasks.length === 0) {
            console.log('Tasks sind leer, rufe fetchTasks auf');
            this.fetchTasks(); // Aufgaben abrufen
        }
    },
    methods: {
        async fetchTasks() {
            console.log('Rufe Aufgaben ab...');
            if (this.sessionId && this.category) {
                try {
                    const response = await api.get(`/api/tasks/${this.category}`);
                    console.log('Antwort von API in TaskList:', response.data);  // Log zur Überprüfung der API-Antwort
                    this.$store.dispatch('fetchTasks');  // Aufgaben aus dem Store abrufen
                } catch (error) {
                    console.error('Fehler beim Laden der Aufgaben:', error);
                }
            }
        },
        async submitTaskResult(taskId) {
            if (!this.sessionId) {
                console.error('Fehler: Keine Session-ID vorhanden');
                return;
            }
            try {
                const response = await api.post('/api/tasks/submit', {
                    taskId,
                    sessionId: this.sessionId,
                    userId: 'User123',
                });
                console.log('Ergebnis gesendet:', response.data);
                alert(`Du hast ${response.data.points} Punkte verdient!`);
            } catch (error) {
                console.error('Fehler beim Senden des Ergebnisses:', error);
            }
        },
    },
};
</script>