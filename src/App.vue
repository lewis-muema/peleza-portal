<template>
  <div id="app">
    <header v-if="authenticated">
      <topnav/>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import topnav from './components/topnav'
export default {
  name: 'app',
  data() {
    return {
      authenticated: false
    }
  },
  beforeMount() {
    this.authenticated = localStorage.authenticated ? JSON.parse(localStorage.authenticated) : false;
  },
  mounted() {
  },
  components: {topnav},
  watch: {
    $route() {
      this.authenticated = localStorage.authenticated ? JSON.parse(localStorage.authenticated) : false; // always check the authentication status on route change
      this.$store.commit('search', ''); // reset search on route change
    }
  }
}
</script>

<style lang="sass">
@import './assets/sass/app.scss';

</style>

<style>
  .el-button.el-button--primary {
    background: #1782c5;
    border-color: #1782c5;
  }
</style>
