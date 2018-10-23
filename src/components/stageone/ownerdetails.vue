<template>
<div class="owner-details">
    <el-card header="Owner Details Verification" class="box-card owner-details__details">
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
    <div class="owner-details__docs">
         <doc
          :src="current_verification.docs.log_book.image"
          :title="'Logbook'"
          :context="'log_book'"
          :wide="true"
          :valid.sync="current_verification.docs.log_book.validity"
          :verification="true"
          @yes="verify('log_book', true)"
          @no="verify('log_book', false)"/>
        <doc
          :src="current_verification.docs.insurance.image"
          :title="'Insurance'"
          :context="'insurance'"
          :wide="true"
          :valid.sync="current_verification.docs.insurance.validity"
          :verification="true"
          @yes="verify('insurance', true)"
          @no="verify('insurance', false)"/>
    </div>
</div>
</template>

<script>
import doc from './doc';
export default {
  name: 'owner-details',
  components: {doc},
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

