<template>
    <div class="applicant-details">
        <div class="applicant-details__back" @click="handleBack">
            <img src="../../assets/left-arrow.png" class="applicant-details__back_image"/>
            <div class="applicant-details__back_text">
                Back
            </div>
        </div>
        <div class="applicant-details__profile">
            <el-card class="applicant-details__profile__personal-details">
                <div class="applicant-details__profile_content">
                    <img :src="current_verification.docs.driver_photo.image" class="applicant-details__profile_image"/>

                    <div class="applicant-details__profile_row">
                        <div class="applicant-details__profile_label">
                            ID NUMBER
                        </div>
                        <div class="applicant-details__profile_value">
                            {{current_verification.personal_details.id_no}}
                        </div>
                    </div>

                    <div class="applicant-details__profile_row">
                        <div class="applicant-details__profile_label">
                            KRA PIN
                        </div>
                        <div class="applicant-details__profile_value">
                            {{current_verification.personal_details.kra_pin}}
                        </div>
                    </div>
                    <div class="applicant-details__profile_row">
                        <div class="applicant-details__profile_label">
                            DATE OF APPLICATION
                        </div>
                        <div class="applicant-details__profile_value">
                            {{current_verification.dates.date_created}}
                        </div>
                    </div>

                    <div class="applicant-details__profile_row">
                        <div class="applicant-details__profile_label">
                            STATUS
                        </div>
                        <div class="applicant-details__profile_value">
                            Applied
                        </div>
                    </div>

                </div>
            </el-card>
            <el-card header="Activity Log" class="applicant-details__profile__personal-details">

            </el-card>
        </div>
        <div class="applicant-details__data">
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item name="1">
                    <template slot="title">
                    <span style="">
                        Identity Check
                    </span>

                        <span style="float: right; padding-right: 10px">
                        ID Number : {{current_verification.personal_details.id_no}}
                    </span>

                    </template>

                    <el-form :model="current_verification.owner_details">
                        <el-form-item label="Name of Applicant" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Date of Birth" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Place of Birth" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Gender" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Attach Id Card" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>

                </el-collapse-item>
                <el-collapse-item title="Criminal Records Check" name="2">
                    <el-form :model="current_verification.owner_details">
                        <el-form-item label="Name of Applicant" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Criminal History" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Authenticity" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Id Number" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Refrence Number" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="Driving License Check" name="3">

                   <el-form :model="current_verification.owner_details">
                        <el-form-item label="Name of Applicant" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="DL Number" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Date of Issue" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Expiry Date" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Classes" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                       <el-form-item label="Id Number" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item name="4">
                    <template slot="title">
                     <span>
                         Motor Vehicle Records Check
                     </span>
                        <span style="float: right; padding-right: 10px">
                           Number Plate : {{current_verification.vehicle_details.registration_no}}
                      </span>
                    </template>

                    <el-form :model="current_verification.owner_details">
                        <el-form-item label="Ownership Details and Address" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Vehicle Insurance Validity" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Vehicle Make" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Vehicle Body Type" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Engine No" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                       <el-form-item label="Year of Manufacture" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Caveats" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="KRA Pin Number of Owner" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="Car Insurance Validity" name="5">

                     <el-form :model="current_verification.owner_details">
                        <el-form-item label="Name of Owner" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Vehicle Number Plate" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Issue Date" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Expiry Date" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Validity" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                       <el-form-item label="Policy Number" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item name="6">
                    <template slot="title">
                     <span>
                        KRA PIN Verification
                     </span>
                        <span style="float: right; padding-right: 10px">
                         KRA PIN NUMBER  {{current_verification.vehicle_details.kra_pin}}
                      </span>
                    </template>

                    <el-form :model="current_verification.owner_details">
                        <el-form-item label="Validity" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Name" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Pin Number" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Tax Obligations" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Date of Registration" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item name="7">
                    <template slot="title">
                     <span>
                        Next Of Kin
                     </span>
                        <span style="float: right; padding-right: 10px">
                         ID NUMBER  {{current_verification.personal_details.nok_id}}
                      </span>
                    </template>

                    <el-form :model="current_verification.owner_details">
                        <el-form-item label="Name of Next of Kin" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Date of Birth" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Where they Hail From" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="Gender" :label-width="'25%'">
                            <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                        </el-form-item>

                         <el-form-item>
                          <el-button type="primary" class="details-save-button">
                            SAVE
                          </el-button>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>

            </el-collapse>
        </div>
    </div>
</template>

