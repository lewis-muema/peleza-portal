<template>
    <div class="approved">
        <div class="approved__filters">
            <label class="mr">Date Applied</label>
            <el-date-picker v-model="date_range" type="daterange" align="right" placeholder="Pick a range" :picker-options="picker_options" @change="changeDateRange">
            </el-date-picker>
        </div>
        <el-table :data="paginated_drivers" @row-click="openDriver" v-loading.body="loading" border stripe>
            <template slot="empty">
                {{ empty_state }}
            </template>
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="phone" label="Phone"></el-table-column>
            <el-table-column prop="email" label="Email"></el-table-column>
            <el-table-column prop="city" label="City"></el-table-column>
            <el-table-column prop="vehicle_details" label="Vendor Type" :formatter="getVendorType"></el-table-column>
            <el-table-column prop="date_created" label="Date Applied" :formatter="formatDateCreated"></el-table-column>
            <el-table-column prop="date_approved" label="Date Approved" :formatter="formatDateApproved"></el-table-column>
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
        <el-dialog :visible.sync="view_driver" size="full" class="approved__view">
            <div class="approved__view__container" v-if="view_driver">
                <div class="approved__view__details">
                    <div class="approved__view__details__sections">
                        <el-card header="Personal Details" class="approved__view__details__personal-details">
                            <el-form :model="current_driver.personal_details">
                                <el-form-item label="Driver name" :label-width="'25%'">
                                    <el-input v-model="current_driver.personal_details.name" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="ID Number" :label-width="'25%'">
                                    <el-input v-model="current_driver.personal_details.id_no" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="KRA PIN" :label-width="'25%'">
                                    <el-input v-model="current_driver.personal_details.kra_pin" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="Next of Kin" :label-width="'25%'" v-if="current_driver.personal_details.nok_name">
                                    <el-input v-model="current_driver.personal_details.nok_name" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="Next of Kin Relationship" :label-width="'25%'" v-if="current_driver.personal_details.nok_relationship">
                                    <el-input v-model="current_driver.personal_details.nok_relationship" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="Next of Kin Id Number" :label-width="'25%'" v-if="current_driver.personal_details.nok_id">
                                    <el-input v-model="current_driver.personal_details.nok_id" auto-complete="off"></el-input>
                                </el-form-item>


                                <el-form-item label="Next of Kin Phone" :label-width="'25%'" v-if="current_driver.personal_details.nok_phone">
                                    <el-input v-model="current_driver.personal_details.nok_phone" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                        <el-card header="Owner Details" class="approved__view__details__owner-details" v-if="current_driver.owner_details">
                            <el-form :model="current_driver.owner_details">
                                <el-form-item label="Owner Name" :label-width="'25%'">
                                    <el-input v-model="current_driver.owner_details.name" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="Owner Phone" :label-width="'25%'">
                                    <el-input v-model="current_driver.owner_details.phone" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="Owner ID" :label-width="'25%'">
                                    <el-input v-model="current_driver.owner_details.id_no" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                        <el-card header="Vehicle Details" class="approved__view__details__vehicle-details" v-if="current_driver.vehicle_details">
                            <el-form :model="current_driver.vehicle_details">
                                <el-form-item label="Reg. No." :label-width="'25%'">
                                    <el-input v-model="current_driver.vehicle_details.registration_no" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="Insurance No." :label-width="'25%'">
                                    <el-input v-model="current_driver.vehicle_details.insurance_no" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="Logbook No." :label-width="'25%'">
                                    <el-input v-model="current_driver.vehicle_details.log_book_no" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="PSV No." :label-width="'25%'">
                                    <el-input v-model="current_driver.vehicle_details.psv_no" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="Year of Man." :label-width="'25%'">
                                    <el-input v-model="current_driver.vehicle_details.manufacture_year" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="Vendor" :label-width="'25%'">
                                    <el-select v-model="vendor_types[Number(current_driver.vehicle_details.vendor_type - 1)]" placeholder="Select">
                                        <el-option v-for="(vendor, index) in vendor_types" :key="index" :label="vendor" :value="index">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="Make" :label-width="'25%'">
                                    <el-input v-model="current_driver.vehicle_details.make" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="Model" :label-width="'25%'">
                                    <el-input v-model="current_driver.vehicle_details.model" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="Box" :label-width="'25%'" v-if="vendor_types[Number(current_driver.vehicle_details.vendor_type - 1)] == 'Bike'">
                                    <el-radio-group v-model="current_driver.vehicle_details.box">
                                        <el-radio label="1">
                                            Box
                                        </el-radio>
                                        <el-radio label="0">
                                            No Box
                                        </el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="Refrigerated" :label-width="'35%'" v-if="vendor_types[Number(current_driver.vehicle_details.vendor_type - 1)] !== 'Bike'">
                                    <el-radio-group v-model="current_driver.vehicle_details.refrigerated">
                                        <el-radio label="1">
                                           Refrigerated
                                        </el-radio>
                                        <el-radio label="0">
                                           Not Refrigerated
                                        </el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="Closed" :label-width="'25%'" v-if="vendor_types[Number(current_driver.vehicle_details.vendor_type - 1)] !== 'Bike'">
                                    <el-radio-group v-model="current_driver.vehicle_details.closed">
                                        <el-radio label="1">
                                          Closed
                                        </el-radio>
                                        <el-radio label="0">
                                          Not Closed
                                        </el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-form>
                        </el-card>

                    </div>
                    <div class="approved__view__buttons">
                        <el-popover ref="moveback-popover" placement="top" width="240" v-model="popover_visible">
                            <el-input type="textarea" placeholder="Please give a reason" v-model="reason"></el-input>
                            <div style="text-align: right; margin: 0; margin-top: 15px;">
                                <el-button size="mini" type="text" @click="popover_visible = false">cancel</el-button>
                                <el-button type="primary" size="mini" @click="moveBack" v-loading.fullscreen.lock="lock_ui">confirm</el-button>
                            </div>
                        </el-popover>
                        <el-button class="approved__view__buttons__button" v-popover:moveback-popover>Move Back to Stage 1</el-button>
                    </div>
                </div>
                <div class="approved__view__docs">
                    <doc v-if="current_driver.docs.driver_photo && current_driver.docs.driver_photo.available" :src="current_driver.docs.driver_photo.image" :title="'Driver Photo'" :narrow="true" />
                    <doc :src="current_driver.docs.id_card.image" :title="'Identification Doc'" :narrow="true" />
                    <doc :src="current_driver.docs.kra_pin_cert.image" :title="'KRA Certificate'" :narrow="true" :expiry="new Date()" />
                    <doc v-if="current_driver.docs.good_conduct && current_driver.docs.good_conduct.available" :src="current_driver.docs.good_conduct.image" :title="'Good Conduct'" :narrow="true" :expiry="new Date()" />
                    <doc v-if="current_driver.docs.driving_licence && current_driver.docs.driving_licence.available" :src="current_driver.docs.driving_licence ? current_driver.docs.driving_licence.image : current_driver.docs.driving_license.image" :title="'Driving License'" :narrow="true" :expiry="new Date()" />
                    <doc :src="current_driver.docs.log_book.image" :title="'Logbook'" :narrow="true" v-if="current_driver.docs.log_book"/>
                    <doc :src="current_driver.docs.insurance.image" :title="'Insurance'" :narrow="true" v-if="current_driver.docs.insurance"/>
                    <doc :src="current_driver.docs.vehicle_photo.image" :title="'Vehicle Photo'" :narrow="true" v-if="current_driver.docs.vehicle_photo"/>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import doc from '../stageone/doc';
