<template xmlns:router-link="">
    <div class="stageone">
        <div class="stageone__filters">
            <div class="filter_view">
                Count : {{searched_applicants.length}}
            </div>
            <label class="mr">Date Applied</label>
            <el-date-picker v-model="date_range" type="daterange" class= "date-editor" align="right" placeholder="Pick a range"
                            :picker-options="picker_options" @change="changeDateRange">
            </el-date-picker>
        </div>
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
            <el-table-column
                    prop="date_verified"
                    label="DATE VERIFIED"
                    :formatter="formatTime"
                    sortable
            ></el-table-column>
            <el-table-column prop="application_type" label="APPLICATION TYPE"></el-table-column>
            <el-table-column prop="vendor_type" label="Vendor Type" sortable
                             :formatter="getVendorType"></el-table-column>

            <el-table-column prop="status" label="STATUS">
                <template scope="scope">
                    <span>Inconsistent</span>
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
    import ListMxn from "../../mixins/list_mixin.js";

    export default {
        name: "inconsistencies_list",
        mixins: [ListMxn],
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
                pagination_limit: 40,
                pagination_page: 1,
                loading: false,
                vendor_types: VENDOR_TYPES
            };
        },
        beforeMount() {
            this.getApplicants();
            setInterval(() => {
                this.getApplicantsBackground();
            }, 600000);
        },
        methods: {
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
                axios
                    .post(PARTNER_BASE_URL + "peleza/applications/list_reviewed/", payload)
                    .then(response => {
                        vm.applicants = response.data.data.partner_list;
                    })
                    .catch(error => {
                        log(error);
                        throw new Error("Could not get applicants");
                    });
            },
            startVerification(d) {
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
                                review_status: false
                            },
                        criminal_records_check: d.criminal_records_check
                            ? JSON.parse(d.criminal_records_check)
                            : {
                                applicant_name: "",
                                criminal_history: "",
                                authenticity: "",
                                id_no: "",
                                ref_no: "",
                                review_status: d.application_type == "Owner" ? true : false
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
                                review_status: d.application_type == "Owner" ? true : false
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
                                review_status: d.application_type == "Driver" ? true : false
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
                                review_status: d.application_type == "Driver" ? true : false
                            },
                        kra_pin_verification: d.kra_pin_verification
                            ? JSON.parse(d.kra_pin_verification)
                            : {
                                validity: "",
                                name: "",
                                pin_number: "",
                                tax_obligations: "",
                                registration_date: "",
                                review_status: false
                            }
                    }
                };

                this.$store.commit("changeVerification", verification);
                this.$router.push({name: "applicant", params: {id: d.id}});
            },
            getApplicants() {
                let vm = this;
                vm.loading = true;
                axios
                    .post(
                        PARTNER_BASE_URL + "peleza/applications/list_reviewed/", {
                            limit: "all",
                            stage: -1,
                            state: "all",
                            from: this.date_range[0],
                            to: this.date_range[1]
                        })
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
                        throw new Error("Could not get applicants");
                    });
            },

        },
        computed: {}
    };
</script>
<style>
    @import "../../assets/style/list.css";

    .stageone__filters {
        float: right;
        margin-bottom: 15px !important;
        width: 65%;
        display: inline-block;
        text-align: right;
        margin-top: -85px;
    }

    .filter_view {
        width: 60px;
        padding: 12px;
        float: left;
        margin-left: 15px;
        border-radius: 5px;
        color: white;
        font-size: 14px;
        background-color: #1E7FC3;
        display: inline-block !important;

    }
    .date-editor {
        width: 25% !important;
    }
</style>
