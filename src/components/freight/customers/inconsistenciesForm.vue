<template>
   <el-card header="Data Inconsistency" class="applicant-details__submit-review">
            <el-alert :title="inconsistency_alert_message" type="warning" :closable="false" v-if="inconsistency_alert_status"></el-alert>
            <el-form>
              <el-form-item>
                <el-input type="textarea" :rows="4" placeholder="Reason" class="review-reason" v-model="inconsistency_message"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitDataInconsistency" :class="validInconsistency ? 'submit-review-button' : 'submit-review-button-disabled'">Submit</el-button>
              </el-form-item>
            </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'InconsistenciesForm',
    props: ['inconsistencyCheck', 'checkReviewStatus', 'validSubmitStatus'],
    data() {
        return {
            inconsistency_message: '',
            inconsistency_alert_status: false,
            inconsistency_alert_message: '',
        };
    },
    computed: {
        validInconsistency() {
            return this.inconsistencyCheck && this.inconsistency_message !== '' && this.checkReviewStatus();
        },
    },
    methods: {
         submitDataInconsistency() {
            this.inconsistency_alert_status = false;
            this.inconsistency_alert_message = '';

            if (!this.validInconsistency) {
                if (!this.validSubmitStatus) {
                this.inconsistency_alert_message = 'review all sections before you can submit inconsistency';
                } else {
                this.inconsistency_alert_message = 'include a detailed inconsistency message to guide the applicant';
                }
                this.inconsistency_alert_status = true;
                return 0;
            }
            const applicant_review = {
                status: 3,
                reason: this.inconsistency_message,
                category: 'inconsistencies',
            };
           this.$emit('customerReview', applicant_review);
        },

    },

};
</script>
