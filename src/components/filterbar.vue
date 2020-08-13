<template>
      <el-container class="filter-holder">
        <h5>{{ routeTitle }}</h5>
        <div class="filter-inputs">
            <div class="nav-search">
                <input class="" type="text" placeholder="Search ID / KRA PIN / VENDOR TYPE" v-model="search_term" @input="search" />
            </div>
        </div>
      </el-container>
</template>
<script>
import GeneralMxn from '../mixins/general_mixin';

export default {
    name: 'FilterBar',
    mixins: [GeneralMxn],

    data() {
        return {
           search_term: '',
           applicant_type: '',

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
    },
};
</script>
