<template>
  <div class="personal-details">
    <el-card header="Personal Details Verification" class="box-card personal-details__details">
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
        <el-form-item label="Next of Kin Relationship" :label-width="'25%'" v-if="current_verification.personal_details.nok_relatioship">
          <el-input v-model="current_verification.personal_details.nok_relatioship" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="Next of Kin ID Number" :label-width="'25%'" v-if="current_verification.personal_details.nok_id">
          <el-input v-model="current_verification.personal_details.nok_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Next of Kin Phone" :label-width="'25%'" v-if="current_verification.personal_details.nok_phone">
          <el-input v-model="current_verification.personal_details.nok_phone" auto-complete="off"></el-input>
        </el-form-item>


      </el-form>
    </el-card>
    <div class="personal-details__docs">
      <doc
        v-if="(current_verification.docs.driver_photo && current_verification.docs.driver_photo.available)"
        :src="current_verification.docs.driver_photo.image"
        :title="'Driver Photo'"
        :context="'driver_photo'"
        :valid.sync="current_verification.docs.driver_photo.validity"
        :verification="true"
        @yes="verify('driver_photo', true)"
        @no="verify('driver_photo', false)"/>
      <doc
        :src="current_verification.docs.id_card.image"
        :title="'Identification Doc'"
        :context="'id_card'"
        :valid.sync="current_verification.docs.id_card.validity"
        :verification="true"
        @yes="verify('id_card', true)"
        @no="verify('id_card', false)"/>

      <doc
        v-if="(current_verification.docs.kra_pin_cert && current_verification.docs.kra_pin_cert.available)"
        :src="current_verification.docs.kra_pin_cert.image"
        :title="'KRA Certificate'"
        :context="'kra_pin_cert'"
        :valid.sync="current_verification.docs.kra_pin_cert.validity"
        :verification="true"
        :expiry="new Date()"
        @yes="verify('kra_pin_cert', true)"
        @no="verify('kra_pin_cert', false)"/>
      <doc
        v-if="(current_verification.docs.good_conduct && current_verification.docs.good_conduct.available)"
        :src="current_verification.docs.good_conduct.image"
        :title="'Good Conduct'"
        :context="'good_conduct'"
        :valid.sync="current_verification.docs.good_conduct.validity"
        :verification="true"
        :expiry="new Date()"
        @yes="verify('good_conduct', true)"
        @no="verify('good_conduct', false)"/>
      <doc
        v-if="(current_verification.docs.driving_licence && current_verification.docs.driving_licence.available)"
        :src="current_verification.docs.driving_licence ? current_verification.docs.driving_licence.image : current_verification.docs.driving_license.image"
        :title="'Driving License'"
        :context="'driving_licence'"
        :valid.sync="current_verification.docs.driving_licence ? current_verification.docs.driving_licence.validity : current_verification.docs.driving_license.validity"
        :verification="true"
        :expiry="new Date()"
        @yes="verify((current_verification.docs.driving_licence ? 'driving_licence' : 'driving_license'), true)"
        @no="verify((current_verification.docs.driving_licence ? 'driving_licence' : 'driving_license'), false)"/>
    </div>
  </div>
</template>
<script>
import doc from './doc'
export default {
  name: 'personal-details',
  components: {doc},
  props: ['data', 'docs'],
  methods: {
    verify(doc, status) {
      console.log('verify!', doc, status);
      let new_verification = Object.assign({}, this.current_verification);
      new_verification.docs[doc].validity = status;
      this.current_verification.docs[doc].valid = status;
      this.$store.commit('changeVerification', new_verification);
      this.$forceUpdate();
    }
  },
  computed: {
    current_verification() {
      console.log(this.$store.getters.current_verification);
      return this.$store.getters.current_verification;
    }
  }
}
</script>
