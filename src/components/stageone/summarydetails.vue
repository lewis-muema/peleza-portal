<template>
    <div class="summary-details">
        <div class="summary-details__data">
            <el-card header="Personal Details" class="summary-details__data__personal-details">
                <el-form :model="current_verification.personal_details">
                    <el-form-item label="Driver name" :label-width="'25%'">
                        <el-input v-model="current_verification.personal_details.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="ID Number" :label-width="'25%'">
                        <el-input v-model="current_verification.personal_details.id_no" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="KRA PIN" :label-width="'25%'">
                        <el-input v-model="current_verification.personal_details.kra_pin" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Next of Kin" :label-width="'25%'" v-if="current_verification.personal_details.nok_name">
                        <el-input v-model="current_verification.personal_details.nok_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Next of Kin Relationship" :label-width="'25%'" v-if="current_verification.personal_details.nok_relationship">
                        <el-input v-model="current_verification.personal_details.nok_relationship" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Next of Kin Id Number" :label-width="'25%'" v-if="current_verification.personal_details.nok_id">
                        <el-input v-model="current_verification.personal_details.nok_id" auto-complete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="Next of Kin Phone" :label-width="'25%'" v-if="current_verification.personal_details.nok_phone">
                        <el-input v-model="current_verification.personal_details.nok_phone" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card header="Owner Details" class="summary-details__data__owner-details" v-if="current_verification.owner_details">
                <el-form :model="current_verification.owner_details">
                    <el-form-item label="Owner Name" :label-width="'25%'">
                        <el-input v-model="current_verification.owner_details.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Owner Phone" :label-width="'25%'">
                        <el-input v-model="current_verification.owner_details.phone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Owner ID" :label-width="'25%'">
                        <el-input v-model="current_verification.owner_details.id_no" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card header="Vehicle Details" class="summary-details__data__vehicle-details" v-if="current_verification.vehicle_details">
                <el-form :model="current_verification.vehicle_details">
                    <el-form-item label="Reg. No." :label-width="'25%'">
                        <el-input v-model="current_verification.vehicle_details.registration_no" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Insurance No." :label-width="'25%'">
                        <el-input v-model="current_verification.vehicle_details.insurance_no" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Logbook No." :label-width="'25%'">
                        <el-input v-model="current_verification.vehicle_details.log_book_no" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="PSV No." :label-width="'25%'">
                        <el-input v-model="current_verification.vehicle_details.psv_no" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Year of Man." :label-width="'25%'">
                        <el-input v-model="current_verification.vehicle_details.manufacture_year" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Vendor" :label-width="'25%'">
                        <el-select v-model="vendor_types[Number(current_verification.vehicle_details.vendor_type - 1)]" placeholder="Select">
                            <el-option v-for="(vendor, index) in vendor_types" :key="index" :label="vendor" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Make" :label-width="'25%'">
                        <el-input v-model="current_verification.vehicle_details.make" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Model" :label-width="'25%'">
                        <el-input v-model="current_verification.vehicle_details.model" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Box" :label-width="'25%'" v-if="vendor_types[Number(current_verification.vehicle_details.vendor_type - 1)] == 'Bike'">
                        <el-radio-group v-model="current_verification.vehicle_details.box">
                            <el-radio label="1">
                              Box
                            </el-radio>
                            <el-radio label="0">
                              No Box
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="Refrigerated" :label-width="'35%'"  v-if="vendor_types[Number(current_verification.vehicle_details.vendor_type - 1)] !== 'Bike'">
                        <el-radio-group v-model="current_verification.vehicle_details.refrigerated">
                            <el-radio label="1">
                              Refrigerated
                            </el-radio>
                            <el-radio label="0">
                              Not Refrigerated
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="Closed" :label-width="'25%'" v-if="vendor_types[Number(current_verification.vehicle_details.vendor_type - 1)] !== 'Bike'">
                        <el-radio-group v-model="current_verification.vehicle_details.closed">
                            <el-radio label="1">
                              Closed
                            </el-radio>
                            <el-radio label="0">
                              Not Closed
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-card>

        </div>
        <div class="summary-details__docs">
            <doc
            v-if="current_verification.docs.driver_photo && current_verification.docs.driver_photo.available"
        :src="current_verification.docs.driver_photo.image"
        :title="'Driver Photo'"
        :context="'driver_photo'"
        :valid.sync="current_verification.docs.driver_photo.validity"
        :verification="true"
        @yes="verify('driver_photo', true)"
        @no="verify('driver_photo', false)"/>
            <doc  :src="current_verification.docs.id_card.image" :title="'Identification Doc'" :valid.sync="current_verification.docs.id_card.validity" :verification="true" :context="'id_card'" @yes="verify('id_card', true)" @no="verify('id_card', false)" />
            <doc :src="current_verification.docs.kra_pin_cert.image" :title="'KRA Certificate'" :valid.sync="current_verification.docs.kra_pin_cert.validity" :verification="true" :context="'kra_pin_cert'" :expiry="new Date()" @yes="verify('kra_pin_cert', true)" @no="verify('kra_pin_cert', false)" />
            <doc v-if="current_verification.docs.good_conduct && current_verification.docs.good_conduct.available"
                 :src="current_verification.docs.good_conduct.image" :title="'Good Conduct'" :valid.sync="current_verification.docs.good_conduct.validity" :verification="true" :context="'good_conduct'" :expiry="new Date()" @yes="verify('good_conduct', true)" @no="verify('good_conduct', false)" />
            <doc  v-if="current_verification.docs.driving_licence && current_verification.docs.driving_licence.available"
                  :src="current_verification.docs.driving_licence ? current_verification.docs.driving_licence.image : current_verification.docs.driving_license.image" :title="'Driving License'" :valid.sync="current_verification.docs.driving_licence ? current_verification.docs.driving_licence.validity : current_verification.docs.driving_license.validity" :verification="true" :context="'driving_licence'" :expiry="new Date()" @yes="verify((current_verification.docs.driving_licence ? 'driving_licence' : 'driving_license'), true)" @no="verify((current_verification.docs.driving_licence ? 'driving_licence' : 'driving_license'), false)" />
            <doc v-if="current_verification.vehicle_details" :src="current_verification.docs.log_book.image" :title="'Logbook'" :valid.sync="current_verification.docs.log_book.validity" :verification="true" :context="'log_book'" @yes="verify('log_book', true)" @no="verify('log_book', false)" />
            <doc v-if="current_verification.vehicle_details" :src="current_verification.docs.insurance.image" :title="'Insurance'" :valid.sync="current_verification.docs.insurance.validity" :verification="true" :context="'insurance'" @yes="verify('insurance', true)" @no="verify('insurance', false)" />
            <doc v-if="current_verification.vehicle_details" :src="current_verification.docs.vehicle_photo.image" :title="'Vehicle Photo'" :valid.sync="current_verification.docs.vehicle_photo.validity" :verification="true" :context="'vehicle_photo'" @yes="verify('vehicle_photo', true)" @no="verify('vehicle_photo', false)" /> </div>
        <el-card header="Summary" class="summary-details__details">
            <div class="summary-details__details__verified" v-if="valid_docs.length > 0">
                <h3 class="summary-details__details__verified__title">Verified</h3>
                <ul class="summary-details__details__verified__content">
                    <li class="summary-details__details__verified__doc" v-for="(doc, i) in valid_docs" :key="i">{{ doc }}</li>
                </ul>
            </div>
            <div class="summary-details__details__blockers" v-if="invalid_docs.length > 0">
                <h3 class="summary-details__details__blockers__title">Blockers</h3>
                <ul class="summary-details__details__blockers__content">
                    <li class="summary-details__details__blockers__blocker" v-for="(doc, i) in invalid_docs" :key="i">{{ doc }}</li>
                </ul>
            </div>
            <div class="summary-details__details__email">
                <h3 class="summary-details__details__email__title">Email Preview</h3>
                <div class="summary-details__details__email__content" v-if="invalid_docs.length == 0">
                    Dear {{current_verification.personal_details.name.split(' ')[0]}},
                    <div>
                        <p>Thank you for applying to Sendy.</p>
                        <p>We have good news. You have been approved as a partner on our platform.</p>
                        <p>Please come to the Sendy Office for your interview/training on <br><b>{{ current_verification.dates.interview_date }}</b> </p>
                    </div>
                    <b v-if="comments.length > 0">Note: </b>{{comments}}
                    <p>Thank you!</p>
                </div>
                <div class="summary-details__details__email__content" v-if="invalid_docs.length > 0">
                    Dear {{current_verification.personal_details.name.split(' ')[0]}},
                    <div>
                        <p>Thank you for applying to Sendy. However, you have a few errors in your application.</p>
                        <ul>
                            <li v-for="(doc, i) in invalid_docs" :key="i">{{ doc }}</li>
                        </ul>
                        <p>Please reupload these documents on this link <a href="https://sendyit.com/partner_onboarding/reupload/">https://sendyit.com/partner_onboarding/reupload/</a></p>
                    </div>
                    <b v-if="comments.length > 0">Note: </b>{{comments}}
                    <p>Thank you!</p>
                </div>
                <el-input type="textarea" placeholder="Additional Comments" v-model="comments" class="summary-details__details__email__comments"></el-input>
            </div>
            <div class="summary-details__details__buttons">
                <button class="summary-details__details__button" @click="save" v-if="invalid_docs.length > 0">Save & Send Email</button>
                <button class="summary-details__details__button success" v-if="!(invalid_docs.length > 0)" :disabled="invalid_docs.length > 0 ? true : false" @click="approve" v-loading.fullscreen.lock="lock_ui">Approve</button>
                <el-popover
                ref="rejection_popover"
                placement="top"
                width="240"
                v-model="popover_visible">
                <el-input type="textarea" placeholder="Please comment on the rejection" v-model="reason"></el-input>
                <div style="text-align: right; margin: 0; margin-top: 15px;">
                    <el-button size="mini" type="text" @click="popover_visible = false">cancel</el-button>
                    <el-button type="primary" size="mini" @click="reject" v-loading.fullscreen.lock="lock_ui">confirm</el-button>
                </div>
                </el-popover>
                <el-button class="summary-details__details__button error" v-popover:rejection_popover v-loading.fullscreen.lock="lock_ui">Reject</el-button>
            </div>
        </el-card>
    </div>
