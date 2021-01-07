<template>
  <div class="applicant-details__data">
        <errorHandler :error="errorObj" v-if="errorObj" />
        <div class="applicant-details__data_holder">
            <el-card class="applicant-details__profile__personal-details verification-content">
                <span class="verification-header">Verify Transporter Details</span>
            </el-card>
            <el-collapse class="verification-collapse" v-model="accordionActiveName">
                <div class="applicant--details-wrap" v-if="transporterData.application_type !== 'Business'">
                    <el-collapse-item name="1" class="verification-wrap">
                        <template slot="title">
                            <span>National Identity Check</span>
                            <span class="marked-inconsistent" v-if="transporterData.identity_check !== null && current_route === 'transporter-inconsistency'">Marked for Inconsistencies</span>
                            <span class="applicant-details__idNo"> ID number: {{ transporterData.id_no === null ? 'N/A' : transporterData.id_no }} </span>
                        </template>
                         <el-form v-if="!identityReview">
                            <el-form-item label="Name of Applicant">
                            <el-input v-model="identity.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="Date of Birth">
                            <el-date-picker v-model="identity.dob" type="date" onkeydown="return false;" popper-class="date-popup" placeholder="Date of Birth"></el-date-picker>
                            </el-form-item>

                            <el-form-item label="Place of Birth">
                            <el-input type="textarea" :rows="4" v-model="identity.pob" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Gender">
                            <el-select v-model="identity.gender" auto-complete="off">
                                <el-option value="Male">Male</el-option>
                                <el-option value="Female">Female</el-option>
                            </el-select>
                            </el-form-item>
                            <el-form-item>
                            <el-button type="primary" class="details-save-button" @click="updateReview('identity_check', 'Identity Check')">SAVE</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="review_wrap" v-if="identityReview">
                            <div class="el-row">
                            <div class="el-col-lg-16 review-details">
                                <div class="el-row">
                                <div class="review-title">Name of Applicant</div>
                                <div class="review-desc">{{ transporterData.identity_check === null ? 'N/A' : transporterData.identity_check.name }}</div>
                                </div>
                                <div class="el-row">
                                <div class="review-title">Date of Birth</div>
                                <div class="review-desc">{{ transporterData.identity_check === null ? 'N/A' : formatDate(transporterData.identity_check.dob) }}</div>
                                </div>
                                <div class="el-row">
                                <div class="review-title">Place of Birth</div>
                                <div class="review-desc">{{ transporterData.identity_check === null ? 'N/A' : transporterData.identity_check.pob }}</div>
                                </div>
                                <div class="el-row">
                                <div class="review-title">Gender</div>
                                <div class="review-desc">{{ transporterData.identity_check === null ? 'N/A' : this.transporterData.identity_check.gender }}</div>
                                </div>
                            </div>
                            <div class="el-col-lg-8 review-image">
                                <div class="review-edit" @click="handleReviewEdit('identity_check')">Edit</div>
                            </div>
                            </div>
                        </div>
                        <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant && !identityReview">
                            <el-form-item> <el-checkbox v-model="identity_inconsistency" id="identity_inconsistency" @change="setVerificationData('identity_check', 'inconsistency')" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
                        <div class="applicant--incosistency-mark" v-if="identityReview && transporterData.identity_check.inconsistency">
                            Marked for Data Inconsistency
                        </div>
                    </el-collapse-item>
                </div>
                <div class="applicant--details-wrap" v-if="transporterData.application_type === 'Business'">
                    <el-collapse-item name="1" class="verification-wrap">
                        <template slot="title">
                            <span>Company Registration Check</span>
                            <span class="marked-inconsistent" v-if="transporterData.company_details_check !== null && transporterData.company_details_check.inconsistency !== 'undefined' && transporterData.company_details_check.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                            <span class="applicant-details__idNo"> Registration number: {{ transporterData.company_reg_no === null ? 'N/A' : transporterData.company_reg_no }} </span>
                        </template>
                        <el-form v-if="!companyReview">
                            <el-form-item label="Company Name">
                                <el-input v-model="company_name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="Company registration number">
                                <el-input v-model="company_reg" auto-complete="off"></el-input>
                            </el-form-item>
                             <el-form-item label="Company address">
                                <el-input type="textarea" :rows="4" v-model="address" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="details-save-button" @click="updateReview('company_details_check', 'Company Details Verification')">SAVE</el-button>
                            </el-form-item>
                        </el-form>
                         <div class="review_wrap" v-if="companyReview">
                            <div class="el-row">
                            <div class="el-col-lg-16 review-details">
                                <div class="el-row" >
                                    <div class="review-title">Company Name</div>
                                    <div class="review-desc">{{ companyCheck === null ? 'N/A' : companyCheck.company_name }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Company registration number</div>
                                    <div class="review-desc">{{ companyCheck === null ? 'N/A' : companyCheck.company_reg_no }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Company Address</div>
                                    <div class="review-desc">{{ companyCheck === null ? 'N/A' : companyCheck.address }}</div>
                                </div>
                            </div>
                            <div class="el-col-lg-8 review-image">
                                <div class="review-edit" @click="handleReviewEdit('company_details_check')">Edit</div>
                            </div>
                            </div>
                        </div>
                         <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant && !companyReview">
                            <el-form-item> <el-checkbox v-model="company_inconsistency" id="identity_inconsistency" @change="setVerificationData('company_details_check', 'inconsistency')" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
                        <div class="applicant--incosistency-mark" v-if="companyReview && companyCheck.inconsistency">
                            Marked for Data Inconsistency
                        </div>
                    </el-collapse-item>
                </div>
                <div class="applicant--details-wrap" v-if="transporterData.application_type === 'Driver and Owner' || transporterData.application_type === 'Driver and owner'">
                    <el-collapse-item name="license" class="verification-wrap">
                        <template slot="title">
                            <span>Driving License Check</span>
                            <span class="marked-inconsistent" v-if="transporterData.driving_license_check !== null && current_route === 'transporter-inconsistency'">Marked for Inconsistencies</span>
                        </template>
                        <el-form v-if="!drivingReview">
                            <el-form-item label="Name of Applicant">
                            <el-input v-model="drivingLicense.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="DL Number">
                            <el-input v-model="drivingLicense.dl_no" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="Date of Issue">
                            <el-date-picker v-model="drivingLicense.date_of_issue" onkeydown="return false;" onkeyup="return false;" type="date" popper-class="date date- date-popup" placeholder="Date of Issue"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="Expiry Date">
                            <el-date-picker v-model="drivingLicense.expiry_date" onkeydown="return false;" onkeyup="return false;" type="date" popper-class="date-popup" placeholder="Expiry Date"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="Classes">
                            <el-input v-model="drivingLicense.classes" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="Id Number">
                            <el-input v-model="drivingLicense.id_no" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                            <el-button type="primary" class="details-save-button" @click="updateReview('driving_license_check', 'Driving License Check')">SAVE</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="el-row" v-if="drivingReview">
                            <div class="el-col-lg-16 review-details">
                            <div class="el-row">
                                <div class="review-title">Name of Applicant</div>
                                <div class="review-desc">{{ transporterData.driving_license_check === null ? 'N/A' : transporterData.driving_license_check.name }}</div>
                            </div>
                            <div class="el-row">
                                <div class="review-title">DL Number</div>
                                <div class="review-desc">{{ transporterData.driving_license_check === null ? 'N/A' : transporterData.driving_license_check.dl_no }}</div>
                            </div>
                            <div class="el-row">
                                <div class="review-title">Date of Issue</div>
                                <div class="review-desc">{{ transporterData.driving_license_check === null || typeof transporterData.driving_license_check.date_of_issue === 'undefined' ? 'N/A' : formatDate(transporterData.driving_license_check.date_of_issue) }}</div>
                            </div>
                            <div class="el-row">
                                <div class="review-title">Expiry Date</div>
                                <div class="review-desc">{{ transporterData.driving_license_check === null || typeof transporterData.driving_license_check.expiry_date === 'undefined' ? 'N/A' : formatDate(transporterData.driving_license_check.expiry_date) }}</div>
                            </div>
                            <div class="el-row">
                                <div class="review-title">Classes</div>
                                <div class="review-desc">{{ transporterData.driving_license_check === null ? 'N/A' : transporterData.driving_license_check.classes }}</div>
                            </div>
                            <div class="el-row">
                                <div class="review-title">ID Number</div>
                                <div class="review-desc">{{ transporterData.driving_license_check === null ? 'N/A' : transporterData.driving_license_check.id_no }}</div>
                            </div>
                            </div>
                            <div class="el-col-lg-8 review-image">
                            <div class="review-edit" @click="handleReviewEdit('driving_license_check')">Edit</div>
                            </div>
                        </div>
                         <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant && !drivingReview">
                            <el-form-item> <el-checkbox v-model="license_inconsistency" id="identity_inconsistency" @change="setVerificationData('driving_license_check', 'inconsistency')" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
                        <div class="applicant--incosistency-mark" v-if="drivingReview && transporterData.driving_license_check.inconsistency">
                            Marked for Data Inconsistency
                        </div>

                    </el-collapse-item>
                </div>
                 <div class="applicant--details-wrap">
                    <el-collapse-item name="3" class="verification-wrap">
                        <template slot="title">
                            <span>{{ taxPayerNameIdentifier }} Verification</span>
                            <span class="marked-inconsistent" v-if="transporterData.kra_pin_verification !== null && transporterData.kra_pin_verification.inconsistency !== 'undefined' && transporterData.kra_pin_verification.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                            <span class="applicant-details__idNo"> {{ taxPayerNameIdentifier }}: {{ transporterData.kra_pin === null ? 'N/A' : transporterData.kra_pin }} </span>
                        </template>
                        <el-form v-if="!taxReview">
                            <el-form-item label="Validity">
                                <el-input v-model="validity" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="Name">
                                <el-input v-model="tax_name" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="PIN/TIN Number">
                                <el-input v-model="pin_number" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Tax Obligations">
                                <el-input v-model="tax_obligations" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Date of Registration">
                                <el-date-picker v-model="registration_date" onkeydown="return false;" type="date" popper-class="date-popup" placeholder="Date of Registration"></el-date-picker>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" class="details-save-button" @click="updateReview('kra_pin_verification', `${taxPayerNameIdentifier} Verification`)">SAVE</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="review_wrap" v-if="taxReview">
                            <div class="el-row">
                            <div class="el-col-lg-16 review-details">
                                <div class="el-row" >
                                    <div class="review-title">Validity</div>
                                    <div class="review-desc">{{ taxCheck === null ? 'N/A' : taxCheck.validity }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Name</div>
                                    <div class="review-desc">{{ taxCheck === null ? 'N/A' : taxCheck.tax_name }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">{{ taxPayerNameIdentifier }} Number</div>
                                    <div class="review-desc">{{ taxCheck === null ? 'N/A' : taxCheck.pin_number }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Tax Obligations</div>
                                    <div class="review-desc">{{ taxCheck === null ? 'N/A' : taxCheck.taxkra_pin_verification_obligations }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Date of Registration</div>
                                    <div class="review-desc">{{ taxCheck === null ? 'N/A' : formatDate(taxCheck.registration_date ) }}</div>
                                </div>
                            </div>
                            <div class="el-col-lg-8 review-image">
                                <div class="review-edit" @click="handleReviewEdit('kra_pin_verification')">Edit</div>
                            </div>
                            </div>
                        </div>
                         <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant && !taxReview">
                            <el-form-item> <el-checkbox v-model="tax_inconsistency" id="identity_inconsistency" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
                         <div class="applicant--incosistency-mark" v-if="taxReview && transporterData.kra_pin_verification.inconsistency">
                            Marked for Data Inconsistency
                        </div>
                    </el-collapse-item>
                </div>
                  <div class="applicant--details-wrap" v-if="isBusiness && transporterData.director_details !== null" >
                      <template v-for="(director, index ) in JSON.parse(transporterData.director_details)" >
                    <el-collapse-item :name="`director_${index}`" class="verification-wrap" :key="`id_no_${index}`">
                        <template slot="title">
                            <span> Director verification  {{ index + 1 }} </span>
                            <span class="marked-inconsistent" v-if="transporterData.director_id_check !== null && transporterData.director_id_check.inconsistency !== 'undefined' && transporterData.director_id_check.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                            <span class="applicant-details__idNo"> ID Number: {{ director.id_no === null ? 'N/A' : director.id_no }} </span>
                        </template>
                        <directorsVerification :director="director" :index="index" :transporter-data="transporterData" @directorReview="handleDirectorsReview" />
                    </el-collapse-item>
                    </template>
                 </div>

                   <div class="applicant--details-wrap" v-for="(vehicle, i ) in transporterData.vehicle" :key="`vehicle_no_${i}`">
                    <el-collapse-item :name="`vehicle_${i}`" class="verification-wrap">
                        <template slot="title">
                            <span> Vehicle verification  {{ i + 1 }} </span>
                            <span class="marked-inconsistent" v-if="transporterData.director_id_check !== null && transporterData.director_id_check.inconsistency !== 'undefined' && transporterData.director_id_check.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                            <span class="applicant-details__idNo"> Number Plate: {{ vehicle.vehicle_reg_no === null ? 'N/A' : vehicle.vehicle_reg_no }} </span>
                        </template>
                        <vehicleVerification :vehicle="vehicle" :index="i" :transporter-data="transporterData" @vehicleReview="handleReview" />
                    </el-collapse-item>
                 </div>
            </el-collapse>

        </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */

import { mapGetters, mapActions, mapMutations } from 'vuex';

import GeneralMxn from '../../../mixins/general_mixin';
import TimezoneMxn from '../../../mixins/timezone_mixin';

export default {
    name: 'ReviewCheckComponent',
    components: {
        errorHandler: () => import('../../errorHandler'),
        vehicleVerification: () => import('./vehicleVerification'),
        directorsVerification: () => import('./directorsVerification'),

    },
    mixins: [GeneralMxn, TimezoneMxn],
    props: ['taxPayerNameIdentifier'],
    data() {
        return {
            errorObj: '',
            accordionActiveName: 'identity_check',
            company_name: '',
            company_reg: '',
            address: '',
            inconsistency: '',
            errorObj: '',
            gender: '',
            pob: '',
            dob: '',
            validity: '',
            pin_number: '',
            tax_obligations: '',
            registration_date: '',
            tax_name: '',
            company_inconsistency: false,
            identity_inconsistency: false,
            tax_inconsistency: false,
            license_inconsistency: false,
            user: JSON.parse(localStorage.user),
            identity: {
                name: '',
                dob: '',
                pob: '',
                gender: '',
                inconsistency: false,
            },
            drivingLicense: {
                name: '',
                dl_no: '',
                date_of_issue: '',
                expiry_date: '',
                classes: '',
                id_no: '',
                inconsistency: false,
            },
             directors:
                {
                    ids: [],
                    review_status: [],
                    inconsistency: [],
                },
                companyReview: false,
                companyCheck: null,
                updateStatus: false,
                taxReview: false,
                taxCheck: null,

        };
    },
    computed: {
    ...mapGetters(['current_verification', 'getUpdateStatus']),
        transporterData() {
            return this.current_verification;
        },

        IDReview() {
             if (this.transporterData.company_details_check === null || this.transporterData.company_details_check === '') {
                    this.companyCheck = null;
                } else {
                    const data = typeof this.transporterData.company_details_check === 'string' ? JSON.parse(this.transporterData.company_details_check) : this.transporterData.company_details_check;

                    this.companyCheck = typeof data !== 'undefined' ? data : null;
                }
                this.companyReview = this.companyCheck !== null;

            return this.companyCheck;
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

        identityReview() {
            return this.transporterData.identity_check === null ? false : this.transporterData.identity_check.review_status;
        },
        drivingReview() {
            return this.transporterData.driving_license_check === null ? false : this.transporterData.driving_license_check.review_status;
        },
          TaxReview() {
             if (this.transporterData.kra_pin_verification === null || this.transporterData.kra_pin_verification === '') {
                    this.taxCheck = null;
                } else {
                    const data = typeof this.transporterData.kra_pin_verification === 'string' ? JSON.parse(this.transporterData.kra_pin_verification) : this.transporterData.kra_pin_verification;

                    this.taxCheck = typeof data !== 'undefined' ? data : null;
                }
                this.taxReview = this.taxCheck !== null;

            return this.taxCheck;
        },
    },
      watch: {
        current_verification(data) {
            this.transporterData = data;
             this.companyReview = this.IDReview;
        },
          async getUpdateStatus(status) {
             this.updateStatus = status;
             if (status) {
                 this.companyReview = this.IDReview;
                this.taxCheck = this.TaxReview;
             }
         },
      },
     mounted() {
         this.companyReview = this.IDReview;
         this.taxCheck = this.TaxReview;

             if (this.isBusiness) {
                this.company_name = this.companyCheck === null ? '' : this.companyCheck.company_name;
                this.company_reg = this.companyCheck === null ? '' : this.companyCheck.company_reg_no;
                this.address = this.companyCheck === null ? '' : this.companyCheck.address;
                this.company_inconsistency = this.companyCheck === null ? false : this.companyCheck.inconsistency;
            }

            if (this.isDriverOwner) {
               this.drivingLicense = {
                name: this.transporterData.driving_license_check === null ? '' : this.transporterData.driving_license_check.name,
                dl_no: this.transporterData.driving_license_check === null ? '' : this.transporterData.driving_license_check.dl_no,
                date_of_issue: this.transporterData.driving_license_check === null ? '' : this.transporterData.driving_license_check.date_of_issue,
                expiry_date: this.transporterData.driving_license_check === null ? '' : this.transporterData.driving_license_check.date_of_issue,
                classes: this.transporterData.driving_license_check === null ? '' : this.transporterData.driving_license_check.expiry_date,
                id_no: this.transporterData.driving_license_check === null ? '' : this.transporterData.driving_license_check.id_no,
                inconsistency: this.transporterData.driving_license_check === null ? '' : this.transporterData.driving_license_check.inconsistency,
            };
            this.license_inconsistency = this.transporterData.driving_license_check === null ? '' : this.transporterData.driving_license_check.inconsistency;
            }
            if (!this.isBusiness) {
                this.identity = {
                name: this.transporterData.identity_check === null ? '' : this.transporterData.identity_check.name,
                gender: this.transporterData.identity_check === null ? '' : this.transporterData.identity_check.gender,
                pob: this.transporterData.identity_check === null ? '' : this.transporterData.identity_check.pob,
                dob: this.transporterData.identity_check === null ? '' : this.transporterData.identity_check.dob,
                };
                this.identity_inconsistency = this.transporterData.identity_check === null ? false : this.transporterData.identity_check.inconsistency;
            }

            this.registration_date = this.taxCheck === null ? '' : this.taxCheck.registration_date;
            this.validity = this.taxCheck === null ? '' : this.taxCheck.validity;
            this.pin_number = this.taxCheck === null ? '' : this.taxCheck.pin_number;
            this.tax_obligations = this.taxCheck === null ? '' : this.taxCheck.tax_obligations;
            this.tax_name = this.taxCheck === null ? '' : this.taxCheck.tax_name;
            this.tax_inconsistency = this.taxCheck === null ? '' : this.inconsistency;
    },
    methods: {

         handleReviewEdit(section) {
             switch (section) {
                 case 'company_details_check':
                    this.companyReview = false;
                     break;
                case 'kra_pin_verification':
                    this.taxReview = false;
                     break;

                 default:
                 // eslint-disable-next-line no-case-declarations
                 const obj = this.transporterData;
                this.transporterData[section].review_status = false;

                     break;
             }
         },

             setVerificationData(field, option) {
               let data = {};
                 switch (field) {
              case 'company_details_check':
                  data = {
                        company_reg_no: this.company_reg,
                        company_name: this.company_name,
                        address: this.address,
                        review_status: true,
                        inconsistency: this.company_inconsistency,
                    };
                  this.transporterData.company_details_check = option === 'inconsistency' ? { inconsistency: this.company_inconsistency } : data;
                  this.$store.commit('changeVerification', this.transporterData);

                  break;
                case 'kra_pin_verification':
                    data = {
                        validity: this.validity,
                        tax_name: this.tax_name,
                        pin_number: this.pin_number,
                        tax_obligations: this.tax_obligations,
                        registration_date: this.registration_date,
                        review_status: true,
                        inconsistency: this.tax_inconsistency,
                    };
                  this.transporterData.kra_pin_verification = option === 'inconsistency' ? { inconsistency: this.tax_inconsistency } : data;
                   this.$store.commit('changeVerification', this.transporterData);
                  break;
                case 'identity_check':
                    data = this.identity;
                    this.identity.review_status = true;
                  this.transporterData.identity_check = option === 'inconsistency' ? { inconsistency: this.identity_inconsistency } : data;
                break;
                case 'driving_license_check':
                    data = this.drivingLicense;
                    this.drivingLicense.review_status = true;
                  this.transporterData.driving_license_check = option === 'inconsistency' ? { inconsistency: this.license_inconsistency } : data;
                break;
               default:
                  break;
          }
          return this.transporterData[field];
        },
        async updateReview(field, field_title = '') {
            this.transporterData.kra_pin_verification = this.transporterData.kra_pin_verification === null ? [] : this.transporterData.kra_pin_verification;
            const review_json = await this.setVerificationData(field, 'default');

                const payload = {
                    review_section: field,
                    review_json: JSON.stringify(this.transporterData[field]),
                    partner_id: this.$route.params.id,
                    partner_id_no: this.transporterData.id_no,
                    admin_id: this.user.admin_id,
                    admin_name: this.user.name,
                };

            const fullPayload = {
                app: 'partner-api/',
                params: payload,
                endpoint: 'onboarding/peleza/update-review',
            };

               try {
                const res = await this.axiosPostRequest(fullPayload);
                if (res.data.status === true) {
                    this.$notify.success({
                    title: `update ${field_title}`,
                    message: `applicant ${field_title} updated successfully`,
                });
                this.$store.commit('changeVerification', this.transporterData);
                this.$store.commit('setUpdateStatus', true);
                } else {
                    this.$notify.error({
                    title: `update ${field_title}`,
                    message: `applicant ${field_title} failed to update`,
                });
                this.$store.commit('setUpdateStatus', false);
                }
            } catch (error) {
                   this.$notify.error({
                    title: `update ${field_title}`,
                    message: `applicant ${field_title} failed to update`,
                });
                  this.$store.commit('setUpdateStatus', false);
                return error.response;
            }
        },
        handleReview(vehicleReview) {
            this.updateReview(vehicleReview.section, vehicleReview.title);
        },
         handleDirectorsReview(directorReview) {
            this.updateReview('director_id_check', 'Director ID check');
        },
    },
};
</script>

<style>

</style>
