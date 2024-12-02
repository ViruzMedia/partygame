<template>
  <div>
    <h1>HomeView</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import api from '../api'; // Importiere die Axios-Instanz

export default {
  name: 'HomeView',
  data() {
    return {
      message: 'Loading...', // Standardnachricht bis die API antwortet
    };
  },
  async created() {
    try {
      const response = await api.get('/'); // Testaufruf an die API
      this.message = response.data; // API-Antwort setzen
    } catch (error) {
      console.error('API-Aufruf fehlgeschlagen:', error);
      this.message = 'Fehler beim Laden der Nachricht';
    }
  },
};
</script>
