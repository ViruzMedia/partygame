import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { createI18n } from 'vue-i18n';
// Bootstrap und BootstrapVue
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import BootstrapVue3 from 'bootstrap-vue-3';

// Lokalisierungsmeldungen
const messages = {
    en: {
        welcome: 'Welcome to the Party Game!',
    },
    de: {
        welcome: 'Willkommen beim Partyspiel!',
    },
};

// Internationalisierung konfigurieren
const i18n = createI18n({
    locale: 'en', // Standardsprache
    messages,
});

// App erstellen und Plugins hinzufügen
const app = createApp(App);
app.use(store).use(router).use(i18n).use(BootstrapVue3).mount('#app');
