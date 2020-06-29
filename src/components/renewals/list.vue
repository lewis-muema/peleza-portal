<template xmlns:router-link="">
  <div class="stageone">
    <errorHandler :error="errorObj" v-if="errorObj" />
    <el-table :data="paginated_partners" @row-click="startVerification" v-loading.body="loading" border stripe :default-sort="{ prop: 'date_created', order: 'descending' }">
      <template slot="empty">{{ empty_state }}</template>
      <el-table-column prop="id_no" label="ID NUMBER"></el-table-column>
      <el-table-column prop="kra_pin" label="KRA PIN/TIN"></el-table-column>
      <el-table-column prop="date_created" label="APPLICATION DATE" :formatter="formatTime" sortable></el-table-column>
      <el-table-column prop="status" label="STATUS">
        <template>
          <span>Pending</span>
        </template>
      </el-table-column>
    </el-table>
    <template slot="empty">{{ empty_state }}</template>
    <div class="pagination mt mb" v-if="searched_applicants.length >= pagination_limit">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="searched_applicants.length" :page-size="pagination_limit" :current-page.sync="pagination_page" @current-change="changePage" :page-sizes="[10, 20, 50, 100]" @size-change="changeSize"></el-pagination>
    </div>
  </div>
</template>
<script>
import errorHandler from '../errorHandler.vue';

export default {
  name: 'renewals_list',
  components: { errorHandler },
  data() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    return {
      applicants: [],
      verifying: false,
      applicant: {},
      empty_state: 'Loading...',
      date_range: [new Date(y, m, 1), new Date(y, m + 1, 0)],
      pagination_limit: 10,
      pagination_page: 1,
      loading: false,
      errorObj: '',
    };
  },
  computed: {
    paginated_partners() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      return this.searched_applicants.slice(from, to);
    },
  },
  beforeMount() {
    this.getApplicants();
    setInterval(() => {
      this.getApplicantsBackground();
    }, 600000);
  },
  methods: {
    getApplicantsBackground() {
      const vm = this;
      const final_start_date = null;
      const final_stop_date = null;

      const payload = {
        limit: 'all',
        stage: -1,
        state: 'all',
        from: final_start_date,
        to: final_stop_date,
        admin: {
          admin_id: JSON.parse(localStorage.user).admin_id,
          name: JSON.parse(localStorage.user).name,
        },
      };
      axios
        .post(`${AUTH_URL}rider/admin_partner_api/v5/admin/partner_list`, payload, { headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: localStorage.token } })
        // .post(`${PARTNER_BASE_URL}admin/partner_list`, payload)
        .then(response => {
          vm.applicants = response.data.applicants;
        })
        .catch(error => {
          this.errorObj = error.response;
        });
    },
    getApplicants() {
      const vm = this;
      vm.loading = true;
      vm.empty_state = 'Loading...';
      const final_start_date = null;
      const final_stop_date = null;

      const payload = {
        limit: 'all',
        stage: -1,
        state: 'all',
        from: final_start_date,
        to: final_stop_date,
        admin: {
          admin_id: JSON.parse(localStorage.user).admin_id,
          name: JSON.parse(localStorage.user).name,
        },
      };

      axios
        .post(`${AUTH_URL}rider/admin_partner_api/v5/admin/partner_list`, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: localStorage.token } })
        // .post(`${PARTNER_BASE_URL}admin/partner_list`, JSON.stringify(payload))
        .then(response => {
          vm.applicants = response.data.applicants;
          vm.empty_state = 'No Data';
          vm.loading = false;
        })
        .catch(error => {
          vm.empty_state = 'No Data';
          vm.loading = false;
          this.errorObj = error.response;
        });
    },
  },
};
</script>
<style>
@import '../../assets/style/list.css';
</style>
