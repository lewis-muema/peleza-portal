<template>
  <div class="applicant-details__data">
        <errorHandler :error="errorObj" v-if="errorObj" />
        <div class="applicant-details__data_holder">
            <el-card class="applicant-details__profile__personal-details verification-content">
                <span class="verification-header">Verify Transporter Details</span>
            </el-card>
            <el-collapse class="verification-collapse" v-model="accordionActiveName">
                <div class="applicant--details-wrap" v-if="transporterData.application_type === 'Business'">
                    <el-collapse-item name="1" class="verification-wrap">
                        <template slot="title">
                            <span>Company Registration Check</span>
                            <span class="marked-inconsistent" v-if="transporterData.company_details_check !== null && transporterData.company_details_check.inconsistency !== 'undefined' && transporterData.company_details_check.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                            <span class="applicant-details__idNo"> Registration number: {{ transporterData.company_reg_no === null ? 'N/A' : transporterData.company_reg_no }} </span>
                        </template>
                        <el-form v-show="!companyReview">
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
                         <div class="review_wrap" v-show="companyReview">
                            <div class="el-row">
                            <div class="el-col-lg-16 review-details">
                                <div class="el-row" >
                                    <div class="review-title">Company Name</div>
                                    <div class="review-desc">{{ transporterData.company_details_check === null ? 'N/A' : transporterData.company_details_check.company_name }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Company registration number</div>
                                    <div class="review-desc">{{ transporterData.company_details_check === null ? 'N/A' : transporterData.company_details_check.company_reg_no }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Company Address</div>
                                    <div class="review-desc">{{ transporterData.company_details_check === null ? 'N/A' : transporterData.company_details_check.address }}</div>
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
                        <div class="applicant--incosistency-mark" v-if="companyReview && transporterData.company_details_check.inconsistency">
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
                        <el-form v-show="!taxReview">
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
                                <el-date-picker v-model="registration_date" type="date" popper-class="date-popup" placeholder="Date of Registration"></el-date-picker>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" class="details-save-button" @click="updateReview('kra_pin_verification', `${taxPayerNameIdentifier} Verification`)">SAVE</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="review_wrap" v-show="taxReview">
                            <div class="el-row">
                            <div class="el-col-lg-16 review-details">
                                <div class="el-row" >
                                    <div class="review-title">Validity</div>
                                    <div class="review-desc">{{ transporterData.kra_pin_verification === null ? 'N/A' : transporterData.kra_pin_verification.validity }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Name</div>
                                    <div class="review-desc">{{ transporterData.kra_pin_verification === null ? 'N/A' : transporterData.kra_pin_verification.tax_name }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">{{ taxPayerNameIdentifier }} Number</div>
                                    <div class="review-desc">{{ transporterData.kra_pin_verification === null ? 'N/A' : transporterData.kra_pin_verification.pin_number }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Tax Obligations</div>
                                    <div class="review-desc">{{ transporterData.kra_pin_verification === null ? 'N/A' : transporterData.kra_pin_verification.taxkra_pin_verification_obligations }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Date of Registration</div>
                                    <div class="review-desc">{{ transporterData.kra_pin_verification === null ? 'N/A' : formatDate(transporterData.kra_pin_verification.registration_date ) }}</div>
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
                    <el-collapse-item :name="`director_${index}`" class="verification-wrap" :key="index">
                        <template slot="title">
                            <span> Director ID verification {{ index + 1 }} </span>
                            <span class="marked-inconsistent" v-if="transporterData.director_id_check !== null && transporterData.director_id_check.inconsistency !== 'undefined' && transporterData.director_id_check.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                            <span class="applicant-details__idNo"> ID Number: {{ director.id_no === null ? 'N/A' : director.id_no }} </span>
                        </template>
                        <el-form v-show="!getDirectorsStatus(index, director.id_no)">
                            <el-form-item label="ID Number">
                                <el-input v-model="directors.id_no" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="details-save-button" @click="setDirectors(index, director.id_no)">SAVE</el-button>
                            </el-form-item>
                        </el-form>
                         <div class="review_wrap" v-if="getDirectorsStatus(index, director.id_no)">

                            <div class="el-row">
                            <div class="el-col-lg-16 review-details">
                                <div class="el-row" >
                                    <div class="review-title">ID Number</div>
                                    <!-- <div class="review-desc">{{ getDirectorsReview(index, director.id_no) !== null ? getDirectorsReview(index, director.id_no).id_no : 'N/A' }}</div> -->
                                </div>
                            </div>
                            </div>
                         </div>
                         <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                            <el-form-item> <el-checkbox v-model="directors.inconsistency" id="identity_inconsistency" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
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
import GeneralMxn from '../../../mixins/general_mixin';
import TimezoneMxn from '../../../mixins/timezone_mixin';

export default {
    name: 'ReviewCheckComponent',
    components: {
        errorHandler: () => import('../../errorHandler'),
        vehicleVerification: () => import('./VehicleVerification'),


    },
    mixins: [GeneralMxn, TimezoneMxn],
    props: ['transporterData', 'taxPayerNameIdentifier'],
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
            user: JSON.parse(localStorage.user),
             directors:
                {
                    id_no: '',
                    review_status: false,
                    inconsistency: false,
                },
        };
    },
    computed: {
        companyReview() {
            return this.transporterData.company_details_check === null || typeof this.transporterData.company_details_check === 'undefined' ? false : this.transporterData.company_details_check.review_status;
        },
        taxReview() {
            return this.transporterData.kra_pin_verification === null ? false : this.transporterData.kra_pin_verification.review_status;
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
            return this.transporterData.application_type === 'Driver and owner';
        },
         isPendingApplicant() {
            return this.current_route === 'transporter';
        },
        current_route() {
            return this.$route.name;
        },
    },
    mounted() {
             if (this.isBusiness) {
                this.company_name = this.transporterData.company_details_check === null ? '' : this.transporterData.company_details_check.company_name;
                this.company_reg = this.transporterData.company_details_check === null ? '' : this.transporterData.company_details_check.company_reg_no;
                this.address = this.transporterData.company_details_check === null ? '' : this.transporterData.company_details_check.address;
                this.company_inconsistency = this.transporterData.company_details_check === null ? false : this.transporterData.company_details_check.inconsistency;
            }

            this.registration_date = this.transporterData.kra_pin_verification === null ? '' : this.transporterData.kra_pin_verification.registration_date;
            this.validity = this.transporterData.kra_pin_verification === null ? '' : this.transporterData.kra_pin_verification.validity;
            this.pin_number = this.transporterData.kra_pin_verification === null ? '' : this.transporterData.kra_pin_verification.pin_number;
            this.tax_obligations = this.transporterData.kra_pin_verification === null ? '' : this.transporterData.kra_pin_verification.tax_obligations;
            this.tax_name = this.transporterData.kra_pin_verification === null ? '' : this.transporterData.kra_pin_verification.tax_name;
            this.tax_inconsistency = this.transporterData.kra_pin_verification === null ? '' : this.transporterData.kra_pin_verification.inconsistency;
    },
    methods: {
        getDirectorsStatus(index, id_no) {
            const diretorsDetails = JSON.parse(this.transporterData.director_details);
            const field = 'director_id_check';
             const index1 = this.transporterData.director_id_check.findIndex(x => x.setIDNo === id_no);
            console.log('getDirectorsStatus', index1);

                if (index1 === -1) {
                   return false;
                } else {
                    return this.transporterData.director_id_check[index1].review_status;
                }
        },
         getDirectorsReview(index, id_no) {
            const diretorsDetails = JSON.parse(this.transporterData.director_details);
            const field = 'director_id_check';
             const index1 = this.transporterData[field].findIndex(x => x.setIDNo === id_no);
                if (index1 === -1) {
                   return null;
                } else {
                    return this.transporterData.director_id_check[index1];
                }
        },
         handleReviewEdit(section) {
            const obj = this.customerData;
            this.transporterData[section].review_status = false;
         },
           async  setDirectors(index, id_no) {
            this.directors.review_status = true;
            this.directors.partnerID = this.transporterData.id;
            this.directors.directorIndex = index;
            this.directors.setIDNo = id_no;


             if (this.transporterData.director_id_check === null) {
                    this.transporterData.director_id_check = [];
                }
                const index1 = this.transporterData.director_id_check.findIndex(x => x.directorIndex === index);
                if (index1 === -1) {
                    this.transporterData.director_id_check.push(this.directors);
                } else {
                    this.transporterData.director_id_check[index1] = this.directors;
                }

                this.$store.commit('changeVerification', this.transporterData);
                 await this.updateReview('director_id_check', 'Director ID Check');
            },
             setVerificationData(field, option) {
                 console.log('sumbua');
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
            this.updateReview(vehicleReview.section, vehicleReview.field_title);
        },
    },
};
</script>

<style>

</style>
