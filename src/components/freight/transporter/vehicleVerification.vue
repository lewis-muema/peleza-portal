<template>
<div class="applicant-details__data_holder" :key="componentKey">
     <el-collapse class="verification-collapse" v-model="accordionActiveName">
                <div class="applicant--details-wrap">
                    <el-collapse-item class="verification-wrap" :name="`motor_verification_${index}`">
                        <template slot="title">
                            <span>Motor Vehicle Records Check</span>
                        </template>
                        <el-form v-if="!motorVehicleStatus">
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
                        <div v-if="motorVehicleStatus" class="el-col-lg-16 review-details">
                            <div class="el-row">
                                <div class="review-title">Ownership Details and Address</div>
                                <div class="review-desc">{{ motorCheck === null ? 'N/A' : motorCheck.ownership_details }}</div>

                            </div>
                            <div class="el-row">
                                <div class="review-title">Vehicle Make</div>
                                <div class="review-desc">{{ motorCheck === null ? 'N/A' : motorCheck.make }}</div>

                            </div>
                            <div class="el-row">
                                <div class="review-title">Vehicle Body Type</div>
                                <div class="review-desc">{{ motorCheck === null ? 'N/A' : motorCheck.body_type }}</div>

                            </div>
                            <div class="el-row">
                                <div class="review-title">Engine No</div>
                                <div class="review-desc">{{ motorCheck === null ? 'N/A' : motorCheck.engine_no }}</div>

                            </div>
                            <div class="el-row">
                                <div class="review-title">Chasis No</div>
                                <div class="review-desc">{{ motorCheck === null ? 'N/A' : motorCheck.chasis_no }}</div>

                            </div>
                            <div class="el-row">
                                <div class="review-title">Caveats</div>
                                <div class="review-desc">{{ motorCheck === null ? 'N/A' : motorCheck.caveats }}</div>
                            </div>
                        </div>
                        <div class="el-col-lg-8 review-image" v-if="transporterData.review_status === 0 || transporterData.review_status === null || transporterData.review_status === 2">
                            <div class="review-edit" v-show="motorVehicleStatus" @click="handleReviewEdit('motor_vehicle_records_check')">Edit</div>
                        </div>
                        <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant && !motorVehicleStatus">
                            <el-form-item> <el-checkbox v-model="motorVehicle.inconsistency" id="identity_inconsistency" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
                         <div class="applicant--incosistency-mark" v-if="motorVehicleStatus && motorVehicle.inconsistency">
                            Marked for Data Inconsistency
                        </div>
                    </el-collapse-item>
                </div>
                <div class="applicant--details-wrap">
                    <el-collapse-item class="verification-wrap" :name="`insurance_verification_${index}`">
                        <template slot="title">
                            <span>Car Insurance Validity </span>
                        </template>
                         <el-form v-if="!insuranceVehicleStatus">
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
                        <div class="el-col-lg-24 review-details" v-if="insuranceVehicleStatus">
                            <div id="print" class="el-row">
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
                                    <el-button type="primary" class="details-print-button" @click="printInsurance">Print Authorisation</el-button>
                                </div>
                                <hr class="insurance-divider" />
                                <hr />
                            </div>
                            <div class="el-row">
                                <div class="review-title">Name of Owner</div>
                                <div class="review-desc">{{ insuranceCheck === null ? 'N/A' : insuranceCheck.owner_name }}</div>

                            </div>
                            <div class="el-row">
                                <div class="review-title">Vehicle Number Plate</div>
                                <div class="review-desc">{{ insuranceCheck === null ? 'N/A' : insuranceCheck.vehicle_number_plate }}</div>
                            </div>
                            <div class="el-row">
                            <div class="review-title">Issue Date</div>
                                <div class="review-desc">{{ insuranceCheck === null || typeof insuranceCheck.issue_date === 'undefined' ? 'N/A' : formatDate(insuranceCheck.issue_date) }}</div>

                            </div>
                            <div class="el-row">
                                <div class="review-title">Expiry Date</div>
                                <div class="review-desc">{{ insuranceCheck === null || typeof insuranceCheck.expiry_date === 'undefined' ? 'N/A' : formatDate(insuranceCheck.expiry_date) }}</div>
                            </div>
                            <div class="el-row">
                                <div class="review-title">Validity</div>
                                <div class="review-desc">{{ insuranceCheck === null ? 'N/A' : insuranceCheck.validity }}</div>

                            </div>
                            <div class="el-row">
                                <div class="review-title">Policy Number</div>
                                <div class="review-desc">{{ insuranceCheck === null ? 'N/A' : insuranceCheck.policy_number }}</div>
                            </div>
                            <div class="el-row">
                            <div class="review-title">Insurance Cert Number</div>
                                <div class="review-desc">{{ insuranceCheck === null ? 'N/A' : insuranceCheck.insurance_cert_number }}</div>

                            </div>
                        </div>
                        <div class="el-col-lg-7 review-image" v-if="transporterData.review_status === 0 || transporterData.review_status === null || transporterData.review_status === 2">
                            <div class="review-edit applicant-edit2" @click="handleReviewEdit('car_insurance_validity')" v-if="insuranceVehicleStatus">Edit</div>
                        </div>
                         <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant && !insuranceVehicleStatus">
                            <el-form-item> <el-checkbox v-model="insurance.inconsistency" id="identity_inconsistency" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
                         <div class="applicant--incosistency-mark" v-if="insuranceVehicleStatus && insuranceCheck.inconsistency">
                            Marked for Data Inconsistency
                        </div>
                    </el-collapse-item>
                </div>
     </el-collapse>
