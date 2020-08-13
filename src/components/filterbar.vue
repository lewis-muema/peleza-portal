<template>
      <section class="filter-holder ">
        <h5>{{ routeTitle }}</h5>
        <div class="filter-inputs">
            <div class="nav-search">
                <div class="demo-input-suffix">
                  <el-input class="nav-search-input" placeholder="Search ID / KRA PIN / VENDOR TYPE" v-model="search_term" @input.native="search">
                   <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                </div>
            </div>
             <div class="right-filters stageone__filters">
                <el-select v-model="type" class="applicant-select" clearable placeholder="Select">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                      >
                    </el-option>
                </el-select>
                <div class="block">
                    <el-date-picker
                    v-model="date_range"
                    type="daterange"
                    align="left"
                    range-separator="-"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    placeholder="Pick a range"
                    class="date-editor datepicker"
                    popper-class="date-picker-pop-up"
                    :picker-options="picker_options"
                    @change="changeDateRange"
                    >
                    </el-date-picker>
                 </div>
          </div>
        </div>
      </section>
</template>
<script>
import GeneralMxn from '../mixins/general_mixin';
import ListMxn from '../mixins/list_mixin';
import TimezoneMxn from '../mixins/timezone_mixin';
import errorHandler from './errorHandler.vue';

export default {
    name: 'FilterBar',
  mixins: [ListMxn, TimezoneMxn, GeneralMxn],

    data() {
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth();
        return {
           search_term: '',
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
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 120);
                    picker.$emit('pick', [start, end]);
                    },
                },
                ],
            },

        };
    },
    computed: {
        routeName() {
            return this.$route.name;
        },
    },
      watch: {
        $route() {
        this.$nextTick(() => {
            this.search_term = '';
        });
        },
    },
    methods: {
        search(ev) {
        // prettier-ignore
        this.$store.commit('search', ev.target.value.split(' ').join('').toLowerCase());
        },
        changeDateRange() {
        const vm = this;
        this.filterState = false;
        this.filteredData = this.paginated_applicants;
        this.pagination_page = 1;
        let from_date = this.date_range[0];
        let to_date = this.date_range[1];
        from_date = moment(from_date).format('YYYY-MM-DD');
        to_date = moment(to_date).format('YYYY-MM-DD');

        this.filteredData = this.applicants.filter(applicant => {
            const application_date = moment(applicant.date_created).format('YYYY-MM-DD');
            if (application_date >= from_date && application_date <= to_date) {
            return application_date >= from_date && application_date <= to_date;
            } else {
            vm.empty_state = 'Could not find applications for the dates.';
            }
        });
        this.filterState = true;
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
