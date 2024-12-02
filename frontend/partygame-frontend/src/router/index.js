import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';

// Routen definieren
const routes = [
  { path: '/', name: 'Home', component: Home },
];

// Router erstellen
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