export default {
    name: 'approved',
    components: { doc },
    data() {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        return {
            drivers: [],
            vendor_types: VENDOR_TYPES,
            view_driver: false,
            driver: {},
            empty_state: 'Loading...',
            popover_visible: false,
            reason: '',
            lock_ui: false,
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
                }]
            },
            pagination_limit: 20,
            pagination_page: 1,
            loading: false
        }
    },
    beforeMount() {
        this.getDrivers();
    },
    methods: {
        formatDateCreated(row, column) {
            return moment(row.date_created).format("Do MMM YYYY, h:mm:ss a");
        },
        formatDateApproved(row, column) {
            return moment(row.date_approved).format("Do MMM YYYY, h:mm:ss a");
        },
        changeDateRange() {
            this.pagination_page = 1;
            this.getDrivers();
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
        getDrivers() {
            let vm = this;
            vm.loading = true;
            axios.post(PARTNER_BASE_URL + 'admin/partner_list', {
                limit: "all",
                stage: 3,
                state: "all",
                from: this.date_range[0],
                to: this.date_range[1]
            })
                .then((response) => {
            vm.loading = false;
                    vm.drivers = response.data.data.partner_list;
                    vm.empty_state = 'No Data'
                })
                .catch((error) => {
                    vm.loading = false;
                    log(error);
                    throw new Error('Could not get drivers');
                });
        },
        getInvitedBy(row, column) {
            return row.invited_by ? (
                row.invited_by.length > 0 ? row.invited_by : 'N/A'
            ) : 'N/A';
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
        getVendorType(row, column) {
            return row.vehicle_details ? (row.vehicle_details.vendor_type == '0' ? 'Unknown' : this.vendor_types[Number(row.vehicle_details.vendor_type) - 1]) : 'N/A';
        },
        openDriver(d) {
            console.log('[APPROVED] open!')
            this.driver = d;
            this.view_driver = true;
        },
        closeDriver() {
            this.driver = {}
            this.view_driver = false
        },
        moveBack() {
            if (!(this.reason.length > 0)) {
                this.$notify.warning({
                    title: 'Reason',
                    message: 'Please give a reason for moving the partner back'
                });
                return;
            }
            this.lock_ui = true;
            let payload = {
                admin_id: JSON.parse(localStorage.user).admin_id,
                admin_name: JSON.parse(localStorage.user).name,
                driver: Object.assign({}, this.current_driver),
                docs: Object.assign({}, this.current_driver.docs),
                status: 'moveback',
                reason: this.reason,
            }
            axios.post(BASE_URL + 'approve', payload)
                .then((response) => {
                    this.lock_ui = false;
                    this.closeDriver();
                    this.getDrivers();
                    this.$notify.success({
                        title: 'Partner Moved',
                        message: 'The partner was moved back to stage one'
                    });

                })
                .catch((error) => {
                    this.lock_ui = false;
                    this.$notify.error({
                        title: 'Moving Failed',
                        message: 'Failed to move the partner. Please try again'
                    });
                    log(error);
                    throw new Error('Failed to move the rider back to stage one');
                })
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
        current_driver() {
            if (!this.driver.name) return 'No driver selected';
            return {
                id: this.driver.id,
                has_owner: this.driver.owner ? true : false,
                status: this.driver.status,
                state: this.driver.state,
                stage: this.driver.stage,
                token: this.driver.token,
                referrer: this.driver.referrer,
                dates: {
                    date_created: this.driver.date_created,
                    date_time: this.driver.date_time,
                    date_approved: this.driver.date_approved,
                    interview_date: this.driver.interview_date
                },
                docs: this.driver.docs_verification ? JSON.parse(this.driver.docs_verification) : {
                    driver_photo: {
                        image: this.driver.driver_photo ? `${AWS_URL}photo/${this.driver.driver_photo}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: this.driver.driver_photo ? true : false
                    },
                    id_card: {
                        image: this.driver.id_card ? `${AWS_URL}id/${this.driver.id_card}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: this.driver.id_card ? true : false
                    },
                    kra_pin_cert: {
                        image: this.driver.kra_pin_cert ? `${AWS_URL}kra/${this.driver.kra_pin_cert}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: this.driver.kra_pin_cert ? true : false
                    },
                    good_conduct: {
                        image: this.driver.good_conduct ? `${AWS_URL}gc/${this.driver.good_conduct}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: this.driver.good_conduct ? true : false
                    },
                    driving_licence: {
                        image: this.driver.driving_licence ? `${AWS_URL}dl/${this.driver.driving_licence}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: this.driver.driving_licence ? true : false
                    },
                    log_book: this.driver.vehicle_details ? {
                        image: this.driver.vehicle_details.log_book ? `${AWS_URL}lb/${this.driver.vehicle_details.log_book}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: this.driver.vehicle_details.log_book ? true : false
                    } : null,
                    insurance: this.driver.vehicle_details ? {
                        image: this.driver.vehicle_details.insurance ? `${AWS_URL}insu/${this.driver.vehicle_details.insurance}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: this.driver.vehicle_details.insurance ? true : false
                    } : null,
                    vehicle_photo: this.driver.vehicle_details ? {
                        image: this.driver.vehicle_details.photo ? `${AWS_URL}vehicle/${this.driver.vehicle_details.photo}` : MISSING_PHOTO_URL,
                        validity: false,
                        available: this.driver.vehicle_details.photo ? true : false
                    } : null
                },
                personal_details: {
                    driver_photo: this.driver.driver_photo ? `${AWS_URL}driver/${this.driver.driver_photo}` : MISSING_PHOTO_URL,
                    name: this.driver.name,
                    id_no: this.driver.id_no,
                    kra_pin: this.driver.kra_pin,
                    nok_name: this.driver.nok_name,
                    nok_phone: this.driver.nok_phone,
                    nok_id: this.driver.nok_id,
                    nok_relationship: this.driver.nok_relationship
                },
                vehicle_details: this.driver.vehicle_details,
                owner_details: this.driver.owner_details
            }
        }
    }
}
</script>

<style>
  .el-radio {
    margin-left: 15px !important;
  }
</style>
