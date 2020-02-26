/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    current_verification: localStorage.current_verification ? JSON.parse(localStorage.current_verification) : {},
    search_term: '',
  },
  mutations: {
    changeVerification(state, current_verification) {
      Object.assign(state.current_verification, current_verification);
      localStorage.current_verification = JSON.stringify(current_verification);
    },
    resetVerification(state) {
      Object.assign(state.current_verification, {});
      localStorage.current_verification = JSON.stringify({});
    },
    search(state, search_term) {
      state.search_term = search_term;
    },
  },
  getters: {
    current_verification: state => state.current_verification,
    search_term: state => state.search_term,
  },
});

export default store;
