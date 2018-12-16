<template>
  <div>
    <el-menu theme="dark" :default-active="current_route" mode="horizontal" router class="nav">
      <span class="nav__logo el-menu-item">
        <img src="../assets/sendy-logo-white.png" class="header-logo">
      </span>
      <div class="nav__links">
        <!-- <el-menu-item index="/">Dashboard</el-menu-item> -->
        <el-menu-item
          class="ml"
          index="/applications"
          :class="{'is-active':(current_route === 'applications')}"
          exact
          replace
        >Applications</el-menu-item>
        <el-menu-item
          :class="{'is-active':(current_route === 'inconsistencies')}"
          index="/inconsistencies"
          exact
          replace
        >Inconsistencies</el-menu-item>
        <el-menu-item
          :class="{'is-active':(current_route === 'reviewed')}"
          index="/reviewed"
          exact
          replace
        >Reviewed</el-menu-item>
        <!--<el-menu-item :class="{'is-active':(current_route === 'renewals')}" index="/renewals" exact replace>Renewals</el-menu-item>-->
      </div>
        <el-dropdown class="topnav--reupload-alert">
          <span class="el-dropdown-link">
            <el-badge :value="applicants.length" :max="99" class="item">
            <el-button size="small">
              <i class="el-icon-bell el-icon--right"></i>
            </el-button>
          </el-badge>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  v-for="applicant in applicants">
              <a  @click="loadApplicant(applicant)"> 
              Applicant review updated on {{applicant.date_time}}
              </a>
            </el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>

      <el-submenu index="6" class="nav__session">
        <template slot="title">
          
          <img
            style="
            height: 40px;
            width: 40px;
            border-radius: 50%;
            margin-right: 10px;
        "
            :src="`http://care.sendyit.com/customer/include/team/${user.pic}`"
          >
          <span>{{ user.name }}</span>
        </template>
        <div class="el-menu-item" @click="logout">Logout</div>
      </el-submenu>
    </el-menu>
    <div
      class="row"
      v-if="current_route !== 'applicant' && current_route !== 'reviewed-applicant' && current_route !== 'inconsistency'"
    >
      <div class="nav-search">
        <input
          class="nav__search"
          type="search"
          placeholder="Search ID / KRA PIN / VENDOR TYPE"
          v-model="search_term"
          @input="search"
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "topnav",
  data() {
    return {
      search_term: "",
      applicants:0
    };
  },
  mounted(){
    this.getInconsisntenciesUpdates();
  },
  computed: {
    current_route() {
      return this.$route.name;
    },
    user() {
      return JSON.parse(localStorage.user);
    }
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.search_term = "";
      });
    }
  },
  methods: {
    loadApplicant(d){
      console.log(d);
                let verification = {
                    applicant_details: {
                        application_type: d.application_type,
                        date_created: d.date_created,
                        partner_id: d.id,
                        id_no: d.id_no,
                        kra_pin: d.kra_pin,
                        driver_photo: d.driver_photo
                            ? `${AWS_URL}photo/${d.driver_photo}`
                            : MISSING_PHOTO_URL,
                        nok_id: d.nok_id,
                        vehicle_reg_no: d.vehicle_reg_no ? d.vehicle_reg_no : "",
                        good_conduct: d.good_conduct ? d.good_conduct : "",
                        insurance_copy: d.insurance_copy ? d.insurance_copy : "",
                        vehicle_photo: d.vehicle_photo ? d.vehicle_photo : "",
                        vendor_type: d.vendor_type ? d.vendor_type : ""
                    },
                    verification_details: {
                        identity_check: d.identity_check
                            ? JSON.parse(d.identity_check)
                            : {
                                applicant_name: "",
                                dob: "",
                                pob: "",
                                gender: "",
                                review_status: false,
                                inconsistency: false
                            },
                        criminal_records_check: d.criminal_records_check
                            ? JSON.parse(d.criminal_records_check)
                            : {
                                applicant_name: "",
                                criminal_history: "",
                                authenticity: "",
                                id_no: "",
                                ref_no: "",
                                review_status: d.application_type == "Owner" ? true : false,
                                inconsistency: false
                            },
                        driving_license_check: d.driving_license_check
                            ? JSON.parse(d.driving_license_check)
                            : {
                                applicant_name: "",
                                dl_no: "",
                                date_of_issue: "",
                                expiry_date: "",
                                classes: "",
                                id_no: "",
                                review_status: d.application_type == "Owner" ? true : false,
                                inconsistency: false
                            },
                        motor_vehicle_records_check: d.motor_vehicle_records_check
                            ? JSON.parse(d.motor_vehicle_records_check)
                            : {
                                ownership_details: "",
                                chasis_no: "",
                                make: "",
                                body_type: "",
                                engine_no: "",
                                manufacture_year: "",
                                caveats: "",
                                review_status: d.application_type == "Driver" ? true : false,
                                inconsistency: false
                            },
                        car_insurance_validity: d.car_insurance_validity
                            ? JSON.parse(d.car_insurance_validity)
                            : {
                                owner_name: "",
                                vehicle_number_plate: "",
                                issue_date: "",
                                expiry_date: "",
                                validity: "",
                                policy_number: "",
                                review_status: d.application_type == "Driver" ? true : false,
                                inconsistency: false
                            },
                        kra_pin_verification: d.kra_pin_verification
                            ? JSON.parse(d.kra_pin_verification)
                            : {
                                validity: "",
                                name: "",
                                pin_number: "",
                                tax_obligations: "",
                                registration_date: "",
                                review_status: false,
                                inconsistency: false
                            }
                    }
                };

                this.$store.commit("changeVerification", verification);
                this.$router.push({name: "applicant", params: {id: d.id}});
    },
    logout() {
      localStorage.clear();
      this.$router.replace("/");
    },
    search(ev) {
      this.$store.commit(
        "search",
        ev.target.value
          .split(" ")
          .join("")
          .toLowerCase()
      );
    },
    getInconsisntenciesUpdates(){
      let payload = {
         
      };
      axios
          .post(
              PARTNER_BASE_URL + "peleza/applications/list_updated_inconsistencies/",
              payload
          )
          .then(response => {
              this.applicants = response.data.applicants;
          })
          .catch(error => {
              log(error);
              throw new Error("Could not get applicants");
          });
    }
  }
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
.nav__links .el-menu-item.is-active {
}
.topnav--reupload-alert {
  margin-right: 50px;
}
</style>
