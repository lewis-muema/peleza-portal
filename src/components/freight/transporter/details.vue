<template>
  <div>
       <div class="">
          <div v-if="transportData === null">No apllicant data found</div>
              <div v-else>
                  <div class="applicant-details__profile">
                      <div class="applicant-details-holder">
                          <el-card class="applicant-details__profile__personal-details">
                              <el-button type="primary back-button" @click="handleBack"><i class="fa fa-arrow-left el-icon-right back-icon"></i> Back to List</el-button>
                                <div class="applicant-details__profile_content">
                                    <div class="applicant-details__application_type">Application Type</div>
                                      <div class="applicant-details__application_type_value">{{ setApplicantName(transportData.application_type) }}</div>
                                </div>
                                <div class="applicant-details__profile_content">
                                    <div class="applicant-details__application_type applicant-name">{{ capitalizeFirstLetter(transportData.name) }}</div>
                                      <div class="applicant-details__application_type_identity text-uppercase ">{{ transportData.country }}</div>

                                       <div class="applicant-details__application_type_identity" v-if="transportData.application_type === 'Business'">
                                          <span>{{ transportData.company_reg_no !== null && typeof transportData.company_reg_no !== 'undefined' ? transportData.company_reg_no : 'N/A' }}</span>
                                          <span class="identity-label">Company registration </span>
                                      </div>

                                      <div class="applicant-details__application_type_identity" v-else>
                                          <span>{{ transportData.id_no !== null ? transportData.id_no : 'N/A' }}</span>
                                          <span class="identity-label">National ID</span>
                                      </div>
                                       <div class="applicant-details__application_type_identity">
                                        <span>{{ transportData.kra_pin !== null ? transportData.kra_pin : 'N/A' }}</span>
                                        <span class="identity-label">{{ taxPayerNameIdentifier }} Number</span>
                                      </div>
                                       <div class="applicant-details__application_type_identity">
                                        <span>{{ transportData.phone !== null ? transportData.phone : 'N/A' }}</span>
                                        <span class="identity-label">Phone Number</span>
                                      </div>
                                </div>
                                  <div class="applicant-details__profile_content">
                                      <div class="applicant-details__application_date">
                                          <span>{{ transportData.date_created === null ? 'N/A' : formatDate(transportData.date_created) }}</span>
                                          <span class="identity-label">Application Date</span>
                                      </div>
                                  </div>
                                  <el-button type="primary status-button" :class="transportData.transportersStatus"> {{ transportData.transportersStatus }}</el-button>
                                  <div class="applicant-details__profile_content" v-if="validSubmit">
                                      <reviewForm :valid-submit="validSubmit" :user-type="userType" @customerReview="submitApplicantReview"/>
                                  </div>
                                  <!-- <div class="applicant-details__profile_content" v-if="inconsistencyCheck">
                                      <inconsistenciesForm :valid-submit-status="validSubmitStatus" :inconsistency-check="inconsistencyCheck" :check-review-status="checkReviewStatus" @customerReview="submitApplicantReview" />
                                  </div>-->
                                  <div class="applicant-details__profile_content">
                                      <activityLogs :user-type="transportData.application_type" :id="transportData.id" />
                                  </div>
                          </el-card>

                      </div>
                  </div>
                  <reviewCheckComponent :transporter-data="transportData" :tax-payer-name-identifier="taxPayerNameIdentifier" />
              </div>
      </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import generalMixin from '../../../mixins/general_mixin';
import timzoneMixin from '../../../mixins/timezone_mixin';

export default {
    name: 'TransporterDetails',
     components: {
    reviewForm: () => import('../customers/reviewForm'),
    // inconsistenciesForm: () => import('./inconsistenciesForm'),
    reviewCheckComponent: () => import('./reviewCheckComponent'),
    activityLogs: () => import('./activityLogs'),

    },
    mixins: [generalMixin, timzoneMixin],
    data() {
      return {
        userType: 'transporter',
      };
    },
     computed: {
        ...mapGetters(['current_verification']),
        transportData() {
            return this.current_verification;
        },
        taxPayerNameIdentifier() {
          if ('country' in this.transportData) {
            if (this.transportData.country === 'Kenya') {
              return 'KRA PIN';
            }
          }
          return 'TIN';
        },
        isBusiness() {
            return this.transportData.application_type === 'Business';
        },
         isOwner() {
            return this.transportData.application_type === 'Owner';
        },
         isDriver() {
            return this.transportData.application_type === 'Driver';
        },
         isDriverOwner() {
            return this.transportData.application_type === 'Driver and owner';
        },

        companyReview() {
          if (this.isBusiness) {
            return this.transportData.company_details_check === null ? false : this.transportData.company_details_check.review_status;
          }
          return true;
        },
         identityReview() {
            return this.transportData.identity_check === null ? false : this.transportData.identity_check.review_status;
        },

        taxReview() {
            return this.transportData.kra_pin_verification === null || (typeof this.transportData.kra_pin_verification === 'string' && this.isEmpty(JSON.parse(this.transportData.kra_pin_verification))) ? false : this.transportData.kra_pin_verification.review_status;
        },
         drivingReview() {
            return this.transportData.driving_license_check === null ? false : this.transportData.driving_license_check.review_status;
        },
         validSubmit() {
                return this.checkReviewStatus() && !this.inconsistencyCheck;
        },
         inconsistencyCheck() {
            const obj = this.transportData;
            for (const key in obj) {
                if (obj[key] != null && obj[key]['inconsistency'] === true) {
                return true;
                }
            }
            return false;
        },

     },
      watch: {
        current_verification(data) {
            this.transportData = data;
        },
    },
     methods: {
        checkReviewStatus() {
            if (this.isBusiness) {
                return this.companyReview && this.taxReview;
            } else if (this.isDriverOwner) {
              return this.identityReview && this.taxReview && this.drivingReview;
            } else if (this.isOwner) {
              return this.identityReview && this.kraReview;
            } else {
                const obj = this.transportData;
                for (const key in obj) {
                  if (obj[key] !== null && obj[key]['review_status'] === false) {
                    return false;
                  }
                }
                return true;
              }
        },
         handleBack() {
            this.$router.push({ name: 'transporters' });
        },
        setApplicantName(type) {
          let title = 'Partner';
          switch (type) {
            case 'Owner':
              title = 'Personal Owner';
              break;
            case 'Business':
              title = 'Business Owner';
              break;
            case 'Driver':
              title = 'Driver';
              break;
            case 'Driver and owner':
              title = 'Driver and Owner';
              break;

            default:
              break;
          }
        return title;
        },
        submitApplicantReview(customerReview) {
            const payload = {
              partner_id: this.transportData.id,
              applicant_review: customerReview,
              admin_id: JSON.parse(localStorage.user).admin_id,
              admin_name: JSON.parse(localStorage.user).name,
            };
            axios
              .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/applications/submit_applicant_review/`, JSON.stringify(payload), { headers: { Authorization: localStorage.token } })
              .then(response => {
                if (response.data.status === true) {
                  this.$notify.success({
                    title: 'submit applicant review',
                    message: response.data.message,
                  });
                  this.handleBack();
                } else {
                  this.$notify.error({
                    title: 'submit applicant review',
                    message: response.data.message,
                  });
                }
              })
              .catch(error => {
                this.errorObj = error.response;
                this.$notify.error({
                  title: 'submit applicant review',
                  message: 'failed to update applicant review',
                });
                throw new Error('Could not update applicant');
              });
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