<style>
    .el-radio {
        margin-left: 15px;
    }

    .applicant-details__back {
        margin-bottom: 20px;
        cursor: pointer;
        margin-top: -10px;

    }

    .applicant-details__back_image {
        width: 22px;
        display: inline-block;
    }

    .applicant-details__back_text {
        margin-top: 0px;
        display: inline-block;
        position: absolute;
        font-size: 20px;
        margin-left: 2px;
        font-weight: 300;
        text-transform: uppercase;
    }

    .applicant-details {
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 50px;
    }

    .applicant-details__profile {
        width: 30%;
        padding-right: 0px;
        margin-right: 15px;
        display: inline-block;
        float: left;

    }

    .applicant-details__profile_image {
        width: 100%;
        object-fit: cover;
        height: auto;
        max-height: 300px;
        margin-bottom: 15px;
    }

    .applicant-details__data {
        width: 65%;
        display: inline-block;
    }

    .applicant-details__profile_label {
        font-weight: 500;
        font-size: 15px;
        margin-left: 15px;
        margin-top: 15px;
    }

    .applicant-details__profile_value {
        font-weight: 300;
        font-size: 15px;
        margin-left: 15px;
        margin-top: 15px;
    }

    .el-card.applicant-details__profile__personal-details {
        overflow: hidden;
        border-radius: 20px;
        margin-bottom: 20px;
    }

    .el-collapse {
        border: none;
    }

    .el-collapse-item__header {
        margin: 5px;
        padding-top: 10px;
        padding-bottom: 20px;
        text-transform: uppercase;
        font-size: 15px;
        border: none;
    }

    .el-collapse-item is-active {
        margin-bottom: 20px;
        border: 1px solid #d1dbe5;
        border-radius: 15px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
    }

    .el-collapse-item {
        border: 1px solid #d1dbe5;
        border-radius: 15px;
        margin-bottom: 30px;
    }

    .el-collapse-item__wrap {
        margin-bottom: 30px;
        padding-top: 50px;
        margin-top: -20px;
        border-top: 1px solid #d1dbe5;
        background: transparent;
        border-bottom: none;
    }
    .details-save-button {
        float: right;
        margin-right: 5px;
        width:120px;
        height: 50px;

    }
</style>

