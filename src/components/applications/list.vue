<template xmlns:router-link="">
  <div class="stageone">
      <applicantList :category="category"/>
  </div>
</template>
<script>
import applicantList from '../shared/applicantList.vue';

export default {
    name: 'PendingList',
    components: { applicantList },
    data() {
        return {
            category: 'applicants',
        };
    },
};
</script>
