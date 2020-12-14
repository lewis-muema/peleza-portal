/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    current_verification: localStorage.current_verification ? JSON.parse(localStorage.current_verification) : {},
    search_term: '',
    dateRange: '',
    applicantionType: '',
    applicantCount: '',
    category: localStorage.getItem('category'),
    current_customer_verification: localStorage.current_verification ? JSON.parse(localStorage.current_verification) : {},
    updateStatus: false,

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
    setDateRange(state, dateRange) {
      state.dateRange = dateRange;
    },
    setApplicantionType(state, applicantionType) {
      state.applicantionType = applicantionType;
    },
    setApplicantionCount(state, applicantCount) {
      state.applicantCount = applicantCount;
    },
    setCategory(state, category) {
      state.category = category;
    },
    setUpdateStatus(state, val) {
      state.updateStatus = val;
    },
    setCustomerVerification(state, current_customer_verification) {
      Object.assign(state.current_customer_verification, current_customer_verification);
      localStorage.current_verification = JSON.stringify(current_customer_verification);
    },

  },
  getters: {
    current_verification: state => state.current_verification,
    search_term: state => state.search_term,
    getDateRange: state => state.dateRange,
    getApplicantionType: state => state.applicantionType,
    getApplicantCount: state => state.applicantCount,
    getCategory: state => state.category,
    getCustomerVerification: state => state.current_customer_verification,
    getUpdateStatus: state => state.updateStatus,
  },
});

export default store;
