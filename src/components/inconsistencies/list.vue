<template xmlns:router-link="">
  <div class="stageone">
    <div class="stageone__filters">
      <div class="filter_view">Count : {{ searched_applicants.length }}</div>
      <label class="mr">Date Applied</label>
      <el-date-picker v-model="date_range" type="daterange" class="date-editor" align="right" popper-class="date-picker-pop-up" placeholder="Pick a range" :picker-options="picker_options" @change="changeDateRange"></el-date-picker>
    </div>
    <el-table :data="paginated_partners" @row-click="startVerification" v-loading.body="loading" border stripe :default-sort="{ prop: 'date_created', order: 'descending' }">
      <template slot="empty">{{ empty_state }}</template>
      <el-table-column prop="id_no" label="ID NUMBER"></el-table-column>
      <el-table-column prop="kra_pin" label="KRA PIN/TIN"></el-table-column>
      <el-table-column
        prop="date_created"
        label="APPLICATION DATE"
        :formatter="formatTime"
        sortable
      ></el-table-column>
      <el-table-column prop="date_verified" label="DATE VERIFIED" :formatter="formatVerified" sortable></el-table-column>
      <el-table-column prop="application_type" label="APPLICATION TYPE"></el-table-column>
      <el-table-column prop="vendor_type" label="Vendor Type" sortable :formatter="getVendorType"></el-table-column>
      <el-table-column prop="status" label="STATUS">
        <template scope>
          <span>Inconsistent</span>
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
import ListMxn from '../../mixins/list_mixin';
import TimezoneMxn from '../../mixins/timezone_mixin';

export default {
  name: 'inconsistencies_list',
  mixins: [ListMxn, TimezoneMxn],
  data() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    return {
      applicants: [],
      filteredData: [],
      filterState: false,
      filterData: {
        from_date: '',
        to_date: '',
      },
      verifying: false,
      applicant: {},
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
      pagination_limit: 10,
      pagination_page: 1,
      loading: false,
      vendor_types: VENDOR_TYPES,
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
    changeDateRange() {
      const vm = this;
      this.filterState = false;
      this.filteredData = this.searched_applicants;
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
          vm.empty_state = 'Could not find inconsistencies for the dates.';
        }
      });
      this.filterState = true;
    },
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
        .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/applications/list_inconsistencies/`, payload, { headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: localStorage.token } })
        .then(response => {
          vm.applicants = response.data.applicants;
        })
        .catch(error => {
          if (error.response.status === 403) {
            this.$notify.warning({
              title: 'Your session has expired',
              message: 'Kindly log in again',
            });
            localStorage.clear();
            this.$router.replace('/');
          }
          throw new Error('Could not get applicants');
        });
    },
    startVerification(d) {
      const verification = {
        applicant_details: {
          application_type: d.application_type,
          date_created: d.date_created,
          partner_id: d.id,
          partner_name: d.name,
          partner_country: d.country,
          id_no: d.id_no,
          kra_pin: d.kra_pin,
          driver_photo: d.driver_photo ? `${AWS_URL}photo/${d.driver_photo}` : MISSING_PHOTO_URL,
          nok_id: d.nok_id,
          vehicle_reg_no: d.vehicle_reg_no ? d.vehicle_reg_no : '',
          good_conduct: d.good_conduct ? d.good_conduct : '',
          insurance_copy: d.insurance_copy ? d.insurance_copy : '',
          vehicle_photo: d.vehicle_photo ? d.vehicle_photo : '',
          vendor_type: d.vendor_type ? d.vendor_type : '',
          inconsistency_message: d.inconsistency_message ? d.inconsistency_message : '',
          insurance_name: d.insurance_name ? d.insurance_name : '',
          insurance_number: d.insurance_number ? d.insurance_number : '',
          policy_number: d.policy_number ? d.policy_number : '',
          verify_consent: d.verify_consent ? d.verify_consent : '',
        },
        verification_details: {
          identity_check: d.identity_check
            ? JSON.parse(d.identity_check)
            : {
                applicant_name: '',
                dob: '',
                pob: '',
                gender: '',
                review_status: false,
              },
          criminal_records_check: d.criminal_records_check
            ? JSON.parse(d.criminal_records_check)
            : {
                applicant_name: '',
                criminal_history: '',
                authenticity: '',
                id_no: '',
                ref_no: '',
                review_status: d.application_type === 'Owner',
              },
          driving_license_check: d.driving_license_check
            ? JSON.parse(d.driving_license_check)
            : {
                applicant_name: '',
                dl_no: '',
                date_of_issue: '',
                expiry_date: '',
                classes: '',
                id_no: '',
                review_status: d.application_type === 'Owner',
              },
          motor_vehicle_records_check: d.motor_vehicle_records_check
            ? JSON.parse(d.motor_vehicle_records_check)
            : {
                ownership_details: '',
                chasis_no: '',
                make: '',
                body_type: '',
                engine_no: '',
                manufacture_year: '',
                caveats: '',
                review_status: d.application_type === 'Driver',
              },
          car_insurance_validity: d.car_insurance_validity
            ? JSON.parse(d.car_insurance_validity)
            : {
                owner_name: '',
                vehicle_number_plate: '',
                issue_date: '',
                expiry_date: '',
                validity: '',
                policy_number: '',
                review_status: d.application_type === 'Driver',
              },
          kra_pin_verification: d.kra_pin_verification
            ? JSON.parse(d.kra_pin_verification)
            : {
                validity: '',
                name: '',
                pin_number: '',
                tax_obligations: '',
                registration_date: '',
                review_status: false,
              },
        },
      };

      this.$store.commit('changeVerification', verification);
      this.$router.push({ name: 'inconsistency', params: { id: d.id } });
    },
    getApplicants() {
      const vm = this;
      vm.loading = true;
      const payload = {
        limit: 'all',
        stage: -1,
        state: 'all',
        from: this.date_range[0],
        to: this.date_range[1],
        admin: {
          admin_id: JSON.parse(localStorage.user).admin_id,
          name: JSON.parse(localStorage.user).name,
        },
      };
      axios
        .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/applications/list_inconsistencies/`, payload, { headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: localStorage.token } })
        .then(response => {
          vm.applicants = response.data.applicants;
          vm.filteredData = vm.applicants;
          vm.empty_state = 'No Data';
          vm.loading = false;
        })
        .catch(error => {
          vm.empty_state = 'No Data';
          vm.loading = false;
          if (error.response.status === 403) {
            this.$notify.warning({
              title: 'Your session has expired',
              message: 'Kindly log in again',
            });
            localStorage.clear();
            this.$router.replace('/');
          }
          throw new Error('Could not get applicants');
        });
    },
  },
};
</script>
<style>
@import '../../assets/style/list.css';
</style>
