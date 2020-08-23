<template xmlns:router-link="">
  <div class="stageone">
      <applicantList :category="category"/>
  </div>
</template>
<script>
import applicantList from '../shared/applicantList.vue';

export default {
    name: 'DriverList',
    components: { applicantList },
    data() {
        return {
            category: 'drivers',
        };
    },
};
</script>
