<template>
  <el-col
    :xs="24"
    :sm="6"
    :md="6"
    :lg="6"
    :xl="1"
  >
    <div class="side-navigation">
      <div class="side-content">
        <el-card
          shadow="never"
          class="images-container text-center"
        >
          <div class="image-holder">
            <el-col
              :md="4"
              :lg="5"
              :xl="1"
            >
              <img
                src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/appicons/SendyAppIcon_512px.png"
                class="image"
              />
            </el-col>
            <el-col
              :md="19"
              :lg="15"
              :xl="1"
              class="logo-text"
            >
              <span class="">Verify Portal</span>
            </el-col>
          </div>
        </el-card>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="TRANSPORTATION " name="logistics" class="nav-tabs">
              <navigation :current-route="current_route" :applicant-count="applicantCount" />
          </el-tab-pane>
          <el-tab-pane label="FREIGHT" name="freight" class="nav-tabs">
              <navigation :current-route="current_route" :applicant-count="applicantCount" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-col>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import TimezoneMxn from '../mixins/timezone_mixin';
import GeneralMxn from '../mixins/general_mixin';

export default {
  name: 'topnav',
   components: {
    navigation: () => import('./shared/navigation'),
  },
  mixins: [TimezoneMxn, GeneralMxn],
  data () {
    return {
      search_term: '',
      applicants: 0,
      hideDrivers: true,
      applicantCount: '',
      activeName: localStorage.getItem('category'),
    };
  },
  computed: {
    ...mapGetters({ getApplicantCount: 'getApplicantCount' }, { getCategory: 'getCategory' }),
    current_route () {
      return this.$route.name;
    },
    user () {
      return JSON.parse(localStorage.user);
    },
    sendy_verifier () {
      if (this.user.external_status === '0') {
        return true;
      }
      return false;
    },
  },
  watch: {
    $route () {
      this.$nextTick(() => {
        this.search_term = '';
        this.applicantCount = '';
      });
    },
    getApplicantCount (count) {
      this.applicantCount = count;
    },
    getCategory(category) {
      this.activeName = category;
    },
  },
  mounted () {
    this.activeName = localStorage.getItem('category');
    this.getInconsisntenciesUpdates();
  },
  methods: {
      ...mapMutations({
      setCategory: 'setCategory',
    }),

    loadApplicant (d) {
      const verification = {
        applicant_details: {
          application_type: d.application_type,
          date_created: d.date_created,
          partner_id: d.id,
          id_no: d.id_no,
          kra_pin: d.kra_pin,
          driver_photo: d.driver_photo ? `${AWS_URL}photo/${d.driver_photo}` : MISSING_PHOTO_URL,
          nok_id: d.nok_id,
          vehicle_reg_no: d.vehicle_reg_no ? d.vehicle_reg_no : '',
          good_conduct: d.good_conduct ? d.good_conduct : '',
          insurance_copy: d.insurance_copy ? d.insurance_copy : '',
          vehicle_photo: d.vehicle_photo ? d.vehicle_photo : '',
          vendor_type: d.vendor_type ? d.vendor_type : '',
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
              inconsistency: false,
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
              inconsistency: false,
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
              inconsistency: false,
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
              inconsistency: false,
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
              inconsistency: false,
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
              inconsistency: false,
            },
        },
      };
      this.$store.commit('changeVerification', verification);
      this.$router.push({ name: 'applicant', params: { id: d.id } });
    },
    search (ev) {
      // prettier-ignore
      this.$store.commit('search', ev.target.value.split(' ').join('').toLowerCase());
    },
    getInconsisntenciesUpdates () {
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
        .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/applications/list_updated_inconsistencies/`, payload, { headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: localStorage.token } })
        .then(response => {
          this.applicants = response.data.applicants;
        })
        .catch(error => {
          log(error);
          throw new Error('Could not get applicants');
        });
    },
     handleClick(tab, event) {
       this.setCategory(tab.name);
       localStorage.setItem('category', tab.name);
       return tab.name === 'logistics' ? this.$router.push({ name: 'applications' }) : this.$router.push({ name: 'transporters' });
      },
  },
};
</script>
<style scoped>
@import '../../static/style/core.css';
.el-submenu__title {
  display: inline-flex !important;
}
.el-tabs__item.is-active {
    color: #1B7FC3;
}
</style>
