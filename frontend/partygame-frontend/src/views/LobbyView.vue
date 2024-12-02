<template>
  <b-container>
    <b-card bg-variant="secondary" text-variant="white" class="mb-3">
      <b-card-header>Lobby-Informationen</b-card-header>
      <b-card-body>
        <p><strong>Session-ID:</strong> {{ sessionId }}</p>
        <b-list-group>
          <b-list-group-item
            v-for="player in players"
            :key="player.userId"
            class="d-flex justify-content-between align-items-center"
          >
            <span>{{ player.userId }}</span>
            <span>{{ player.points }} Punkte</span>
          </b-list-group-item>
        </b-list-group>
      </b-card-body>
    </b-card>
  </b-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "LobbyView",
  computed: {
    ...mapState("lobby", {
      sessionId: (state) => state.sessionId,
      players: (state) => state.players,
    }),
  },
};
</script>
