<template xmlns:router-link="">
    <div class="stageone">
        <div class="stageone__filters">
            <label class="mr">Date Applied</label>
            <el-date-picker v-model="date_range" type="daterange" align="right" placeholder="Pick a range" :picker-options="picker_options" @change="changeDateRange">
            </el-date-picker>
        </div>
        <!--<vue-csv-downloader-->
         <!--class="el-button el-button&#45;&#45;primary download-csv"-->
         <!--:data="paginated_drivers"-->
         <!--:fields="export_fields">-->
          <!--Download CSV-->
        <!--</vue-csv-downloader>-->

        <el-table :data="paginated_drivers" @row-click="startVerification" v-loading.body="loading" border stripe :default-sort = "{prop: 'date_created', order: 'descending'}">
            <template slot="empty">
                {{empty_state}}
            </template>
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="phone" label="Phone"></el-table-column>
            <el-table-column prop="email" label="Email"></el-table-column>
            <el-table-column prop="city" label="City"></el-table-column>
            <el-table-column prop="vehicle_details" label="Vendor Type" :formatter="getVendorType"></el-table-column>
            <el-table-column prop="date_created" label="Date Applied" :formatter="formatTime" sortable></el-table-column>
            <el-table-column prop="application_type" label="Application" sortable></el-table-column>
            <el-table-column prop="last_activity" label="Last Activity" :formatter="getLastActivity"></el-table-column>
            <el-table-column prop="admin_name" label="Desk" :formatter="getDesk"></el-table-column>
            <el-table-column prop="invited_by" label="Invited By">
              <template scope="scope">
                  <span v-if="!paginated_drivers[scope.$index]['invited_by']">
                          N/A
                  </span>
                  <span v-if="paginated_drivers[scope.$index]['invited_by']">
                    <router-link :to="{ name: 'owner', params: { id: paginated_drivers[scope.$index]['owner_id'] }}"> {{ paginated_drivers[scope.$index]['invited_by'] }}</router-link>
                  </span>
              </template>
            </el-table-column>
             <el-table-column prop="allocation_status" label="Invite Status">
              <template scope="scope">
                  <span v-if="!paginated_drivers[scope.$index]['allocation_status']">
                          N/A
                  </span>
                  <span v-if="paginated_drivers[scope.$index]['allocation_status'] == 2">
                          Accepted
                  </span>
                  <span v-if="paginated_drivers[scope.$index]['allocation_status'] == 3">
                          Rejected
                  </span>
                  <span v-if="paginated_drivers[scope.$index]['allocation_status'] == 1">
                          pending
                  </span>
              </template>
            </el-table-column>

        </el-table>
        <template slot="empty">
            {{ empty_state }}
        </template>
        <div class="pagination mt mb" v-if="searched_drivers.length >= pagination_limit">
            <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :total="searched_drivers.length"
                :page-size="pagination_limit"
                :current-page.sync="pagination_page"
                @current-change="changePage"
                :page-sizes="[10, 20, 50, 100]"
                @size-change="changeSize"
                >
            </el-pagination>
        </div>
        <el-dialog v-if="verifying" :visible.sync="verifying" size="full" :before-close="resetVerification" class="stageone__verification">
            <el-steps class="stageone__verification__steps" :space="200" :active="current_step" v-if="verifying">
                <el-step v-for="(step, index) in steps" :key="index" :title="getStepTitle(step)" @click.native="set(step - 1)"></el-step>
            </el-steps>
            <div class="stageone__verification__left-button" @click="prev" v-if="current_step > 1">&#10094;</div>
            <div class="stageone__verification__right-button" @click="next" v-if="current_step < steps">&#10095;</div>
            <el-carousel arrow="never" :autoplay="false" :indicator-position="'none'" ref="carousel">
                <el-carousel-item v-if="verifying">
                    <personaldetails/>
                </el-carousel-item>
                <el-carousel-item v-if="verifying && current_verification.has_owner">
                    <vehicledetails/>
                </el-carousel-item>
                <el-carousel-item v-if="verifying && current_verification.has_owner">
                    <ownerdetails/>
                </el-carousel-item>
                <el-carousel-item v-if="verifying">
                    <summarydetails @finished='finishVerification' />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>
<script>
import personaldetails from './personaldetails'
import vehicledetails from './vehicledetails'
import ownerdetails from './ownerdetails'
import summarydetails from './summarydetails'
import VueCsvDownloader from 'vue-csv-downloader';

