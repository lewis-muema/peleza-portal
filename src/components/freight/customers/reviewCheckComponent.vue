<template>
    <div class="applicant-details__data">
        <errorHandler :error="errorObj" v-if="errorObj" />
        <div class="applicant-details__data_holder">
            <el-card class="applicant-details__profile__personal-details verification-content">
                <span class="verification-header">Verify Customer Details</span>
            </el-card>
            <el-collapse class="verification-collapse" v-model="accordionActiveName">
                <div class="applicant--details-wrap" v-if="isBusiness">
                    <el-collapse-item name="1" class="verification-wrap">
                        <template slot="title">
                            <span>Company Registration Check</span>
                            <span class="marked-inconsistent" v-if="customerData.company_verification !== null && customerData.company_verification.inconsistency !== 'undefined' && customerData.company_verification.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                            <span class="applicant-details__idNo"> Registration number: {{ customerData.company_reg_no === null ? 'N/A' : customerData.company_reg_no }} </span>
                        </template>
                         <el-form :model="customerData.company_verification" v-show="!companyReview">
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
                                <el-button type="primary" class="details-save-button" @click="updateReview('company_verification', 'Company Verification Check')">SAVE</el-button>
                            </el-form-item>
                        </el-form>
                         <div class="review_wrap" v-show="companyReview">
                            <div class="el-row">
                            <div class="el-col-lg-16 review-details">
                                <div class="el-row" >
                                    <div class="review-title">Company Name</div>
                                    <div class="review-desc">{{ customerData.company_verification === null ? 'N/A' : customerData.company_verification.company_name }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Company registration number</div>
                                    <div class="review-desc">{{ customerData.company_verification === null ? 'N/A' : customerData.company_verification.company_reg_no }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Company Address</div>
                                    <div class="review-desc">{{ customerData.company_verification === null ? 'N/A' : customerData.company_verification.address }}</div>
                                </div>
                            </div>
                            <div class="el-col-lg-8 review-image">
                                <div class="review-edit" @click="handleReviewEdit('company_verification')">Edit</div>
                            </div>
                            </div>
                        </div>
                         <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                            <el-form-item> <el-checkbox v-model="company_inconsistency" id="identity_inconsistency" @change="setVerificationData('company_verification', 'inconsistency')" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
                        <div class="applicant--incosistency-mark" v-if="customerData.company_verification !== null && customerData.company_verification.inconsistency && current_route === 'inconsistency'">
                            Marked for Data Inconsistency
                        </div>
                    </el-collapse-item>
                </div>
                 <div class="applicant--details-wrap" v-if="isPeer">
                    <el-collapse-item name="2" class="verification-wrap">
                        <template slot="title">
                            <span>National Identity Check</span>
                            <span class="marked-inconsistent" v-if="customerData.identity_verification !== null && customerData.identity_verification.inconsistency !== 'undefined' && customerData.identity_verification.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                            <span class="applicant-details__idNo"> ID number: {{ customerData.id_no === null ? 'N/A' : customerData.id_no }} </span>
                        </template>
                        <el-form :model="customerData.identity_verification" v-show="!identityReview">
                            <el-form-item label="Name of Applicant">
                                <el-input v-model="name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="Date of Birth">
                                <el-date-picker v-model="dob" type="date" popper-class="date-popup" placeholder="Date of Birth"></el-date-picker>
                            </el-form-item>

                            <el-form-item label="Place of Birth">
                                <el-input type="textarea" :rows="4" v-model="pob" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="Gender">
                                <el-select v-model="gender" auto-complete="off">
                                    <el-option value="Male">Male</el-option>
                                    <el-option value="Female">Female</el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="details-save-button" @click="updateReview('identity_verification', 'Identity Check')">SAVE</el-button>
                            </el-form-item>
                        </el-form>
                         <div class="review_wrap" v-show="customerData.identity_verification && customerData.identity_verification.review_status">
                            <div class="el-row">
                            <div class="el-col-lg-16 review-details">
                                <div class="el-row">
                                <div class="review-title">Name of Applicant</div>
                                    <div class="review-desc">{{ customerData.identity_verification === null ? 'N/A' : customerData.identity_verification.name }}</div>

                                </div>
                                <div class="el-row">
                                <div class="review-title">Date of Birth</div>
                                    <div class="review-desc">{{ customerData.identity_verification === null || customerData.identity_verification.dob === '' ? 'N/A' : formatDate(customerData.identity_verification.dob) }}</div>

                                </div>
                                <div class="el-row">
                                <div class="review-title">Place of Birth</div>
                                    <div class="review-desc">{{ customerData.identity_verification === null ? 'N/A' : customerData.identity_verification.pob }}</div>

                                </div>
                                <div class="el-row">
                                <div class="review-title">Gender</div>
                                    <div class="review-desc">{{ customerData.identity_verification === null ? 'N/A' : customerData.identity_verification.gender }}</div>

                                </div>
                            </div>
                            <div class="el-col-lg-8 review-image">
                                <div class="review-edit" @click="handleReviewEdit('identity_verification')">Edit</div>
                            </div>
                            </div>
                        </div>
                          <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                            <el-form-item> <el-checkbox v-model="identity_inconsistency" id="identity_inconsistency" @change="setVerificationData('identity_verification', 'inconsistency')" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
                        <div class="applicant--incosistency-mark" v-if="customerData.identity_verification !== null && customerData.identity_verification.inconsistency && current_route === 'inconsistency'">
                            Marked for Data Inconsistency
                        </div>

                    </el-collapse-item>
                </div>
                <div class="applicant--details-wrap">
                    <el-collapse-item name="3" class="verification-wrap">
                        <template slot="title">
                            <span>{{ taxPayerNameIdentifier }} Verification</span>
                            <span class="marked-inconsistent" v-if="customerData.tax_verification !== null && customerData.tax_verification.inconsistency !== 'undefined' && customerData.tax_verification.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                            <span class="applicant-details__idNo"> {{ taxPayerNameIdentifier }}: {{ customerData.tax_authority_pin === null ? 'N/A' : customerData.tax_authority_pin }} </span>
                        </template>
                        <el-form :model="customerData.tax_verification" v-show="!taxReview">
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
                                <el-button type="primary" class="details-save-button" @click="updateReview('tax_verification', `${taxPayerNameIdentifier} Verification`)">SAVE</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="review_wrap" v-show="taxReview">
                            <div class="el-row">
                            <div class="el-col-lg-16 review-details">
                                <div class="el-row" >
                                    <div class="review-title">Validity</div>
                                    <div class="review-desc">{{ customerData.tax_verification === null ? 'N/A' : customerData.tax_verification.validity }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Name</div>
                                    <div class="review-desc">{{ customerData.tax_verification === null ? 'N/A' : customerData.tax_verification.tax_name }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">{{ taxPayerNameIdentifier }} Number</div>
                                    <div class="review-desc">{{ customerData.tax_verification === null ? 'N/A' : customerData.tax_verification.pin_number }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Tax Obligations</div>
                                    <div class="review-desc">{{ customerData.tax_verification === null ? 'N/A' : customerData.tax_verification.tax_obligations }}</div>
                                </div>
                                <div class="el-row">
                                    <div class="review-title">Date of Registration</div>
                                    <div class="review-desc">{{ customerData.tax_verification === null ? 'N/A' : formatDate(customerData.tax_verification.registration_date ) }}</div>
                                </div>
                            </div>
                            <div class="el-col-lg-8 review-image">
                                <div class="review-edit" @click="handleReviewEdit('tax_verification')">Edit</div>
                            </div>
                            </div>
                        </div>
                         <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                            <el-form-item> <el-checkbox v-model="tax_inconsistency" id="identity_inconsistency" @change="setVerificationData('tax_verification', 'inconsistency')" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
                        </el-form>
                        <div class="applicant--incosistency-mark" v-if="customerData.tax_verification !== null && customerData.tax_verification.inconsistency && current_route === 'inconsistency'">
                            Marked for Data Inconsistency
                        </div>
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
    name: 'reviewCheckComponent',
    components: {
        errorHandler: () => import('../../errorHandler'),
    },
    mixins: [GeneralMxn, TimezoneMxn],
    props: ['customerData', 'taxPayerNameIdentifier'],
    data() {
        return {
            accordionActiveName: 'identity_check',
            showHoverVal: 0,
            name: '',
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

        };
    },
    computed: {
         isPendingApplicant() {
            return this.current_route === 'customer';
        },
        current_route() {
            return this.$route.name;
        },
        companyReview() {
            return this.isBusiness && this.customerData.company_verification === null ? false : this.customerData.company_verification.review_status;
        },
        identityReview() {
            return this.isPeer && this.customerData.identity_verification === null ? false : this.customerData.identity_verification.review_status;
        },
        taxReview() {
            return this.customerData.tax_verification === null ? false : this.customerData.tax_verification.review_status;
        },
        isBusiness() {
            return this.customerData.application_type === 'business';
        },
        isPeer() {
            return this.customerData.application_type === 'personal';
        },
    },
    mounted() {
            if (this.isPeer) {
                this.name = this.customerData.identity_verification === null ? '' : this.customerData.identity_verification.name;
                this.gender = this.customerData.identity_verification === null ? '' : this.customerData.identity_verification.gender;
                this.pob = this.customerData.identity_verification === null ? '' : this.customerData.identity_verification.pob;
                this.dob = this.customerData.identity_verification === null ? '' : this.customerData.identity_verification.dob;
                this.identity_inconsistency = this.customerData.identity_verification === null ? false : this.customerData.identity_verification.inconsistency;
            } else {
                this.company_name = this.customerData.company_verification === null ? '' : this.customerData.company_verification.company_name;
                this.company_reg = this.customerData.company_verification === null ? '' : this.customerData.company_verification.company_reg_no;
                this.address = this.customerData.company_verification === null ? '' : this.customerData.company_verification.address;
                this.company_inconsistency = this.customerData.company_verification === null ? false : this.customerData.company_verification.inconsistency;
            }

            this.registration_date = this.customerData.tax_verification === null ? '' : this.customerData.tax_verification.registration_date;
            this.validity = this.customerData.tax_verification === null ? '' : this.customerData.tax_verification.validity;
            this.pin_number = this.customerData.tax_verification === null ? '' : this.customerData.tax_verification.pin_number;
            this.tax_obligations = this.customerData.tax_verification === null ? '' : this.customerData.tax_verification.tax_obligations;
            this.tax_name = this.customerData.tax_verification === null ? '' : this.customerData.tax_verification.tax_name;
            this.tax_inconsistency = this.customerData.tax_verification === null ? '' : this.customerData.tax_verification.inconsistency;
       },
    methods: {
         showDets(val) {
            this.showHoverVal = val;
        },
        handleReviewEdit(section) {
            const obj = this.customerData;
            this.customerData[section].review_status = false;
         },
        checkProperties(obj) {
            for (const key in obj) {
                if ((obj[key] === null || obj[key] === '') && !obj[key]) {
                return false;
                }
            }
            return true;
        },
       setVerificationData(field, option) {
               let data = {};
                 switch (field) {
              case 'company_verification':
                  data = {
                        company_reg_no: this.company_reg,
                        company_name: this.company_name,
                        address: this.address,
                        review_status: true,
                        inconsistency: this.company_inconsistency,
                    };
                  this.customerData.company_verification = option === 'inconsistency' ? { inconsistency: this.company_inconsistency } : data;
                  this.$store.commit('setCustomerVerification', this.customerData);

                  break;
                case 'identity_verification':
                    data = {
                        name: this.name,
                        dob: this.dob,
                        pob: this.pob,
                        gender: this.gender,
                        id_card: '',
                        review_status: true,
                        inconsistency: this.identity_inconsistency,
                    };
                  this.customerData.identity_verification = option === 'inconsistency' ? { inconsistency: this.identity_inconsistency } : data;
                  this.$store.commit('setCustomerVerification', this.customerData);
                  break;
                case 'tax_verification':
                    data = {
                        validity: this.validity,
                        tax_name: this.tax_name,
                        pin_number: this.pin_number,
                        tax_obligations: this.tax_obligations,
                        registration_date: this.registration_date,
                        review_status: true,
                        inconsistency: this.tax_inconsistency,
                    };
                  this.customerData.tax_verification = option === 'inconsistency' ? { inconsistency: this.tax_inconsistency } : data;
                   this.$store.commit('setCustomerVerification', this.customerData);
                  break;
              default:
                  break;
          }
          return this.customerData[field];
        },

        async updateReview(field, field_title = '') {
            const review_json = await this.setVerificationData(field, 'default');
            const properties_res = this.checkProperties(review_json);


            const payload = {
                     ...this.isPeer && { userId: this.$route.params.id },
                     ...this.isBusiness && { copId: this.$route.params.id },
                     ...this.isBusiness && { companyVerification: this.customerData.company_verification },
                     ...this.isPeer && { idVerification: this.customerData.identity_verification },
                     taxVerification: this.customerData.tax_verification,
                     adminId: this.user.admin_id,
                };

            const fullPayload = {
                app: 'adonis/',
                params: payload,
                endpoint: 'freight-customer-approvals/review',
            };
            try {
                const res = await this.axiosPostRequest(fullPayload);
                if (res.data.status === true) {
                    this.$notify.success({
                    title: `update ${field_title}`,
                    message: `applicant ${field_title} updated successfully`,
                });
                this.$store.commit('setCustomerVerification', this.customerData);
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

    },
};
</script>