</div>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { mapGetters, mapMutations } from 'vuex';

import DetailMxn from '../../../mixins/detail_mixin';
import TimezoneMxn from '../../../mixins/timezone_mixin';


export default {
    name: 'VehicleVerification',
    mixins: [DetailMxn, TimezoneMxn],

    props: ['vehicle', 'index', 'transporterData'],

    data() {
        return {
            accordionActiveName: 'motor_verification',
            motorReview: true,
            componentKey: this.index,
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
            motorVehicleStatus: false,
            motorCheck: null,
            insuranceCheck: null,
            insuranceVehicleStatus: false,

        };
    },
    computed: {
        ...mapGetters({ getUpdateStatus: 'getUpdateStatus' }),

         motorVehicleReview() {
             if (this.transporterData.motor_vehicle_records_check === null || this.transporterData.motor_vehicle_records_check === '') {
                    this.motorCheck = null;
                } else {
                    const data = typeof this.transporterData.motor_vehicle_records_check === 'string' ? JSON.parse(this.transporterData.motor_vehicle_records_check) : this.transporterData.motor_vehicle_records_check;

                    const verifiedVehicle = data.filter((elem) => {
                        if (elem.vehicle_reg_no === this.transporterData.vehicle[this.index].vehicle_reg_no) return elem;
                    });

                    this.motorCheck = typeof verifiedVehicle !== 'undefined' ? verifiedVehicle : [];
                    this.motorCheck = this.motorCheck.length === 0 ? null : this.motorCheck[0];
                }
                this.motorVehicleStatus = this.motorCheck !== null;

            return this.motorCheck;
        },
           insuranceReview() {
             if (this.transporterData.car_insurance_validity === null || this.transporterData.car_insurance_validity === '') {
                    this.insuranceCheck = null;
                } else {
                    const data = typeof this.transporterData.car_insurance_validity === 'string' ? JSON.parse(this.transporterData.car_insurance_validity) : this.transporterData.car_insurance_validity;


                     const verifiedVehicle = Object.keys(data).length === 0 ? [] : data.filter((elem) => {
                        if (elem.vehicle_reg_no === this.transporterData.vehicle[this.index].vehicle_reg_no) return elem;
                    });

                    this.insuranceCheck = typeof verifiedVehicle !== 'undefined' ? verifiedVehicle : [];
                    this.insuranceCheck = this.insuranceCheck.length === 0 ? null : this.insuranceCheck[0];
                }

                this.insuranceVehicleStatus = this.insuranceCheck !== null;

            return this.insuranceCheck;
        },
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
            return this.transporterData.application_type === 'Driver and 0wner';
        },
         isPendingApplicant() {
            return this.current_route === 'transporter';
        },
         current_route() {
            return this.$route.name;
        },
    },
      watch: {

         getUpdateStatus(status) {
               this.motorCheck = this.motorVehicleReview;
                this.insuranceCheck = this.insuranceReview;
                this.forceRerender();
         },
     },
      mounted() {
        this.motorCheck = this.motorVehicleReview;
        this.insuranceCheck = this.insuranceReview;

        if (this.motorCheck !== null) {
             this.motorVehicle = {
                    ownership_details: this.motorCheck.ownership_details,
                    make: this.motorCheck.make,
                    body_type: this.motorCheck.body_type,
                    engine_no: this.motorCheck.engine_no,
                    chasis_no: this.motorCheck.chasis_no,
                    manufacture_year: this.motorCheck.manufacture_year,
                    caveats: this.motorCheck.caveats,
                    review_status: this.motorCheck.review_status,
                    inconsistency: this.motorCheck.inconsistency,
                };
        }
        if (this.insuranceCheck !== null) {
            this.insurance = {
                    insurance_name: this.insuranceCheck.insurance_name,
                    insurance_number: this.insuranceCheck.insurance_number,
                    policy_number: this.insuranceCheck.policy_number,
                    owner_name: this.insuranceCheck.owner_name,
                    vehicle_number_plate: this.insuranceCheck.vehicle_number_plate,
                    issue_date: this.insuranceCheck.issue_date,
                    expiry_date: this.insuranceCheck.expiry_date,
                    validity: this.insuranceCheck.validity,
                    insurance_cert_number: this.insuranceCheck.insurance_cert_number,
                    review_status: this.insuranceCheck.review_status,
                    inconsistency: this.insuranceCheck.inconsistency,
                };
        }
    },
    methods: {
           forceRerender() {
            this.componentKey += 1;
            },
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
         handleReviewEdit(section) {
             if (section === 'motor_vehicle_records_check') {
                this.motorVehicleStatus = false;
             } else {
                this.insuranceVehicleStatus = false;
             }
         },
          printInsurance() {
            const prtHtml = document.getElementById('print').innerHTML;
            let stylesHtml = '';
            for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
                stylesHtml += node.outerHTML;
            }
            const WinPrint = window.open('', '', 'left=0,top=0,margin-top=30000px,width=800,height=900,toolbar=0,scrollbars=0,status=0');
            WinPrint.document.write(`<!DOCTYPE html>
            <html>
                <head>
                ${stylesHtml}
                </head>
                <body>
                ${prtHtml}
                </body>
            </html>`);

            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();
            },
    },

};
</script>

<style>

</style>