export default {
    name: 'stageone',
    components: { personaldetails, vehicledetails, ownerdetails, summarydetails, VueCsvDownloader },
    data() {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        return {
            export_fields: ['name', 'phone', 'email', 'city', 'vendor_type','date_created','application_type'],
            drivers: [],
            vendor_types: VENDOR_TYPES,
            verifying: false,
            driver: {},
            current_step: 1,
            empty_state: 'Loading...',
            date_range: [
                new Date(y, m, 1), new Date(y, m + 1, 0)
            ],
            picker_options: {
                shortcuts: [{
                    text: 'This month',
                    onClick(picker) {
                        picker.$emit('pick', [new Date(y, m, 1), new Date(y, m + 1, 0)]);
                    }
                }, {
                    text: 'Last 1 month',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: 'Last 2 months',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: 'Last 3 months',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: 'Last 6 months',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 120);
                        picker.$emit('pick', [start, end]);
                     }
                },
                    {
                      text:'All Applications',
                      onClick(picker) {
                        picker.$emit('pick', [null, null]);

                      }
                }]
            },
            pagination_limit: 20,
            pagination_page: 1,
            loading: false,
            steps: 4
        }
    },
    beforeMount() {
        this.getDrivers();
        setInterval(() => {
            this.getDriversBackground();
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
            let paginated_drivers = this.searched_drivers.slice(from, to);
            console.log(from, to, paginated_drivers);
        },
        changeDateRange() {
            this.pagination_page = 1;
            this.getDrivers();
        },
        getDriversBackground() {
            let vm = this;
            let start = new Date(this.date_range[0]);
            let start_date = start.getDate();
            let start_month = start.getMonth() + 1;
            let start_year = start.getFullYear();

            let final_start_date = start_year + "-" + start_month + "-" + start_date ;

            let stop = new Date(this.date_range[1]);
            let stop_date = stop.getDate();
            let stop_month = stop.getMonth() + 1;
            let stop_year = stop.getFullYear();

            let final_stop_date = stop_year + "-" + stop_month + "-" + stop_date ;

            let payload = {
                limit: "all",
                stage: 2,
                state: "all",
                from: final_start_date,
                to: final_stop_date
            };
            axios.post(PARTNER_BASE_URL + 'admin/partner_list', payload)
            .then((response) => {
                vm.drivers = response.data.data.partner_list;
            })
            .catch((error) => {
                log(error);
                throw new Error('Could not get drivers');
            });
        },
        getDrivers() {
            let vm = this;
            vm.loading = true;
            vm.empty_state = "Loading...";
            let final_start_date = null;

            if(this.date_range[0] !== null ) {
              let start = new Date(this.date_range[0]);
              let start_date = start.getDate();
              let start_month = start.getMonth() + 1;
              let start_year = start.getFullYear();

              final_start_date = start_year + "-" + start_month + "-" + start_date;
            }

            let final_stop_date = null;

            if(this.date_range[1] !== null) {
              let stop = new Date(this.date_range[1]);
              let stop_date = stop.getDate();
              let stop_month = stop.getMonth() + 1;
              let stop_year = stop.getFullYear();
              final_stop_date = stop_year + "-" + stop_month + "-" + stop_date;
            }

            let payload = {
                limit: "all",
                stage: 2,
                state: "all",
                from: final_start_date,
                to: final_stop_date
            };

            axios.post(PARTNER_BASE_URL + 'admin/partner_list', JSON.stringify(payload))
                .then((response) => {
                    console.log(response);
                    vm.drivers = response.data.data.partner_list;
                    vm.empty_state = "No Data";
                    vm.loading = false;
                })
                .catch((error) => {
                    vm.empty_state = "No Data";
                    vm.loading = false;
                    log(error);
                    throw new Error('Could not get drivers');
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
            let vm = this;
            this.verifying = true;
            this.$nextTick(() => {
                vm.$refs.carousel.updateItems();
            });
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
        searched_drivers() {
            return this.drivers.filter((driver) => {
                let searchable_string = (driver.name + driver.phone + driver.email).split(" ").join("").toLowerCase();
                return searchable_string.indexOf(this.$store.getters.search_term) > -1;
            });
        },
        paginated_drivers() {
            let from = (this.pagination_page - 1) * this.pagination_limit;
            let to = this.pagination_page * this.pagination_limit;
            return this.searched_drivers.slice(from, to);
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
</style>
