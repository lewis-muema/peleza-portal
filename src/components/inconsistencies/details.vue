<template>
  <div>
      <applicantDetails :category="category"/>
  </div>
</template>
<script>
import applicantDetails from '../shared/applicantDetails.vue';

export default {
    name: 'inconsistenciesDetails',
    components: { applicantDetails },
    data() {
        return {
            category: 'inconsistencies',
        };
    },
};
</script>
