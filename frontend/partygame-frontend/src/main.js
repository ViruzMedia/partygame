import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { createI18n } from 'vue-i18n';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

const messages = {
    en: {
        welcome: 'Welcome to the Party Game!',
    },
    de: {
        welcome: 'Willkommen beim Partyspiel!',
    },
};

const i18n = createI18n({
    locale: 'en', // Default-Sprache
    messages,
});

const app = createApp(App);
app.use(store).use(router).use(i18n).mount('#app');
