import { createRouter, createWebHistory } from 'vue-router';
import CreateLobby from '../components/CreateLobby.vue';
import JoinLobby from '../components/JoinLobby.vue';
import LobbyDashboard from '../components/LobbyDashboard.vue';

const routes = [
  { path: '/', name: 'Home', component: CreateLobby },
  { path: '/join', name: 'JoinLobby', component: JoinLobby },
  { path: '/lobby/:lobbyId', name: 'LobbyDashboard', component: LobbyDashboard },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
