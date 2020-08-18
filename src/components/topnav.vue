<template>
  <el-col :xs="24" :sm="5" :md="5" :lg="5" :xl="1">
    <div class="side-navigation">
      <div class="side-content">
        <el-card shadow="never" class="images-container text-center">
          <div class="image-holder">
            <el-col :md="4" :lg="5" :xl="1">
              <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/appicons/SendyAppIcon_512px.png" class="image" />
            </el-col>
            <el-col :md="19" :lg="15" :xl="1" class="logo-text">
              <span class="">Verify Portal</span>
            </el-col>
          </div>
        </el-card>
        <el-row class="tac">
          <el-col>
            <h5 class="nav-header">PARTNER APPLICATIONS</h5>
            <el-menu :default-active="current_route" :router="true" class="el-menu-vertical-demo">
              <template v-for="(link, index) in links">
                <el-menu-item class="nav-text " v-if="!link.hasChild" :index="`${link.name}`" :key="index" :route="{name: link.name}">
                  <i :class="`${link.icon}`"></i>
                  <span class="applicant-type">{{ link.text }}</span>
                    <span class="applicant-count">400</span>
                </el-menu-item>
                <el-submenu class="nav-text" v-if="link.hasChild" :index="`${link.name}`" :key="index">
                  <template slot="title">
                    <i :class="`${link.icon}`"></i>
                    <div class="applicant-type">{{ link.text }}</div>
                    <div class="applicant-count text-right">400</div>
                  </template>
                  <el-menu-item-group class="sub-nav">
                    <template v-for="(sub, i) in link.subMenu">
                      <el-menu-item class="sub-nav-text" :index="`${link.name}/${sub.name}`" :key="i" :route="{name: sub.name}">
                        <div class="applicant-type">{{ sub.text }}</div>
                        <div class="applicant-count text-right">400</div>
                        </el-menu-item>
                    </template>
                  </el-menu-item-group>
                </el-submenu>
              </template>
            </el-menu>
             <el-menu :default-active="current_route" class="el-menu-vertical-demo footer-links">
               <template v-for="(link, index) in footerLinks">
                  <el-menu-item class="nav-text" v-if="!link.hasChild" @click="logout()" :index="`${link.name}`" :key="index">
                  <i :class="`${link.icon}`"></i>
                  <span>{{ link.text }}</span>
                </el-menu-item>
               </template>
             </el-menu>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-col>
</template>
<script>
import TimezoneMxn from '../mixins/timezone_mixin';
import GeneralMxn from '../mixins/general_mixin';


export default {
  name: 'topnav',
  mixins: [TimezoneMxn, GeneralMxn],
  data() {
    return {
      search_term: '',
      applicants: 0,
      hideDrivers: true,
    };
  },
  computed: {
    current_route() {
      return this.$route.name;
    },
    user() {
      return JSON.parse(localStorage.user);
    },
    sendy_verifier() {
      if (this.user.external_status === '0') {
        return true;
      }
      return false;
    },
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.search_term = '';
      });
    },
  },
  mounted() {
    this.getInconsisntenciesUpdates();
  },
  methods: {
    loadApplicant(d) {
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
    logout() {
      axios.post(`${AUTH_URL}logout`, { refresh_token: localStorage.refresh_token }).then(response => {
        localStorage.clear();
        this.$router.replace('/');
      });
    },
    search(ev) {
      // prettier-ignore
      this.$store.commit('search', ev.target.value.split(' ').join('').toLowerCase());
    },
    getInconsisntenciesUpdates() {
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
  },
};
</script>
<style scoped>
.header-logo {
  width: auto;
  height: 60px;
  margin-top: -5px;
}
.el-table .cell {
  word-break: initial;
}
.nav-search {
  width: 76%;
  /*margin: auto;*/
  margin-top: 40px;
  margin-left: 13px;
  display: inline-block;
  margin-bottom: 20px;
}
.nav__search {
  width: 46%;
  border: 1px solid #bfcbd9;
  font-size: 14px;
  font-weight: 300;
  text-transform: uppercase;
  text-align: center;
  color: #555;
}
.nav.el-menu {
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  height: 80px;
}
.nav__links {
  height: 80px;
  margin-top: 40px;
  text-transform: uppercase;
}
.nav__links .el-menu-item {
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 1px;
}
.topnav--reupload-alert {
  margin-right: 50px;
}

@media only screen and (max-width: 768px) {
  .header-logo {
    width: auto;
    height: 42px;
    margin-top: 10px;
  }
  .el-menu-item {
    font-size: 10px !important;
    width: 30%;
    text-align: center;
    padding-left: 0px;
    padding-right: 0px;
  }
  .topnav--reupload-alert {
    margin-top: 15px;
  }
  .nav__session {
    margin-top: 17px;
  }
  #el-name {
    font-size: 11px;
  }
  .el-dropdown {
    min-width: 10px;
  }
}

@media only screen and (max-width: 480px) {
  .nav__logo {
    height: 35px;
    grid-column: span 6;
    padding: 0px;
    margin-top: 15px;
  }
  .el-menu-item * {
    vertical-align: top;
  }
  .header-logo {
    height: 28px;
    margin-top: 0px;
  }
  .topnav--reupload-alert {
    margin-left: 15px;
    grid-column: span 12;
    margin-top: 10px;
  }
  .nav__session {
    margin: 0px;
    grid-column: span 9;
    font-size: 10px !important;
  }
  .nav {
    height: 120px !important;
    display: grid !important;
    grid-template-columns: repeat(21, 1fr) !important;
    grid-template-rows: 60px;
    align-items: flex-start !important;
  }
  .nav__links {
    grid-column: span 14;
    margin-top: 0px;
    display: flex;
    justify-content: flex-end;
  }
  .el-menu:before {
    grid-column: span 1;
  }
  .el-menu-item {
    padding: 4px !important;
    font-size: 7px !important;
    width: 30% !important;
    text-align: center;
  }
  .nav-search {
    width: 94% !important;
  }
  .nav__search {
    width: 100% !important;
  }
  #el-name {
    font-size: 10px;
  }
  .el-submenu {
    width: 100%;
  }
  .el-dropdown {
    min-width: 120px;
  }
}

@media only screen and (max-width: 320px) {
  .el-menu-item {
    width: 40% !important;
  }
}
</style>
