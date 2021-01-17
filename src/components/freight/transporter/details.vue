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
                                  <el-button type="primary status-button" :class="transporterStatus"> {{ transporterStatus }}</el-button>
                                  <div class="applicant-details__profile_content" v-if="validSubmit && (transportData.review_status === 0 ||  transportData.review_status === null ||  transportData.review_status === 2)">
                                      <reviewForm :valid-submit="validSubmit" :user-type="userType" @customerReview="submitApplicantReview"/>
                                  </div>
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
/* eslint-disable vue/no-side-effects-in-computed-properties */

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
        loading: false,
        requested: false,
        updateStatus: false,
        companyReview: false,
        companyCheck: null,
        taxReview: false,
        taxCheck: null,
        identityReview: false,
        identityCheck: null,

      };
    },
     computed: {
        ...mapGetters(['current_verification', 'getUpdateStatus']),
        transportData() {
            return this.current_verification;
        },

        IDReview() {
             if (this.transportData.company_details_check === null || this.transportData.company_details_check === '') {
                    this.companyCheck = null;
                } else {
                    const data = typeof this.transportData.company_details_check === 'string' ? JSON.parse(this.transportData.company_details_check) : this.transportData.company_details_check;

                    this.companyCheck = typeof data !== 'undefined' ? data : null;
                }
                this.companyReview = this.companyCheck !== null;

            return this.companyCheck;
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
            return this.transportData.application_type === 'Driver and Owner' || this.transportData.application_type === 'Driver and owner';
        },

         TaxReview() {
             if (this.transportData.kra_pin_verification === null || this.transportData.kra_pin_verification === '') {
                    this.taxCheck = null;
                } else {
                    const data = typeof this.transportData.kra_pin_verification === 'string' ? JSON.parse(this.transportData.kra_pin_verification) : this.transportData.kra_pin_verification;

                    this.taxCheck = typeof data !== 'undefined' ? data : null;
                }
                this.taxReview = this.taxCheck !== null;

            return this.taxCheck;
        },

           IdentityReview() {
             if (this.transportData.identity_check === null || this.transportData.identity_check === '') {
                    this.identityCheck = null;
                } else {
                    const data = typeof this.transportData.identity_check === 'string' ? JSON.parse(this.transportData.identity_check) : this.transportData.identity_check;

                    this.identityCheck = typeof data !== 'undefined' ? data : null;
                }
                this.identityReview = this.identityCheck !== null;

            return this.identityCheck;
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
        routeName() {
          return this.$route.name;
        },
        transporterStatus() {
            let status;
            switch (this.transportData.review_status) {
               case 0:
                status = 'pending';
                break;
              case 1:
                status = 'reviewed';
                break;
               case 2:
                status = 'ongoing';
                break;
               case 3:
                status = 'inconsistencies';
                break;
               case 4:
                status = 'resolved';
                break;
               case null:
                status = 'pending';
                break;
              default:
                 status = 'N/A';
                break;
            }
            return status;
          },

     },
      watch: {
        current_verification(data) {
            this.transportData = data;
        },
        async getUpdateStatus(status) {
             this.updateStatus = status;
             if (status) {
                await this.retrieveSingleTransporter(this.$route.params.id);
                this.companyCheck = this.IDReview;
                this.taxReview = this.TaxReview;
                this.identityReview = this.IdentityReview;
             }
         },
    },
    mounted() {
       this.companyCheck = this.IDReview;
       this.taxCheck = this.TaxReview;
      this.identityCheck = this.IdentityReview;
    },
     methods: {
        checkReviewStatus() {
            if (this.isBusiness) {
                return this.companyReview && this.taxReview;
            } else if (this.isDriverOwner) {
              return this.identityReview && this.taxReview;
            } else if (this.isOwner) {
              return this.identityReview && this.taxReview;
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
           return this.$router.go(-1);
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
            case 'Driver and Owner':
              title = 'Driver and Owner';
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
