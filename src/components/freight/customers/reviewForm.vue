<template>
       <el-card header="Submit Applicant" class="applicant-details__submit-review" v-if="validSubmit">
            <el-form>
                    <el-form-item>
                        <el-select v-model="applicant_review.status" placeholder="Please select" clearable class="select-review">
                            <el-option v-for="item in recommendationOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="applicant_review.status === 3 && applicant_review.status !== ''">
                        <el-input type="textarea" :rows="4" placeholder="Reason" class="review-reason" v-model="applicant_review.reason"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="submit-review-button" @click="submitApplicantReview" :disabled="!validSubmitStatus">Submit</el-button>
                </el-form-item>
            </el-form>
        </el-card>
</template>

<script>
import generalMixin from '../../../mixins/general_mixin';

export default {
    name: 'ReviewForm',
    mixins: [generalMixin],

    props: ['validSubmit', 'userType'],
    data() {
        return {
              applicant_review: {
                status: '',
                reason: 'recommended for approval',
                category: 'valid',
            },
        };
    },
    computed: {
        validSubmitStatus() {
            if (this.applicant_review.status === '') {
                return false;
            } else {
                if (this.applicant_review.status === false) {
                if (this.applicant_review.reason === '') {
                    return false;
                } else {
                    return true;
                }
                } else {
                return true;
                }
            }
        },
         recommendationOptions() {
            const options = [
              {
                value: 1,
                label: 'Recommended',
              },
              {
                value: 3,
                label: 'Not Recommended',
              },
            ];
            return options;
        },
    },
    methods: {
          async submitApplicantReview() {
           this.$emit('customerReview', this.applicant_review);
        },
    },

};
</script>

<style>
.is-disabled {
    background-color: #eef1f6 !important;
    border-color: #d1dbe5 !important;
    color: #bfcbd9 !important;
}

</style>
