<template xmlns:router-link="">
  <div class="stageone">
      <applicantList :category="category" :sub-category="this.$route.name" />

  </div>
</template>
<script>
import applicantList from '../shared/applicantList.vue';

export default {
    name: 'InconsitenciesList',
    components: { applicantList },
     data() {
        return {
            category: 'inconsistencies',
        };
    },
};
</script>
