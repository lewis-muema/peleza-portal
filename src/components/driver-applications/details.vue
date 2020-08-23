<template>
  <div>
      <applicantDetails :category="category"/>
  </div>
</template>
<script>
import applicantDetails from '../shared/applicantDetails.vue';

export default {
    name: 'PendingDetails',
    components: { applicantDetails },
    data() {
        return {
            category: 'driver-applications',
        };
    },
};
</script>
