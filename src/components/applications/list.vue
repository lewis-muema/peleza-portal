<template xmlns:router-link="">
    <div class="stageone">
        <el-table :data="paginated_applicants" @row-click="startVerification" v-loading.body="loading" border stripe :default-sort = "{prop: 'date_created', order: 'descending'}">
            <template slot="empty">
                {{empty_state}}
            </template>
            <el-table-column prop="id_no" label="ID NUMBER"></el-table-column>
            <el-table-column prop="kra_pin" label="KRA PIN"></el-table-column>
            <el-table-column prop="date_created" label="APPLICATION DATE" :formatter="formatTime" sortable></el-table-column>
            <el-table-column prop="application_type" label="APPLICATION TYPE"></el-table-column>

            <el-table-column prop="status" label="STATUS">
              <template scope="scope">
                  <span>Pending</span>
              </template>
            </el-table-column>

        </el-table>
        <template slot="empty">
            {{ empty_state }}
        </template>
        <div class="pagination mt mb" v-if="searched_applicants.length >= pagination_limit">
            <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :total="searched_applicants.length"
                :page-size="pagination_limit"
                :current-page.sync="pagination_page"
                @current-change="changePage"
                :page-sizes="[10, 20, 50, 100]"
                @size-change="changeSize"
                >
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name: 'applicants_list',
    data() {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        return {
            applicants: [],
            verifying: false,
            applicant: {},
            empty_state: 'Loading...',
            date_range: [
                new Date(y, m, 1), new Date(y, m + 1, 0)
            ],
            pagination_limit: 40,
            pagination_page: 1,
            loading: false,
        }
    },
    beforeMount() {
        this.getApplicants();
        setInterval(() => {
            this.getApplicantsBackground();
        }, 600000);
    },
    methods: {
        formatTime(row, column) {
            return moment(row.date_created).format("Do MMM YYYY, h:mm:ss a");
        },
        changeSize(val) {
            this.pagination_page = 1;
            this.pagination_limit = val;
        },
        changePage() {
            console.log('Page changed to', this.pagination_page);
            let from = (this.pagination_page - 1) * this.pagination_limit;
            let to = this.pagination_page * this.pagination_limit;
            let paginated_applicants = this.searched_applicants().slice(from, to);
            console.log(from, to, paginated_applicants);
        },
        changeDateRange() {
            this.pagination_page = 1;
            this.getApplicants();
        },
        getApplicantsBackground() {
            let vm = this;
            let final_start_date = null;
            let final_stop_date = null;

            let payload = {
                limit: "all",
                stage: -1,
                state: "all",
                from: final_start_date,
                to: final_stop_date
            };
            axios.post(PARTNER_BASE_URL + 'peleza/applications/list_applicants/', payload)
            .then((response) => {
                vm.applicants = response.data.data.partner_list;
            })
            .catch((error) => {
                log(error);
                throw new Error('Could not get applicants');
            });
        },
        getApplicants() {
            let vm = this;
            vm.loading = true;
            vm.empty_state = "Loading...";
            let final_start_date = null;
            let final_stop_date = null;

            let payload = {
                limit: "all",
                stage: -1,
                state: "all",
                from: final_start_date,
                to: final_stop_date
            };

            axios.post(PARTNER_BASE_URL + 'peleza/applications/list_applicants/', JSON.stringify(payload))
                .then((response) => {
                    console.log(response);
                    vm.applicants = response.data.applicants;
                    vm.empty_state = "No Data";
                    vm.loading = false;
                })
                .catch((error) => {
                    vm.empty_state = "No Data";
                    vm.loading = false;
                    log(error);
                    throw new Error('Could not get applicants');
                })
        },
        getVendorType(row, column) {
            return row.vehicle_details ? (row.vehicle_details.vendor_type == '0' ? 'Unknown' : this.vendor_types[Number(row.vehicle_details.vendor_type) - 1]) : 'N/A';
        },
        getDesk(row, column) {
            return row.admin_name ? (
                row.admin_name.length > 0 ? row.admin_name : 'N/A'
            ) : 'N/A';
        },
        getLastActivity(row, column) {
            return row.last_activity ? (
                row.last_activity.length > 0 ? row.last_activity : 'N/A'
            ) : 'N/A';
        },
        startVerification(d) {
              console.log(d);
            let verification = {
                applicant_details : {
                    application_type: d.application_type,
                    date_created: d.date_created,
                    partner_id: d.id,
                    id_no: d.id_no,
                    kra_pin: d.kra_pin,
                    driver_photo: d.driver_photo ? `${AWS_URL}photo/${d.driver_photo}` : MISSING_PHOTO_URL,
                    nok_id: d.nok_id,
                    vehicle_reg_no: d.vehicle_reg_no ? d.vehicle_reg_no : '',
                    good_conduct: d.good_conduct ? d.good_conduct: '',
                    insurance_copy: d.insurance_copy ? d.insurance_copy : '',
                    vehicle_photo: d.vehicle_photo ? d.vehicle_photo: ''
                },
                verification_details : {
                    identity_check : d.identity_check? JSON.parse(d.identity_check) : {
                        applicant_name: '',
                        dob:'',
                        pob:'',
                        gender:'',
                        review_status: false
                    },
                    criminal_records_check : d.criminal_records_check? JSON.parse(d.criminal_records_check) : {
                        applicant_name:'',
                        criminal_history:'',
                        authenticity:'',
                        id_no:'',
                        ref_no:'',
                        review_status: d.application_type == 'Owner'? true : false
                    },
                    driving_license_check : d.driving_license_check ? JSON.parse(d.driving_license_check) : {
                        applicant_name:'',
                        dl_no:'',
                        date_of_issue:'',
                        expiry_date:'',
                        classes:'',
                        id_no:'',
                        review_status: d.application_type == 'Owner'? true : false
                    },
                    motor_vehicle_records_check : d.motor_vehicle_records_check ? JSON.parse(d.motor_vehicle_records_check) : {
                        ownership_details:'',
                        chasis_no:'',
                        make:'',
                        body_type:'',
                        engine_no:'',
                        manufacture_year:'',
                        caveats:'',
                        review_status: d.application_type == 'Driver'? true : false

                    },
                    car_insurance_validity : d.car_insurance_validity ? JSON.parse(d.car_insurance_validity) : {
                        owner_name:'',
                        vehicle_number_plate:'',
                        issue_date:'',
                        expiry_date:'',
                        validity:'',
                        policy_number:'',
                        review_status: d.application_type == 'Driver'? true : false

                    },
                    kra_pin_verification : d.kra_pin_verification ? JSON.parse(d.kra_pin_verification) : {
                        validity:'',
                        name:'',
                        pin_number:'',
                        tax_obligations:'',
                        registration_date:'',
                        review_status: false
                    }

                }
            };

            this.updateSteps(verification.has_owner);
            this.$store.commit('changeVerification', verification);
            this.$router.push({ name: 'applicant', params: {id : d.id}});

        },
        resetVerification(done) {
            this.set(0);
            this.verifying = false;
            this.$store.commit('resetVerification');
            done();
        },
        prev() {
            let carousel = this.$refs.carousel;
            if (carousel.activeIndex != 0) {
                carousel.setActiveItem(carousel.activeIndex - 1);
                this.current_step = carousel.activeIndex + 1;
            }
        },
        next() {
            let carousel = this.$refs.carousel;
            if (carousel.activeIndex != carousel.items.length - 1) {
                carousel.setActiveItem(carousel.activeIndex + 1);
                this.current_step = carousel.activeIndex + 1;
            }
        },
        set(i) {
            this.$refs.carousel.setActiveItem(i);
            this.current_step = this.$refs.carousel.activeIndex + 1;
        },

        finishVerification() {
            this.set(0);
            this.verifying = false;
            this.$store.commit('resetVerification');
            this.getDrivers();
        },
        updateSteps(has_owner) {
            this.steps = has_owner ? 4 : 2;
        }
    },
    computed: {
        searched_applicants() {
            return this.applicants.filter((applicant) => {
                let searchable_string = (applicant.id_no + applicant.kra_pin).split(" ").join("").toLowerCase();
                return searchable_string.indexOf(this.$store.getters.search_term) > -1;
            });
        },
        paginated_applicants() {
            let from = (this.pagination_page - 1) * this.pagination_limit;
            let to = this.pagination_page * this.pagination_limit;
            return this.searched_applicants.slice(from, to);
        },
        current_verification() {
            return this.$store.getters.current_verification;
        },

    }
}
</script>
<style>
  .el-picker-panel__sidebar {
    width: 120px;
  }
  .download-csv {
    margin-bottom: 10px;
    float: right;
  }
.el-table__row {
    cursor: pointer;
    height: 50px;
}

</style>
