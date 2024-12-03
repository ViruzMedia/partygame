import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LobbyView from '@/views/LobbyView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/lobby',
    name: 'Lobby',
    component: LobbyView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
