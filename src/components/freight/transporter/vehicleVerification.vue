<template>
<div class="applicant-details__data_holder">
     <el-collapse class="verification-collapse" v-model="accordionActiveName">
                <div class="applicant--details-wrap">
                    <el-collapse-item class="verification-wrap" :name="`motor_verification_${index}`">
                        <template slot="title">
                            <span>Motor Vehicle Records Check</span>
                        </template>
                        <el-form>
                            <el-form-item label="Ownership Details and Address">
                            <el-input type="textarea" :rows="4" v-model="motorVehicle.ownership_details" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Vehicle Make">
                            <el-input v-model="motorVehicle.make" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Vehicle Body Type">
                            <el-input v-model="motorVehicle.body_type" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Engine No">
                            <el-input v-model="motorVehicle.engine_no" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Chasis No">
                            <el-input v-model="motorVehicle.chasis_no" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Caveats">
                            <el-input v-model="motorVehicle.caveats" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item>
                            <el-button type="primary" class="details-save-button" @click="createReviewData('motor_vehicle_records_check',index, 'Motor Vehicle Records Check')">SAVE</el-button>
                            </el-form-item>
                        </el-form>
                        <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                            <el-form-item> <el-checkbox v-model="motorVehicle.inconsistency" id="identity_inconsistency" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </div>
                <div class="applicant--details-wrap">
                    <el-collapse-item class="verification-wrap" :name="`insurance_verification_${index}`">
                        <template slot="title">
                            <span>Car Insurance Validity </span>
                        </template>
                         <el-form>
                            <div id="print" class="el-row" v-show="this.transporterData.application_type !== 'Driver'">
                            <div class="review-consent-text">I, {{ isBusiness ? transporterData.company_name : transporterData.name }} ( {{ isBusiness ? 'Company Reg No.': 'ID Number' }} {{ isBusiness ? transporterData.company_reg_no : transporterData.id_no }}), {{ this.appendConsentText() }}</div>


                            <div>
                                <b class="insurance-label">Insurance Company:</b>
                                <span class="insurance-value">{{ vehicle.insurance_name }}</span>
                            </div>
                            <div>
                                <b class="insurance-label">Insurance Cert Number:</b>
                                {{ vehicle.insurance_number }}
                            </div>
                            <div class="review-list">
                                <b class="insurance-label">Policy Number:</b>
                                {{ vehicle.policy_number }}
                            </div>
                            <hr class="insurance-divider" />
                            <b class="insurance-subtitle">Authorization to verify Insurance Certificate: <span class="insurance-acceptance">Accepted</span></b>
                            <div class="no-print">
                            </div>
                            <hr class="insurance-divider" />
                            </div>
                            <el-form-item label="Name of Owner">
                            <el-input v-model="insurance.owner_name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="Vehicle Number Plate">
                            <el-input v-model="insurance.vehicle_number_plate" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Issue Date">
                            <el-date-picker v-model="insurance.issue_date" type="date" popper-class="date-popup" placeholder="Issue Date"></el-date-picker>
                            </el-form-item>

                            <el-form-item label="Expiry Date">
                            <el-date-picker v-model="insurance.expiry_date" type="date" popper-class="date-popup" placeholder="Expiry Date"></el-date-picker>
                            </el-form-item>

                            <el-form-item label="Validity">
                            <el-input v-model="insurance.validity" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Policy Number">
                            <el-input v-model="insurance.policy_number" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Insurance Cert Number">
                            <el-input v-model="insurance.insurance_cert_number" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item>
                            <el-button type="primary" class="details-save-button" @click="createReviewData('car_insurance_validity',index, 'Car Insurance Validity Check', 'default')">SAVE</el-button>
                            </el-form-item>
                        </el-form>
                         <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                            <el-form-item> <el-checkbox v-model="insurance.inconsistency" id="identity_inconsistency" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </div>
     </el-collapse>
</div>
</template>

<script>
import DetailMxn from '../../../mixins/detail_mixin';

export default {
    name: 'VehicleVerification',
    mixins: [DetailMxn],

    props: ['vehicle', 'index', 'transporterData'],

    data() {
        return {
            accordionActiveName: 'motor_verification',
            motorReview: true,
            motorVehicle:
                {
                    ownership_details: '',
                    make: '',
                    body_type: '',
                    engine_no: '',
                    chasis_no: '',
                    manufacture_year: '',
                    caveats: '',
                    review_status: false,
                    inconsistency: false,
                },
            insurance:
                {
                    insurance_name: '',
                    insurance_number: '',
                    policy_number: '',
                    owner_name: '',
                    vehicle_number_plate: '',
                    issue_date: '',
                    expiry_date: '',
                    validity: '',
                    insurance_cert_number: '',
                    review_status: false,
                    inconsistency: false,
                },

        };
    },
    computed: {
          isBusiness() {
            return this.transporterData.application_type === 'Business';
        },
        isOwner() {
            return this.transporterData.application_type === 'Owner';
        },
         isDriver() {
            return this.transporterData.application_type === 'Driver';
        },
         isDriverOwner() {
            return this.transporterData.application_type === 'Driver and owner';
        },
         isPendingApplicant() {
            return this.current_route === 'transporter';
        },
         current_route() {
            return this.$route.name;
        },
    },
    methods: {
            isEmpty(obj) {
                    for (const prop in obj) {
                        // eslint-disable-next-line no-prototype-builtins
                        if (obj.hasOwnProperty(prop)) {
                        return false;
                        }
                    }
            return JSON.stringify(obj) === JSON.stringify({});
            },
           createReviewData(field, index, field_title = '') {
               this.motorVehicle.review_status = true;
               this.motorVehicle.vehicle_reg_no = this.vehicle.vehicle_reg_no;
               this.insurance.review_status = true;
               this.insurance.vehicle_reg_no = this.vehicle.vehicle_reg_no;

               const data = field === 'motor_vehicle_records_check' ? this.motorVehicle : this.insurance;
                data.section = field;
                data.field_title = field_title;


                 let vehicleArray = [];

                if (this.transporterData[field] === null || this.transporterData[field] === '' || (typeof this.transporterData[field] === 'string' && this.isEmpty(JSON.parse(this.transporterData[field])))) {
                    vehicleArray = [];
                } else {
                    vehicleArray = typeof this.transporterData[field] === 'string' ? JSON.parse(this.transporterData[field]) : this.transporterData[field];
                }

                 const index1 = this.transporterData[field] === null || this.transporterData[field] === '' || this.transporterData[field] === {} ? -1 : vehicleArray.findIndex(x => x.vehicle_reg_no === this.vehicle.vehicle_reg_no);


                 if (index1 === -1) {
                    vehicleArray.push(data);
                } else {
                    vehicleArray[index1] = data;
                }

                 this.transporterData[field] = vehicleArray;
                 this.$store.commit('changeVerification', this.transporterData);


               this.$emit('vehicleReview', { vehicleArray, section: field, title: field_title });
        },
    },

};
</script>

<style>

</style>
