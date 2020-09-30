<template>
  <div class="applicants-holder">
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div v-if="categoryChange">{{ empty_state }}</div>
    <div class="empty" v-if="filteredData.length === 0">
      <div v-if="loading">{{ empty_state }}</div>
      <span v-else>
        <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/frontend_apps/Empty+user+dashboard.png" class="empty-image" />
        <div class="empty-text">{{ empty_state }}</div>
        <div class="empty-text-count">0 Items</div>
      </span>
    </div>

    <el-table v-else v-loading.body="loading" :data="paginated_partners" @row-click="startVerification" :default-sort="{ prop: 'date_created', order: 'descending' }" width="100">
      <el-table-column type="index" label=" " />
      <el-table-column prop="application_type" label="Application type" />
      <el-table-column prop="id_no" label="ID No " :min-width="50" />
      <el-table-column prop="vendor_type" label="Vendor Type" sortable :formatter="getVendorType" :min-width="50" />
      <el-table-column v-if="current_route !== 'reviewed'" prop="date_created" label="Application Date" :formatter="determineDuration" sortable />
      <el-table-column v-else prop="date_verified" label="Reviewed Date" :formatter="determineDuration" sortable />
      <el-table-column prop="status" label="Status">
        <template slot-scope="scope">
          <span class="applicant-status resolved" v-if="filteredData[scope.$index]['review_status'] === '4'">Resolved</span>
          <div class="applicant-status" :class="getApplicantStatus(filteredData[scope.$index])" v-else>{{ getApplicantStatus(filteredData[scope.$index]) }}</div>
        </template>
      </el-table-column>
      <el-table-column :min-width="15" class-name="icon-holder">
        <template slot-scope="scope">
          <i class="el-icon-arrow-right applicant-arrow" :class="filteredData[scope.$index].id"></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination mt mb" v-if="filteredData.length >= pagination_limit">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="filteredData.length" :page-size="pagination_limit" :current-page.sync="pagination_page" @current-change="changePage" :page-sizes="[10, 20, 50, 100]" @size-change="changeSize"></el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

import ListMxn from '../../mixins/list_mixin';
import GeneralMxn from '../../mixins/general_mixin';
import TimezoneMxn from '../../mixins/timezone_mixin';
import errorHandler from '../errorHandler.vue';

