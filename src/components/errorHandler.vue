<template></template>

<script>
import axios from 'axios';

export default {
  props: ['error'],
  data() {
    return {};
  },
  created() {
    if (this.error.status === 403) {
      axios.post(`${AUTH_URL}token`, { access_token: localStorage.token, refresh_token: localStorage.refresh_token }).then(response => {
        if (response.status === 200) {
          localStorage.token = response.data;
          this.$router.go();
        } else {
          this.$router.push({ path: '/' });
        }
      });
    }
  },
};
</script>

<style></style>
