<template>
 <div class="">
     <div v-if="customerData === null">No apllicant data found</div>
        <div v-else>
            <div class="applicant-details__profile">
                <div class="applicant-details-holder">
                    <el-card class="applicant-details__profile__personal-details">
                        <el-button type="primary back-button" @click="handleBack"><i class="fa fa-arrow-left el-icon-right back-icon"></i> Back to List</el-button>
                           <div class="applicant-details__profile_content">
                               <div class="applicant-details__application_type">Application Type</div>
                                <div class="applicant-details__application_type_value">{{ capitalizeFirstLetter(customerData.application_type ) }}</div>
                           </div>
                           <div class="applicant-details__profile_content">
                               <div class="applicant-details__application_type applicant-name">{{ capitalizeFirstLetter(customerData.name) }}</div>
                                <div class="applicant-details__application_type_identity text-uppercase ">{{ customerData.country }}</div>

                                <div class="applicant-details__application_type_identity" v-if="customerData.application_type === 'personal'">
                                    <span>{{ customerData.id_no !== null ? customerData.id_no : 'N/A' }}</span>
                                    <span class="identity-label">National ID</span>
                                </div>
                                <div class="applicant-details__application_type_identity" v-if="customerData.application_type === 'business'">
                                    <span>{{ customerData.company_reg_no !== null ? customerData.company_reg_no : 'N/A' }}</span>
                                    <span class="identity-label">Company registration </span>
                                </div>
                                <div class="applicant-details__application_type_identity">
                                    <span>{{ customerData.tax_authority_pin !== null ? customerData.tax_authority_pin : 'N/A' }}</span>
                                    <span class="identity-label">{{ taxPayerNameIdentifier }} Number</span>
                                </div>
                           </div>
                            <div class="applicant-details__profile_content">
                                <div class="applicant-details__application_date">
                                    <span>{{ customerData.application_date === null ? 'N/A' : formatDate(customerData.application_date) }}</span>
                                    <span class="identity-label">Application Date</span>
                                </div>
                            </div>
                            <el-button type="primary status-button" :class="getApplicantStatus(customerData).name"> {{ getApplicantStatus(customerData).title }}</el-button>
                            <div class="applicant-details__profile_content" v-if="validSubmit">
                                <reviewForm :valid-submit="validSubmit" :user-type="customerData.application_type" @customerReview="submitApplicantReview" />
                            </div>
                            <div class="applicant-details__profile_content" v-if="inconsistencyCheck">
                                <inconsistenciesForm :valid-submit-status="validSubmitStatus" :inconsistency-check="inconsistencyCheck" :check-review-status="checkReviewStatus" @customerReview="submitApplicantReview" />
                            </div>
                             <div class="applicant-details__profile_content">
                                <activityLogs :user-type="customerData.application_type"/>
                             </div>
                    </el-card>

                </div>
            </div>
            <reviewCheckComponent :customer-data="customerData" :tax-payer-name-identifier="taxPayerNameIdentifier" />
        </div>
 </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import generalMixin from '../../../mixins/general_mixin';
import timzoneMixin from '../../../mixins/timezone_mixin';

export default {
    name: 'CustomerDetails',
    components: {
    reviewForm: () => import('./reviewForm'),
    inconsistenciesForm: () => import('./inconsistenciesForm'),
    reviewCheckComponent: () => import('./reviewCheckComponent'),
    activityLogs: () => import('./activityLogs'),


    },
    mixins: [generalMixin, timzoneMixin],

    data() {
        return {
            loading: false,
             customerReview: {
                status: '',
                reason: '',
            },
            user: JSON.parse(localStorage.user),

        };
    },
    computed: {
        ...mapGetters(['getCustomerVerification']),
        customerData() {
            return this.getCustomerVerification;
        },
        userType() {
            return this.customerData.application_type === 'personal' ? 'peer' : 'business';
        },
        taxPayerNameIdentifier() {
            if ('country_code' in this.customerData) {
                if (this.customerData.country_code === 'KE') {
                return 'KRA PIN';
                }
            }
            return 'TIN';
        },
        inconsistencyCheck() {
            const obj = this.customerData;
            for (const key in obj) {
                if (obj[key] != null && obj[key]['inconsistency'] === true) {
                return true;
                }
            }
            return false;
        },
          isPendingApplicant() {
            return this.current_route === 'customer';
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
        validSubmit() {
                return this.checkReviewStatus() && !this.inconsistencyCheck;
        },
        validSubmitStatus() {
            if (this.customerReview.status === '') {
                return false;
            } else {
                if (this.customerReview.status === false) {
                if (this.customerReview.reason === '') {
                    return false;
                } else {
                    return true;
                }
                } else {
                return true;
                }
            }
        },
    },
    watch: {
        getCustomerVerification(data) {
            this.customerData = data;
        },
    },
    mounted() {
    },
    methods: {
         handleBack() {
            this.$router.push({ name: `freight-${this.userType}` });
        },
        checkReviewStatus() {
            if (this.userType === 'peer') {
                return this.identityReview && this.taxReview;
            } else {
                return this.companyReview && this.taxReview;
            }
        },
        async submitApplicantReview(customerReview) {
            this.customerReview = customerReview;

               const payload = {
                    reviewStatus: this.customerReview.status,
                    message: this.customerReview.reason,
                     ...this.isPeer && { userId: this.$route.params.id },
                     ...this.isBusiness && { copId: this.$route.params.id },
                     adminId: this.user.admin_id,
                };
                const fullPayload = {
                app: 'adonis/',
                params: payload,
                endpoint: 'freight-customer-approvals/complete',
                };
                try {
                    const res = await this.axiosPostRequest(fullPayload);

                    if (res.data.status === true) {
                        this.$notify.success({
                        title: 'submit applicant review',
                        message: res.data.message,
                    });
                       const goBack = customerReview.category === 'valid' ? this.handleBack() : '';
                    } else {
                        this.$notify.error({
                        title: 'submit applicant review',
                        message: res.data.message,
                    });
                    }
                } catch (error) {
                    this.$notify.error({
                        title: 'submit applicant review',
                        message: 'failed to update applicant review',
                    });
                    return error.response;
                }
        },
    },

};
</script>

<style>
@import '../../../assets/style/detail.css';
@import '../../../assets/style/overide.css';

@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }
}
</style>
