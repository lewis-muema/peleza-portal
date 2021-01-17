<template>
    <div>
        <el-form v-if="!reviewedStatus" :key="componentDirectors">
            <el-form-item label="ID Number" >
             <el-input type="text" v-model="form.id_no" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                 <el-button type="primary" class="details-save-button" @click="createReviewData(index)">SAVE</el-button>
            </el-form-item>
        </el-form>
         <div class="review_wrap" v-if="reviewedStatus">
             <div v-if="loading">loading...</div>
                <div v-else class="el-row">
                <div class="el-col-lg-16 review-details">
                    <div class="el-row" v-if="!loading">
                        <div class="review-title">ID NUmber</div>
                        <div class="review-desc">{{ directorCheck === null ? 'N/A' : directorCheck.id_no }}</div>
                    </div>
                </div>
                <div class="el-col-lg-8 review-image" v-if="transporterData.review_status === 0 || transporterData.review_status === null || transporterData.review_status === 2">
                    <div class="review-edit" @click="handleReviewEdit('identity_check')">Edit</div>
                </div>
            </div>
        </div>
        <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant && !reviewedStatus">
            <el-form-item> <el-checkbox v-model="form.inconsistency" id="identity_inconsistency" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
        </el-form>
            <div class="applicant--incosistency-mark" v-if="reviewedStatus && directorCheck !== null && directorCheck.inconsistency">
            Marked for Data Inconsistency
        </div>
    </div>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */

import { mapGetters, mapActions, mapMutations } from 'vuex';
import GeneralMxn from '../../../mixins/general_mixin';


export default {
    name: 'DirectorsVerification',
    mixins: [GeneralMxn],
    props: ['director', 'index'],
    data() {
        return {
            loading: false,
            componentDirectors: this.index,
        form:
                {
                    id_no: '',
                    inconsistency: false,
                },
         directorCheck: null,
         reviewedStatus: false,

        };
    },
    computed: {
        ...mapGetters(['current_verification', 'getUpdateStatus']),
            transporterData() {
                return this.current_verification;
            },
        IDReview() {
             if (this.transporterData.director_id_check === null || this.transporterData.director_id_check === '') {
                    this.directorCheck = null;
                } else {
                    const data = typeof this.transporterData.director_id_check === 'string' ? JSON.parse(this.transporterData.director_id_check) : this.transporterData.director_id_check;

                    const verifiedDirector = data.filter((elem) => {
                        if (elem.originalID === this.director.id_no) return elem;
                    });

                    const check = typeof verifiedDirector !== 'undefined' ? verifiedDirector : [];
                    this.directorCheck = check.length === 0 ? null : check[0];

                    this.directorCheck = typeof data[this.index] !== 'undefined' ? data[this.index] : null;
                }

                this.reviewedStatus = this.directorCheck !== null;

            return this.directorCheck;
        },
          isPendingApplicant() {
            return this.current_route === 'transporter';
        },
         current_route() {
            return this.$route.name;
        },
    },
    watch: {
        current_verification(data) {
            this.transporterData = data;
        },
           async getUpdateStatus(status) {
             this.updateStatus = status;
             if (status) {
                 this.loading = true;
                 this.forceRender();
                 this.directorCheck = null;
                 this.directorCheck = this.IDReview;
                 if (this.IDReview !== null) {
                      // eslint-disable-next-line no-unused-expressions
                    this.$set(this.directorCheck, this.IDReview);
                 }

                 this.loading = false;
             }
         },
      },
    mounted() {
        this.directorCheck = this.IDReview;
        if (this.directorCheck !== null) {
             this.form.id_no = this.directorCheck.id_no;
        }
    },
     methods: {
           createReviewData(index) {
                this.form.review_status = true;
                this.form.originalID = this.director.id_no;
                this.form.section = 'director_id_check';
                this.form.field_title = 'Director ID check';
                this.form.directorIndex = index;

                let directorArray = [];

                if (this.transporterData.director_id_check === null || this.transporterData.director_id_check === '') {
                    directorArray = [];
                } else {
                    directorArray = typeof this.transporterData.director_id_check === 'string' ? JSON.parse(this.transporterData.director_id_check) : this.transporterData.director_id_check;
                }

                const index1 = this.transporterData.director_id_check === null || this.transporterData.director_id_check === '' ? -1 : directorArray.findIndex(x => x.originalID === this.director.id_no);

                 if (index1 === -1) {
                    directorArray.push(this.form);
                } else {
                    directorArray[this.index] = this.form;
                }

                const field = 'director_id_check';
                this.transporterData[field] = directorArray;

                const arr = this.transporterData;
                arr.director_id_check = directorArray;

                 this.reviewedStatus = true;
                 this.$store.commit('changeVerification', arr);

              this.$emit('directorReview', directorArray);

                this.forceRender();
                 this.directorCheck = null;
                 this.directorCheck = this.IDReview;
                  if (this.IDReview !== null) {
                    // eslint-disable-next-line no-unused-expressions
                    this.$set(this.directorCheck, this.IDReview);
                  }
                 this.loading = false;
           },
         handleReviewEdit(section) {
            this.loading = true;
                 this.forceRender();
                 this.directorCheck = null;
                 this.directorCheck = this.IDReview;
                  if (this.IDReview !== null) {
                    // eslint-disable-next-line no-unused-expressions
                    this.$set(this.directorCheck, this.IDReview);
                  }
                 this.loading = false;

            this.reviewedStatus = false;
         },
         forceRender() {
             this.componentDirectors += 1;
         },
     },

};
</script>

<style>

</style>
