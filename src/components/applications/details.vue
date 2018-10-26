<style>
    .el-radio {
        margin-left: 15px;
    }

    .applicant-details__back {
        margin-bottom: 20px;
        cursor: pointer;
        margin-top: -10px;

    }

    .applicant-details__back_image {
        width: 22px;
        display: inline-block;
    }

    .applicant-details__back_text {
        margin-top: 0px;
        display: inline-block;
        position: absolute;
        font-size: 20px;
        margin-left: 2px;
        font-weight: 300;
        text-transform: uppercase;
    }

    .applicant-details {
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 50px;
    }

    .applicant-details__profile {
        width: 30%;
        padding-right: 0px;
        margin-right: 15px;
        display: inline-block;
        float: left;

    }

    .applicant-details__profile_image {
        width: 100%;
        object-fit: cover;
        height: auto;
        max-height: 300px;
        margin-bottom: 15px;
    }

    .applicant-details__data {
        width: 65%;
        display: inline-block;
    }

    .applicant-details__profile_label {
        font-weight: 500;
        font-size: 15px;
        margin-left: 15px;
        margin-top: 15px;
    }

    .applicant-details__profile_value {
        font-weight: 300;
        font-size: 15px;
        margin-left: 15px;
        margin-top: 15px;
    }

    .el-card.applicant-details__profile__personal-details {
        overflow: hidden;
        border-radius: 20px;
        margin-bottom: 20px;
    }

    .el-collapse {
        border: none;
    }

    .el-collapse-item__header {
        margin: 5px;
        padding-top: 10px;
        padding-bottom: 20px;
        text-transform: uppercase;
        font-size: 15px;
        border: none;
    }

    .el-collapse-item is-active {
        margin-bottom: 20px;
        border: 1px solid #d1dbe5;
        border-radius: 15px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
    }

    .el-collapse-item {
        border: 1px solid #d1dbe5;
        border-radius: 15px;
        margin-bottom: 30px;
    }

    .el-collapse-item__wrap {
        margin-bottom: 30px;
        padding-top: 50px;
        margin-top: -20px;
        border-top: 1px solid #d1dbe5;
        background: transparent;
        border-bottom: none;
    }
    .details-save-button {
        float: right;
        margin-right: 5px;
        width:120px;
        height: 50px;

    }
    .el-date-editor.el-input {
        width: 100%;
    }

