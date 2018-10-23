<template>
  <div class="vehicle-details">
       <el-card header="Vehicle Details Verification" class="box-card vehicle-details__details">
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
                        <el-option
                        v-for="(vendor, index) in vendor_types"
                        :key="index"
                        :label="vendor"
                        :value="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Make" :label-width="'25%'">
                    <el-input v-model="current_verification.vehicle_details.make" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Model" :label-width="'25%'">
                    <el-input v-model="current_verification.vehicle_details.model" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Box" :label-width="'25%'" v-show="vendor_types[Number(current_verification.vehicle_details.vendor_type - 1)] == 'Bike'">
                    <el-radio-group v-model="current_verification.vehicle_details.box">
                        <el-radio label="1">
                          Box
                        </el-radio>
                        <el-radio label="0">
                          No Box
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Refrigerated" :label-width="'25%'" v-show="vendor_types[Number(current_verification.vehicle_details.vendor_type - 1)] !== 'Bike'" >
                    <el-radio-group v-model="current_verification.vehicle_details.refrigerated">
                        <el-radio label="1">
                          Refrigerated
                        </el-radio>
                        <el-radio label="0">
                          Not Refrigerated
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Closed" :label-width="'25%'" v-show="vendor_types[Number(current_verification.vehicle_details.vendor_type - 1)] !== 'Bike'">
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
       <div class="vehicle-details__docs">
           <doc
            :src="current_verification.docs.log_book.image"
            :title="'Logbook'"
            :context="'log_book'"
            :valid="current_verification.docs.log_book.validity"
            :verification="true"
            @yes="verify('log_book', true)"
            @no="verify('log_book', false)"/>
           <doc
            :src="current_verification.docs.insurance.image"
            :title="'Insurance'"
            :context="'insurance'"
            :valid="current_verification.docs.insurance.validity"
            :verification="true"
            @yes="verify('insurance', true)"
            @no="verify('insurance', false)"/>
           <doc
            :src="current_verification.docs.vehicle_photo.image"
            :title="'Vehicle Photo'"
            :context="'vehicle_photo'"
            :wide="true"
            :valid="current_verification.docs.vehicle_photo.validity"
            :verification="true"
            @yes="verify('vehicle_photo', true)"
            @no="verify('vehicle_photo', false)"/>
       </div>
  </div>
</template>
<script>
import doc from './doc'
export default {
  name: 'vehicle-details',
  components: {doc},
  data() {
      return {
          vendor_types: VENDOR_TYPES
      }
  },
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
      return this.$store.getters.current_verification;
    }
  }
}
</script>
<style>
  .el-radio {
    margin-left: 0px;
  }
</style>
