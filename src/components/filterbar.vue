<template>
  <section class="filter-holder " :key="filterComponent">
    <h5>{{ pageTitle }}</h5>
    <div class="filter-inputs">
      <div class="nav-search">
        <div class="demo-input-suffix">
          <el-input class="nav-search-input" :placeholder="placeholder" v-model="search_term" @input.native="search" v-if="category === 'logistics'">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <searchComponent v-if="category === 'freight'" :placeholder="placeholder" />

        </div>
      </div>
      <div class="right-filters stageone__filters" >
          <el-button type="primary" class="details-save-button" v-if="category === 'freight' && searched" @click="backToList()">
            <i class="el-icon-arrow-left applicant-arrow"></i>
            Back to list
          </el-button>


        <el-select v-model="type" class="applicant-select" clearable placeholder="Select" v-if="!isPending && category === 'logistics'">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <div class="block" v-if="category === 'logistics'">
          <el-date-picker v-model="date_range" type="daterange" align="left" range-separator="-" start-placeholder="Start date" end-placeholder="End date" placeholder="Pick a range" class="date-editor datepicker" popper-class="date-picker-pop-up" :picker-options="picker_options" @change="updateDate"> </el-date-picker>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import Axios from 'axios';
import VueTypeahead from 'vue-typeahead';
import Vue from 'vue';

import { mapGetters, mapMutations } from 'vuex';

import GeneralMxn from '../mixins/general_mixin';
import ListMxn from '../mixins/list_mixin';
import TimezoneMxn from '../mixins/timezone_mixin';
import errorHandler from './errorHandler.vue';

Vue.prototype.$http = Axios;

export default {
  name: 'FilterBar',
   components: {
    searchComponent: () => import('./searchComponent'),
   },
  mixins: [ListMxn, TimezoneMxn, GeneralMxn],

  data() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    return {
      filterComponent: 0,
      search_term: '',
      category: localStorage.getItem('category'),
      searched: false,
      applicant_type: '',
      type: 'all',
      applicants: [],
      filteredData: [],
      filterState: false,
      filterData: {
        from_date: '',
        to_date: '',
      },
      verifying: false,
      filterState: false,
      applicant: {},
      filterData: {},
      empty_state: 'Loading...',
      date_range: [new Date(y, m, 1), new Date(y, m + 1, 0)],

      picker_options: {
        shortcuts: [
          {
            text: 'This month',
            onClick(picker) {
              picker.$emit('pick', [new Date(y, m, 1), new Date(y, m + 1, 0)]);
            },
          },
          {
            text: 'Last 1 month',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: 'Last 2 months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: 'Last 6 months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({ getCategory: 'getCategory', getSearchedApplicant: 'getSearchedApplicant' }),


    routeName() {
      return this.$route.name;
    },
    pageTitle() {
      const routeDetails = this.routeDetails(this.routeName);
      return routeDetails === null ? 'Applicants' : routeDetails.title;
    },
    isPending() {
      return this.routeIDName === 'driver-applications' || this.routeIDName === 'applications';
    },
    placeholder() {
      const string = this.$route.name === 'transporter' ? 'Enter ID or Vehicle Registration' : 'Enter name or email address';
      return this.category === 'logistics' ? 'Search ID / KRA PIN / VENDOR TYPE' : string;
    },

    route() {
        const routeDetails = this.routeDetails(this.routeName);
        return routeDetails;
    },
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.search_term = '';
      });
      this.forceRerender();
    },
    type() {
      this.$store.commit('setApplicantionType', this.type);
    },
    routeTitle(title) {
      this.$store.commit('setCategory', this.route.category);
      localStorage.setItem('category', this.route.category);
      this.routeTitle = title;
    },
    getCategory(category) {
      this.category = category;
     },
      async getSearchedApplicant(applicant) {
            this.searched = applicant.searched;
      },
  },
 async  mounted() {
    await this.$store.commit('setDateRange', this.date_range);
  },
  methods: {
    search(ev) {
      // prettier-ignore
      this.$store.commit('search', ev.target.value.split(' ').join('').toLowerCase());
    },
    updateDate() {
      this.$store.commit('setDateRange', this.date_range);
    },
    backToList() {
       const searchArray = {
             userType: this.route.user, param: null, id: null, searched: false,
            };
        this.searched = searchArray.searched;
        this.$store.commit('searchedApplicant', searchArray);
    },
    forceRerender() {
      this.filterComponent += 1;
    },
  },
};
</script>
<style>
.demo-input-label {
  display: inline-block;
  width: 130px;
}
</style>