</template>

<style>
  .el-radio {
    margin-left: 15px;
  }
</style>

<script>
import doc from './doc';

export default {
    name: 'summary-details',
    props: ['data', 'docs'],
    components: { doc },
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
          this.verify(doc,status);
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
            if(this.comments.length > 0) payload.comments = this.comments;
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
            if(this.comments.length > 0) payload.comments = this.comments;
            delete payload.driver.docs;
            axios.post(BASE_URL + 'approve', payload)
            .then((response) => {
                if(response.data.status){
                  this.lock_ui = false;
                  this.$notify.success({
                      title: 'Approval Successful',
                      message: 'Successfully approved partner and sent login details to test account'
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
            if(this.reason.length == 0) {
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
            if(this.comments.length > 0) payload.comments = this.comments;
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
            if(this.current_verification.docs.driving_licence ? this.current_verification.docs.driving_licence.validity : this.current_verification.docs.driving_license.validity) valid_docs.push('Driving License');
            if(this.current_verification.docs.good_conduct.validity) valid_docs.push('Good Conduct');
            if(this.current_verification.docs.id_card.validity) valid_docs.push('ID Card');
            if(this.current_verification.docs.kra_pin_cert.validity) valid_docs.push('KRA PIN Cert');
            if(this.current_verification.has_owner) {
                if(this.current_verification.docs.insurance.validity) valid_docs.push('Insurance');
                if(this.current_verification.docs.log_book.validity) valid_docs.push('Log Book');
                if(this.current_verification.docs.vehicle_photo.validity) valid_docs.push('Vehicle Photo');
            }
            this.valid_docs =  valid_docs;
        },
        createInvalidDocs(new_verification) {
            this.current_verification = new_verification;
            let invalid_docs = [];
            // check availability of document before checking its validity
            if(this.current_verification.docs.driving_licence.available){
              if(!(this.current_verification.docs.driving_licence ? this.current_verification.docs.driving_licence.validity : this.current_verification.docs.driving_license.validity)) invalid_docs.push('Driving License');

            }
            if(this.current_verification.docs.good_conduct.available){
              if(!this.current_verification.docs.good_conduct.validity) invalid_docs.push('Good Conduct');

            }
            if(!this.current_verification.docs.id_card.validity) invalid_docs.push('ID Card');
            if(!this.current_verification.docs.kra_pin_cert.validity) invalid_docs.push('KRA PIN Certificate');
            if(this.current_verification.has_owner) {
                if(!this.current_verification.docs.insurance.validity) invalid_docs.push('Insurance');
                if(!this.current_verification.docs.log_book.validity) invalid_docs.push('Log Book');
                if(!this.current_verification.docs.vehicle_photo.validity) invalid_docs.push('Vehicle Photo');
            }
            this.invalid_docs = invalid_docs;
        }
    },
    computed: {
        // current_verification() {
        //     return this.$store.getters.current_verification;
        // }
    },
    watch: {
      current_verification: function (old_val , new_val) {
        console.log('verification changed');
      }
    }
}
</script>
