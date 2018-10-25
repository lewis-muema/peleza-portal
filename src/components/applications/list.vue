<template xmlns:router-link="">
    <div class="stageone">
        <el-table :data="paginated_applicants" @row-click="startVerification" v-loading.body="loading" border stripe :default-sort = "{prop: 'date_created', order: 'descending'}">
            <template slot="empty">
                {{empty_state}}
            </template>
            <el-table-column prop="id_no" label="ID NUMBER"></el-table-column>
            <el-table-column prop="kra_pin" label="KRA PIN"></el-table-column>
            <el-table-column prop="date_created" label="APPLICATION DATE" :formatter="formatTime" sortable></el-table-column>
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
            axios.post(PARTNER_BASE_URL + 'admin/partner_list', payload)
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

            axios.post(PARTNER_BASE_URL + 'admin/partner_list', JSON.stringify(payload))
                .then((response) => {
                    console.log(response);
                    vm.applicants = response.data.data.partner_list;
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
                id: d.id,
                has_owner: d.owner_details !== null ? true : false,
                status: d.status,
                state: d.state,
                stage: d.stage,
                token: d.token,
                referrer: d.referrer,
                dates: {
                    date_created: d.date_created,
                    date_time: d.date_time,
                    date_approved: d.date_approved,
                    interview_date: d.interview_date
                },
                docs: d.docs_verification ? JSON.parse(d.docs_verification) : {
                    driver_photo: {
                        image: d.driver_photo ? `${AWS_URL}photo/${d.driver_photo}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: d.driver_photo ? true : false
                    },
                    id_card: {
                        image: d.id_card ? `${AWS_URL}id/${d.id_card}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: d.id_card ? true : false
                    },
                    kra_pin_cert: {
                        image: d.kra_pin_cert ? `${AWS_URL}kra/${d.kra_pin_cert}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: d.kra_pin_cert ? true : false
                    },
                    good_conduct: {
                        image: d.good_conduct ? `${AWS_URL}gc/${d.good_conduct}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: d.good_conduct ? true : false
                    },
                    driving_licence: {
                        image: d.driving_licence ? `${AWS_URL}dl/${d.driving_licence}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: d.driving_licence ? true : false
                    },
                    log_book: d.vehicle_details ? {
                        image: d.vehicle_details.log_book ? `${AWS_URL}lb/${d.vehicle_details.log_book}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: d.vehicle_details.log_book ? true : false
                    } : null,
                    insurance: d.vehicle_details ? {
                        image: d.vehicle_details.insurance ? `${AWS_URL}insu/${d.vehicle_details.insurance}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: d.vehicle_details.insurance ? true : false
                    } : null,
                    vehicle_photo: d.vehicle_details ? {
                        image: d.vehicle_details.photo ? `${AWS_URL}vehicle/${d.vehicle_details.photo}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: d.vehicle_details.photo ? true : false
                    } : null
                },
                personal_details: {
                    driver_photo: d.driver_photo ? `${AWS_URL}driver/${d.driver_photo}` : MISSING_PHOTO_URL,
                    name: d.name,
                    id_no: d.id_no,
                    kra_pin: d.kra_pin,
                    nok_name: d.nok_name,
                    nok_phone: d.nok_phone,
                    nok_id: d.nok_id,
                    nok_relationship: d.nok_relationship,
                    country: d.country,
                    city: d.city,
                    email: d.email
                },
                vehicle_details: d.vehicle_details,
                owner_details: d.owner_details
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
        getStepTitle(step) {
            if (this.current_verification.has_owner) {
                switch (step) {
                    case 1:
                        return 'Personal Details'
                    case 2:
                        return 'Vehicle Details'
                    case 3:
                        return 'Owner Details'
                    case 4:
                        return 'Summary'
                    default:
                        return `Step ${step}`
                }
            } else {
                switch (step) {
                    case 1:
                        return 'Personal Details'
                    case 2:
                        return 'Summary'
                    default:
                        return `Step ${step}`
                }
            }
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
