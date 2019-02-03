<template xmlns:router-link="">
  <div class="stageone">
    <el-table
      :data="paginated_applicants"
      @row-click="startVerification"
      v-loading.body="loading"
      border
      stripe
      :default-sort="{prop: 'date_created', order: 'descending'}"
    >
      <template slot="empty">{{empty_state}}</template>
      <el-table-column prop="id_no" label="ID NUMBER"></el-table-column>
      <el-table-column prop="kra_pin" label="KRA PIN"></el-table-column>
      <el-table-column
        prop="date_created"
        label="APPLICATION DATE"
        :formatter="formatTime"
        sortable
      ></el-table-column>
      <el-table-column prop="status" label="STATUS">
        <template>
          <span>Pending</span>
        </template>
      </el-table-column>
    </el-table>
    <template slot="empty">{{ empty_state }}</template>
    <div class="pagination mt mb" v-if="searched_applicants.length >= pagination_limit">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="searched_applicants.length"
        :page-size="pagination_limit"
        :current-page.sync="pagination_page"
        @current-change="changePage"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="changeSize"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: "renewals_list",
  data() {
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    return {
      applicants: [],
      verifying: false,
      applicant: {},
      empty_state: "Loading...",
      date_range: [new Date(y, m, 1), new Date(y, m + 1, 0)],
      pagination_limit: 40,
      pagination_page: 1,
      loading: false
    };
  },
  beforeMount() {
    this.getApplicants();
    setInterval(() => {
      this.getApplicantsBackground();
    }, 600000);
  },
  methods: {
    getApplicantsBackground() {
      let vm = this;
      // let start = new Date(this.date_range[0]);
      // let start_date = start.getDate();
      // let start_month = start.getMonth() + 1;
      // let start_year = start.getFullYear();
      //
      // let final_start_date = start_year + "-" + start_month + "-" + start_date ;
      //
      // let stop = new Date(this.date_range[1]);
      // let stop_date = stop.getDate();
      // let stop_month = stop.getMonth() + 1;
      // let stop_year = stop.getFullYear();
      //
      // let final_stop_date = stop_year + "-" + stop_month + "-" + stop_date ;
      let final_start_date = null;
      let final_stop_date = null;

      let payload = {
        limit: "all",
        stage: -1,
        state: "all",
        from: final_start_date,
        to: final_stop_date
      };
      axios
        .post(PARTNER_BASE_URL + "admin/partner_list", payload)
        .then(response => {
          vm.applicants = response.data.data.partner_list;
        })
        .catch(error => {
          log(error);
          throw new Error("Could not get applicants");
        });
    },
    getApplicants() {
      let vm = this;
      vm.loading = true;
      vm.empty_state = "Loading...";
      // let final_start_date = null;
      //
      // if(this.date_range[0] !== null ) {
      //   let start = new Date(this.date_range[0]);
      //   let start_date = start.getDate();
      //   let start_month = start.getMonth() + 1;
      //   let start_year = start.getFullYear();
      //
      //   final_start_date = start_year + "-" + start_month + "-" + start_date;
      // }
      //
      // let final_stop_date = null;
      //
      // if(this.date_range[1] !== null) {
      //   let stop = new Date(this.date_range[1]);
      //   let stop_date = stop.getDate();
      //   let stop_month = stop.getMonth() + 1;
      //   let stop_year = stop.getFullYear();
      //   final_stop_date = stop_year + "-" + stop_month + "-" + stop_date;
      // }
      let final_start_date = null;
      let final_stop_date = null;

      let payload = {
        limit: "all",
        stage: -1,
        state: "all",
        from: final_start_date,
        to: final_stop_date
      };

      axios
        .post(PARTNER_BASE_URL + "admin/partner_list", JSON.stringify(payload))
        .then(response => {
          console.log(response);
          vm.applicants = response.data.data.partner_list;
          vm.empty_state = "No Data";
          vm.loading = false;
        })
        .catch(error => {
          vm.empty_state = "No Data";
          vm.loading = false;
          log(error);
          throw new Error("Could not get applicants");
        });
    }
  },
  computed: {}
};
</script>
<style>
@import "../../assets/style/list.css";
</style>
