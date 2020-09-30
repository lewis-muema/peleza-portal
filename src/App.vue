<template>
  <div id="app" class="app-holder">
    <div class="app-holder">
        <topnav v-if="authenticated && !isSingleView" />
        <mainContent :authenticated="authenticated" :is-single-view="isSingleView" />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-unresolved
import topnav from './components/topnav';
import mainContent from './components/maincontent.vue';

export default {
  name: 'app',
  components: { topnav, mainContent },
  data () {
    return {
      authenticated: false,
    };
  },
  computed: {
    isSingleView() {
     return Object.keys(this.$route.params).length !== 0;
    },

  },
  watch: {
    $route () {
      this.authenticated = localStorage.authenticated ? JSON.parse(localStorage.authenticated) : false; // always check the authentication status on route change
      this.$store.commit('search', ''); // reset search on route change
    },
  },
  beforeMount () {
    this.authenticated = localStorage.authenticated ? JSON.parse(localStorage.authenticated) : false;
  },
  mounted () { },
};
</script>

<style lang="sass">
@import './assets/sass/app.scss'
</style>

<style>
.el-button.el-button--primary {
  background: #1782c5;
  border-color: #1782c5;
}
</style>
