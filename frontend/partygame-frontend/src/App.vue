<template>
  <div>
    <b-navbar variant="dark" type="dark" class="mb-4">
      <b-container>
        <b-navbar-brand href="#">PartyGame</b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item href="#" active>Home</b-nav-item>
        </b-navbar-nav>
      </b-container>
    </b-navbar>
    <b-container>
      <router-view />
    </b-container>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
body {
  background-color: #1a1a1a;
  color: #fff;
}
</style>
