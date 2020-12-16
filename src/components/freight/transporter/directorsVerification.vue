<template>
    <div>
        <el-form v-if="!reviewedStatus">
            <el-form-item label="ID Number" >
             <el-input type="text" v-model="form.id_no" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                 <el-button type="primary" class="details-save-button" @click="createReviewData(index)">SAVE</el-button>
            </el-form-item>
        </el-form>
         <div class="review_wrap" v-if="reviewedStatus">
                <div class="el-row">
                <div class="el-col-lg-16 review-details">
                    <div class="el-row" >
                        <div class="review-title">ID NUmber</div>
                        <div class="review-desc">{{ directorCheck === null ? 'N/A' : directorCheck.id_no }}</div>
                    </div>
                </div>
                <div class="el-col-lg-8 review-image">
                    <div class="review-edit" @click="handleReviewEdit('identity_check')">Edit</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
    name: 'DirectorsVerification',
    props: ['director', 'index'],
    data() {
        return {
        form:
                {
                    id_no: '',
                },
         directorCheck: null,
         reviewedStatus: false,

        };
    },
    computed: {
        ...mapGetters(['current_verification']),
            transporterData() {
                return this.current_verification;
            },
        IDReview() {
             if (this.transporterData.director_id_check === null || this.transporterData.director_id_check === '') {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.directorCheck = null;
                } else {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    const data = typeof this.transporterData.director_id_check === 'string' ? JSON.parse(this.transporterData.director_id_check) : this.transporterData.director_id_check;
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.directorCheck = typeof data[this.index] !== 'undefined' ? data[this.index] : null;
                }
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.reviewedStatus = this.directorCheck !== null;

            return this.directorCheck;
        },
    },
    watch: {
        current_verification(data) {
            this.transporterData = data;
        },
      },
    mounted() {
        this.directorCheck = this.IDReview;
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
                    directorArray[index1] = this.form;
                }
                this.transporterData.director_id_check = directorArray;
                 this.reviewedStatus = true;
                 this.$store.commit('changeVerification', this.transporterData);


              this.$emit('directorReview', directorArray);
           },
         handleReviewEdit(section) {
            this.reviewedStatus = false;
         },
     },

};
</script>

<style>

</style>