export default {
  name: 'ApplicantList',
  components: { errorHandler },
  mixins: [ListMxn, TimezoneMxn, GeneralMxn],
  props: ['category', 'subCategory'],
  data() {
    return {
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
      pagination_limit: 10,
      pagination_page: 1,
      loading: false,
      vendor_types: VENDOR_TYPES,
      errorObj: '',
      date_range: '',
      routeClass: '',
      categoryChange: false,
      applicationType: '',
      search_term: '',
      route: '',
    };
  },
  computed: {
    ...mapGetters({ getDateRange: 'getDateRange', getApplicantionType: 'getApplicantionType', getSearchTerm: 'search_term' }),
    paginated_partners() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      return this.filteredData.slice(from, to);
    },
    current_route() {
      return this.$route.name;
    },
    applicantStatus() {
      const routeDetails = this.routeDetails(this.current_route);
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.routeClass = routeDetails.text;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.route = routeDetails;
      return this.category === 'applicants' || routeDetails.name === 'driver-applications' ? 'pending' : routeDetails.name;
    },
    endPoint() {
     const api = 'rider/admin_partner_api/v5/';
     const endPoint = `list_${this.category}`;
     return this.category === 'vehicles' ? `${api}partner_management/vehicles_list/all_vehicles` : `${api}peleza/applications/${endPoint}`;
    },
    singleView() {
      return this.route.singleView;
    },
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.search_term = '';
      });
    },
    getDateRange(date) {
      this.date_range = date;
      this.changeDateRange();
    },
    async getApplicantionType(type) {
      this.applicationType = type;
      this.changeApplicationType(type);
    },
    async subCategory(name) {
      await this.init();
    },
    async getSearchTerm(term) {
      this.search_term = term;
      this.showSearchedApplicants(term);
    },
  },
  async beforeMount() {
    await this.init();
  },
  methods: {
    async init() {
      this.date_range = this.$store.getters.getDateRange;
      await this.getApplicants();
      this.changeDateRange();
      setInterval(() => {
        this.getApplicantsBackground();
      }, 600000);
    },
    async showSearchedApplicants(searchTerm) {
      const searchedApplicants = this.searchApplicants(searchTerm, this.searched_applicants);
      if (searchTerm !== '') {
        this.filteredData = searchedApplicants;
      } else {
        this.filteredData = this.searched_applicants;
        const data = await this.filterByDate(this.filteredData);
        const filteredApplicants = await this.filterByType(data);

        this.filteredData = filteredApplicants;
        this.empty_state = filteredApplicants.length === 0 ? 'No applications to show on this list.' : '';
      }
    },
    async changeApplicationType(type) {
      this.filterState = false;
      this.filteredData = this.searched_applicants;
      this.pagination_page = 1;

      const filteredApplicants = await this.filterByType(this.filteredData);
      const data = await this.filterByDate(filteredApplicants);

      this.filteredData = data;
      this.empty_state = data.length === 0 ? 'No applications to show on this list.' : '';
      this.filterState = true;
    },
    filterByType(array) {
      const type = this.applicationType;
      const filteredApplicants = array.filter(applicant => (type !== '' && type !== 'all' ? applicant.application_type === type : applicant));
      return filteredApplicants;
    },

    filterByDate(array) {
      let from_date = this.date_range[0];
      let to_date = this.date_range[1];
      from_date = moment(from_date).format('YYYY-MM-DD');
      to_date = moment(to_date).format('YYYY-MM-DD');

      const data = array.filter(applicant => {
        const application_date = moment(applicant.date_created).format('YYYY-MM-DD');
        if (application_date >= from_date && application_date <= to_date) {
          return application_date >= from_date && application_date <= to_date;
        } else {
          this.empty_state = 'No applications to show on this list.';
        }
      });

      return data;
    },
    async changeDateRange() {
      const vm = this;
      this.filterState = false;
      this.filteredData = this.searched_applicants;

      const data = await this.filterByDate(this.filteredData);
      const filteredApplicants = await this.filterByType(data);

      this.filteredData = filteredApplicants;
      this.empty_state = filteredApplicants.length === 0 ? 'No applications to show on this list.' : '';
      this.filterState = true;
    },
    getApplicantsBackground() {
      const vm = this;
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
        .post(`${AUTH_URL}${this.endPoint}/`, payload, { headers: { Authorization: localStorage.token } })
        .then(response => {
          vm.applicants = response.data.applicants;
        })
        .catch(error => {
          this.errorObj = error.response;
        });
    },
    async getApplicants() {
      const vm = this;
      vm.loading = true;
      vm.empty_state = 'Loading...';

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
      await axios
        .post(`${AUTH_URL}${this.endPoint}`, payload, { headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: localStorage.token } })
        .then(response => {
          vm.applicants = this.determineApplicants(this.category, response);
          if (typeof this.subCategory !== 'undefined') {
            const data = this.filterApplicants(this.category, this.subCategory, vm.applicants);
            vm.applicants = data;
          }
          vm.filteredData = vm.applicants;
          vm.empty_state = 'No Data';
          vm.loading = false;
        })
        .catch(error => {
          vm.empty_state = 'No Data';
          vm.loading = false;
          this.errorObj = error.response;
        });
    },
    getApplicantStatus(name) {
      return this.applicantStatus === 'reviewed' ? this.recommendationStatus(name) : this.applicantStatus;
    },
    determineApplicants(category, response) {
      let data = [];
      switch (category) {
        case 'drivers':
          data = response.data.drivers;
          break;
        case 'vehicles':
          data = [];
          break;

        default:
          data = response.data.applicants;
          break;
      }
      return data;
    },
    filterApplicants(category, subCategory, applicants) {
      let data = [];
      switch (category) {
        case 'reviewed':
          // eslint-disable-next-line no-case-declarations
          const recommendationStatus = subCategory === 'recommended' ? '1' : '0';
          data = subCategory !== 'reviewed' ? applicants.filter(applicant => applicant.recommendation_status === recommendationStatus) : applicants;
          break;
        default:
          // eslint-disable-next-line no-self-assign
          data = applicants;
      }
      return data;
    },
    checkTime(date) {
      const currentTime = moment();
      const timeStore = moment(date);

      return currentTime.diff(timeStore, 'h');
    },
    recommendationStatus(row) {
      const status = row.recommendation_status;
      return status === '1' ? 'recommended' : 'not recommended';
    },
    determineDuration(row) {
      const utcDate = this.convertToUTC(row.date_created);
      const localDate = this.convertToLocalTime(utcDate);
      const duration = this.checkTime(localDate);

      const displayDate = moment(localDate).fromNow();
      const formattedDate = duration <= 24 ? moment(localDate).fromNow() : `${moment(localDate).format('ddd, Do MMM YYYY')} at ${moment(localDate).format('h:mm a')}`;

      return formattedDate;
    },
    startVerification(d) {
      const verification = {
        applicant_details: {
          applicant_username: d.name,
          application_type: d.application_type,
          date_created: d.date_created,
          date_verified: d.date_verified,
          partner_id: d.id,
          partner_name: d.name,
          partner_country: d.country,
          partnerPhone: d.phone,
          recommendation_status: d.recommendation_status,
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
          insurance_number: d.insurance_number ? d.insurance_number : '',
          insurance_name: d.insurance_name ? d.insurance_name : '',
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
                inconsistency: this.category === 'inconsistencies',
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
                inconsistency: this.category === 'inconsistencies',
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
                inconsistency: this.category === 'inconsistencies',
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
                inconsistency: this.category === 'inconsistencies',
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
                inconsistency: this.category === 'inconsistencies',
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
                inconsistency: this.category === 'inconsistencies',
              },
          good_conduct: d.good_conduct
            ? JSON.parse(d.good_conduct)
            : {
                reference_number: '',
                date_of_issue: '',
                number_of_offences: '',
                review_status: false,
                inconsistency: this.category === 'inconsistencies',
              },
        },
      };
      this.$store.commit('changeVerification', verification);
      this.$router.push({ name: `${this.singleView}`, params: { id: d.id } });
    },
  },
};
</script>