<script>
    import doc from './doc';

    export default {
        name: 'applicant-details',
        props: ['data', 'docs'],
        components: {doc},
        data() {
            return {
                vendor_types: VENDOR_TYPES,
                comments: "",
                popover_visible: false,
                reason: "",
                lock_ui: false,
                valid_docs: [],
                invalid_docs: [],
                current_verification: this.$store.getters.current_verification
            }
        },
        beforeMount() {
            let new_verification = this.current_verification;

            console.log(new_verification);
            this.createValidDocs(new_verification);
            this.createInvalidDocs(new_verification);

            console.log(this.invalid_docs);

        },
        created() {

            $eventBus.$on('doc-validity', doc_validity => {
                let doc = doc_validity["doc"];
                let status = doc_validity["status"];
                console.log(doc_validity);
                this.verify(doc, status);
                console.log(this.invalid_docs);
                console.log(this.valid_docs);


            });
        },
        methods: {
            verify(doc, status) {
                console.log('verify!', doc, status);
                let new_verification = Object.assign({}, this.current_verification);
                new_verification.docs[doc].validity = status;
                this.current_verification.docs[doc].valid = status;
                this.$store.commit('changeVerification', new_verification);
                this.createValidDocs(new_verification);
                this.createInvalidDocs(new_verification);
                console.log(new_verification);
                this.$forceUpdate();
            },
            save() {
                this.lock_ui = true;
                let payload = {
                    admin_id: JSON.parse(localStorage.user).admin_id,
                    admin_name: JSON.parse(localStorage.user).name,
                    driver: Object.assign({}, this.current_verification),
                    docs: Object.assign({}, this.current_verification.docs),
                    status: 'save',
                    send_email: true,
                    email_content: {
                        email_type: 'invalid_docs',
                        email_address: this.current_verification.personal_details.email,
                        invalid_docs: this.invalid_docs.map(doc => doc.split(' ').join('_').toLowerCase())
                    }
                }
                if (this.comments.length > 0) payload.comments = this.comments;
                delete payload.driver.docs;
                axios.post(BASE_URL + 'approve', payload)
                    .then((response) => {
                        this.lock_ui = false;
                        this.$notify.success({
                            title: 'Saving Successful',
                            message: 'Successfully saved activity and sent email to partner'
                        });
                        this.$emit('finished');
                    })
                    .catch((error) => {
                        this.lock_ui = false;
                        this.$notify.error({
                            title: 'Saving Failed',
                            message: 'Failed to save the rider. Please try again'
                        });
                        log(error);
                        throw new Error('Failed to save the rider status');
                    })
            },
            approve() {
                this.lock_ui = true;
                let payload = {
                    admin_id: JSON.parse(localStorage.user).admin_id,
                    admin_name: JSON.parse(localStorage.user).name,
                    driver: Object.assign({}, this.current_verification),
                    docs: Object.assign({}, this.current_verification.docs),
                    status: 'approve',
                    send_email: true,
                    email_content: {
                        email_type: 'approved',
                        email_address: this.current_verification.personal_details.email
                    }
                }
                if (this.comments.length > 0) payload.comments = this.comments;
                delete payload.driver.docs;
                axios.post(BASE_URL + 'approve', payload)
                    .then((response) => {
                        if (response.data.status) {
                            this.lock_ui = false;
                            this.$notify.success({
                                title: 'Approval Successful',
                                message: 'Successfully reviewed partner and sent login details to test account'
                            });
                            this.$emit('finished');
                        } else {
                            this.lock_ui = false;
                            this.$notify.error({
                                title: 'Approval Failed',
                                message: response.data.message
                            });

                        }

                    })
                    .catch((error) => {
                        this.lock_ui = false;
                        this.$notify.error({
                            title: 'Approval Failed',
                            message: 'Please try again'
                        });
                        log(error);
                        throw new Error('Failed to approve rider. Please try again');
                    });
            },
            reject() {
                if (this.reason.length == 0) {
                    this.$message({
                        showClose: true,
                        message: 'Please comment on the rejection',
                        type: 'error'
                    });
                    return;
                }
                this.popover_visible = false;
                this.lock_ui = true;
                let payload = {
                    admin_id: JSON.parse(localStorage.user).admin_id,
                    admin_name: JSON.parse(localStorage.user).name,
                    driver: Object.assign({}, this.current_verification),
                    docs: Object.assign({}, this.current_verification.docs),
                    status: 'reject',
                    reason: this.reason,
                    send_email: true,
                    email_content: {
                        email_type: 'rejected'
                    }
                }
                if (this.comments.length > 0) payload.comments = this.comments;
                delete payload.driver.docs;
                axios.post(BASE_URL + 'approve', payload)
                    .then((response) => {
                        this.lock_ui = false;
                        this.$notify.success({
                            title: 'Rejection Done',
                            message: 'Sent rejection email to partner'
                        });
                        this.$emit('finished');
                    })
                    .catch((error) => {
                        this.lock_ui = false;
                        this.$notify.error({
                            title: 'Rejection Failed',
                            message: 'Please try again'
                        });
                        log(error);
                        throw new Error('Failed to reject rider. Please try again');
                    });
            },
            createValidDocs(new_verification) {
                this.current_verification = new_verification;
                let valid_docs = [];
                if (this.current_verification.docs.driving_licence ? this.current_verification.docs.driving_licence.validity : this.current_verification.docs.driving_license.validity) valid_docs.push('Driving License');
                if (this.current_verification.docs.good_conduct.validity) valid_docs.push('Good Conduct');
                if (this.current_verification.docs.id_card.validity) valid_docs.push('ID Card');
                if (this.current_verification.docs.kra_pin_cert.validity) valid_docs.push('KRA PIN Cert');
                if (this.current_verification.has_owner) {
                    if (this.current_verification.docs.insurance.validity) valid_docs.push('Insurance');
                    if (this.current_verification.docs.log_book.validity) valid_docs.push('Log Book');
                    if (this.current_verification.docs.vehicle_photo.validity) valid_docs.push('Vehicle Photo');
                }
                this.valid_docs = valid_docs;
            },
            createInvalidDocs(new_verification) {
                this.current_verification = new_verification;
                let invalid_docs = [];
                // check availability of document before checking its validity
                if (this.current_verification.docs.driving_licence.available) {
                    if (!(this.current_verification.docs.driving_licence ? this.current_verification.docs.driving_licence.validity : this.current_verification.docs.driving_license.validity)) invalid_docs.push('Driving License');

                }
                if (this.current_verification.docs.good_conduct.available) {
                    if (!this.current_verification.docs.good_conduct.validity) invalid_docs.push('Good Conduct');

                }
                if (!this.current_verification.docs.id_card.validity) invalid_docs.push('ID Card');
                if (!this.current_verification.docs.kra_pin_cert.validity) invalid_docs.push('KRA PIN Certificate');
                if (this.current_verification.has_owner) {
                    if (!this.current_verification.docs.insurance.validity) invalid_docs.push('Insurance');
                    if (!this.current_verification.docs.log_book.validity) invalid_docs.push('Log Book');
                    if (!this.current_verification.docs.vehicle_photo.validity) invalid_docs.push('Vehicle Photo');
                }
                this.invalid_docs = invalid_docs;
            },
            handleBack() {
                this.$router.push({name: 'applicants'});
            }
        },
        computed: {
            // current_verification() {
            //     return this.$store.getters.current_verification;
            // }
        },
        watch: {
            current_verification: function (old_val, new_val) {
                console.log('verification changed');
            }
        }
    }
</script>