</style>
<template>
    <div class="applicant-details">
        <div class="applicant-details__back" @click="handleBack">
            <img src="../../assets/left-arrow.png" class="applicant-details__back_image"/>
            <div class="applicant-details__back_text">
                Back
            </div>
        </div>
        <div class="applicant-details__profile">
            <el-card class="applicant-details__profile__personal-details">
                <div class="applicant-details__profile_content">
                    <img :src="applicant_details.driver_photo" class="applicant-details__profile_image"/>

                    <div class="applicant-details__profile_row">
                        <div class="applicant-details__profile_label">
                            ID NUMBER
                        </div>
                        <div class="applicant-details__profile_value">
                            {{applicant_details.id_no}}
                        </div>
                    </div>

                    <div class="applicant-details__profile_row">
                        <div class="applicant-details__profile_label">
                            KRA PIN
                        </div>
                        <div class="applicant-details__profile_value">
                            {{applicant_details.kra_pin}}
                        </div>
                    </div>
                    <div class="applicant-details__profile_row">
                        <div class="applicant-details__profile_label">
                            DATE OF APPLICATION
                        </div>
                        <div class="applicant-details__profile_value">
                            {{applicant_details.date_created}}
                        </div>
                    </div>

                    <div class="applicant-details__profile_row">
                        <div class="applicant-details__profile_label">
                            STATUS
                        </div>
                        <div class="applicant-details__profile_value">
                            Applied
                        </div>
                    </div>

                </div>
            </el-card>
            <el-card header="Activity Log" class="applicant-details__profile__personal-details">

            </el-card>
        </div>
        <div class="applicant-details__data">
            <el-collapse v-model="accordionActiveName" accordion>
                <el-collapse-item name="1">
                    <template slot="title">
                    <span style="">
                        Identity Check
                    </span>

                        <span style="float: right; padding-right: 10px">
                        ID Number : {{applicant_details.id_no}}
                    </span>

                    </template>

                    <el-form :model="verification_details.identity_check">
                        <el-form-item label="Name of Applicant" :label-width="'25%'">
                            <el-input v-model="verification_details.identity_check.applicant_name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Date of Birth" :label-width="'25%'">
                             <el-date-picker
                              v-model="verification_details.identity_check.dob"
                              type="date"
                              placeholder="Date of Birth">
                             </el-date-picker>
                        </el-form-item>


                        <el-form-item label="Place of Birth" :label-width="'25%'">
                            <el-input v-model="verification_details.identity_check.pob" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Gender" :label-width="'25%'">
                            <el-input v-model="verification_details.identity_check.gender" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Attach Id Card" :label-width="'25%'">
                            <el-input v-model="verification_details.identity_check.id_card" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button" @click="updateReview('identity_check', 'Identity Check')">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>

                </el-collapse-item>
                <el-collapse-item title="Criminal Records Check" name="2">
                    <el-form :model="verification_details.criminal_records_check">
                        <el-form-item label="Name of Applicant" :label-width="'25%'">
                            <el-input v-model="verification_details.criminal_records_check.applicant_name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Criminal History" :label-width="'25%'">
                            <el-input v-model="verification_details.criminal_records_check.criminal_history" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Authenticity" :label-width="'25%'">
                            <el-input v-model="verification_details.criminal_records_check.authenticity" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Id Number" :label-width="'25%'">
                            <el-input v-model="verification_details.criminal_records_check.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Refrence Number" :label-width="'25%'">
                            <el-input v-model="verification_details.criminal_records_check.ref_no" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button" @click="updateReview('criminal_records_check', 'Criminal Records Check')">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="Driving License Check" name="3">

                   <el-form :model="verification_details.driving_license_check">
                        <el-form-item label="Name of Applicant" :label-width="'25%'">
                            <el-input v-model="verification_details.driving_license_check.applicant_name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="DL Number" :label-width="'25%'">
                            <el-input v-model="verification_details.driving_license_check.dl_no" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Date of Issue" :label-width="'25%'">
                             <el-date-picker
                              v-model="verification_details.motor_vehicle_records_check.date_of_issue"
                              type="date"
                              placeholder="Date of Issue">
                       </el-date-picker>
                        </el-form-item>

                        <el-form-item label="Expiry Date" :label-width="'25%'">
                             <el-date-picker
                              v-model="verification_details.motor_vehicle_records_check.expiry_date"
                              type="date"
                              placeholder="Expiry Date">
                             </el-date-picker>
                        </el-form-item>



                        <el-form-item label="Classes" :label-width="'25%'">
                            <el-input v-model="verification_details.driving_license_check.classes" auto-complete="off"></el-input>
                        </el-form-item>

                       <el-form-item label="Id Number" :label-width="'25%'">
                            <el-input v-model="verification_details.driving_license_check.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button" @click="updateReview('driving_license_check', 'Driving License Check')">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item name="4">
                    <template slot="title">
                     <span>
                         Motor Vehicle Records Check
                     </span>
                        <span style="float: right; padding-right: 10px">
                           Number Plate : {{applicant_details.vehicle_reg_no}}
                      </span>
                    </template>

                    <el-form :model="verification_details.motor_vehicle_records_check">
                        <el-form-item label="Ownership Details and Address" :label-width="'25%'">
                            <el-input v-model="verification_details.motor_vehicle_records_check.ownership_details" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Vehicle Insurance Validity" :label-width="'25%'">
                            <el-input v-model="verification_details.motor_vehicle_records_check.insurance_validity" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Vehicle Make" :label-width="'25%'">
                            <el-input v-model="verification_details.motor_vehicle_records_check.make" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Vehicle Body Type" :label-width="'25%'">
                            <el-input v-model="verification_details.motor_vehicle_records_check.body_type" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Engine No" :label-width="'25%'">
                            <el-input v-model="verification_details.motor_vehicle_records_check.engine_no" auto-complete="off"></el-input>
                        </el-form-item>

                       <el-form-item label="Year of Manufacture" :label-width="'25%'">
                             <el-date-picker
                              v-model="verification_details.motor_vehicle_records_check.manufacture_year"
                              type="year"
                              placeholder="Year of Manufacture">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="Caveats" :label-width="'25%'">
                            <el-input v-model="verification_details.motor_vehicle_records_check.caveats" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="KRA Pin Number of Owner" :label-width="'25%'">
                            <el-input v-model="verification_details.motor_vehicle_records_check.owner_kra" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button" @click="updateReview('motor_vehicle_records_check', 'Motor Vehicle Records Check')">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="Car Insurance Validity" name="5">

                     <el-form :model="verification_details.car_insurance_validity">
                        <el-form-item label="Name of Owner" :label-width="'25%'">
                            <el-input v-model="verification_details.car_insurance_validity.owner_name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Vehicle Number Plate" :label-width="'25%'">
                            <el-input v-model="verification_details.car_insurance_validity.vehicle_number_plate" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Issue Date" :label-width="'25%'">
                            <el-date-picker
                              v-model="verification_details.car_insurance_validity.issue_date"
                              type="date"
                              placeholder="Issue Date">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="Expiry Date" :label-width="'25%'">
                            <el-date-picker
                              v-model="verification_details.car_insurance_validity.expiry_date"
                              type="date"
                              placeholder="Expiry Date">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="Validity" :label-width="'25%'">
                            <el-input v-model="verification_details.car_insurance_validity.validty" auto-complete="off"></el-input>
                        </el-form-item>

                       <el-form-item label="Policy Number" :label-width="'25%'">
                            <el-input v-model="verification_details.car_insurance_validity.policy_number" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button" @click="updateReview('car_insurance_validity', 'Car Insurance Validity Check')" >
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item name="6">
                    <template slot="title">
                     <span>
                        KRA PIN Verification
                     </span>
                        <span style="float: right; padding-right: 10px">
                         KRA PIN NUMBER : {{applicant_details.kra_pin}}
                      </span>
                    </template>

                    <el-form :model="verification_details.kra_pin_verification">
                        <el-form-item label="Validity" :label-width="'25%'">
                            <el-input v-model="verification_details.kra_pin_verification.validity" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Name" :label-width="'25%'">
                            <el-input v-model="verification_details.kra_pin_verification.name" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Pin Number" :label-width="'25%'">
                            <el-input v-model="verification_details.kra_pin_verification.pin_number" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Tax Obligations" :label-width="'25%'">
                            <el-input v-model="verification_details.kra_pin_verification.tax_obligations" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Date of Registration" :label-width="'25%'">
                         <el-date-picker
                              v-model="verification_details.kra_pin_verification.registration_date"
                              type="date"
                              placeholder="Date of Registration">
                            </el-date-picker>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button" @click="updateReview('kra_pin_verification', 'KRA Pin Verification')">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item name="7">
                    <template slot="title">
                     <span>
                        Next Of Kin
                     </span>
                        <span style="float: right; padding-right: 10px">
                         ID NUMBER : {{applicant_details.nok_id}}
                      </span>
                    </template>

                    <el-form :model="verification_details.next_of_kin">
                        <el-form-item label="Name of Next of Kin" :label-width="'25%'">
                            <el-input v-model="verification_details.next_of_kin.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Date of Birth" :label-width="'25%'">
                            <el-date-picker
                              v-model="verification_details.next_of_kin.dob"
                              type="date"
                              placeholder="Date of Birth">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="Where they Hail From" :label-width="'25%'">
                            <el-input v-model="verification_details.next_of_kin.pob" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Gender" :label-width="'25%'">
                            <el-input v-model="verification_details.next_of_kin.gender" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button" @click="updateReview('next_of_kin', 'Next of Kin')">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>

            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'applicant-details',
        props: ['data', 'docs'],
        data() {
            return {
                vendor_types: VENDOR_TYPES,
                comments: "",
                popover_visible: false,
                reason: "",
                lock_ui: false,
                valid_docs: [],
                invalid_docs: [],
                current_verification: this.$store.getters.current_verification,
                applicant_details: {},
                verification_details: {},
                accordionActiveName:'identity_check'
            }
        },
        beforeMount() {
            this.applicant_details = this.current_verification.applicant_details;
            this.verification_details = this.current_verification.verification_details;


        },
        methods: {
            updateReview(field, field_title =''){
                //update store
                let verification = {
                    'applicant_details':this.applicant_details,
                    'verification_details':this.verification_details
                }

                let review_json = this.verification_details[field];

                //update db

                let payload = {
                    review_section: field,
                    review_json: JSON.stringify(review_json),
                    partner_id: this.applicant_details.partner_id,
                    partner_id_no: this.applicant_details.id_no
                };

                axios.post(PARTNER_BASE_URL + 'peleza/applications/update_review', JSON.stringify(payload))
                    .then((response) => {
                        console.log(response);

                    })
                    .catch((error) => {
                        throw new Error('Could not update applicant');
                    })



                this.$store.commit('changeVerification', verification);
                 this.$notify.success({
                  title: "update "+field_title,
                  message: "applicant "+field_title+" updated successfully"
                });

            },
            handleBack() {
                 this.$router.push({ name: 'applications'});
            }
        },
        computed: {

        },
        watch: {

        }
    }
</script>
