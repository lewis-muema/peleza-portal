<template>
  <div>
      <applicantDetails :category="category"/>
  </div>
</template>
<script>
import applicantDetails from '../shared/applicantDetails.vue';

export default {
    name: 'ReviewedDetails',
    components: { applicantDetails },
    data() {
        return {
            category: 'reviewed',
        };
    },
};
</script>
