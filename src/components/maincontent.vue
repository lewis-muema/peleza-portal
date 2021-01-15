<template>
      <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="11" :class="{ 'login-holder': !authenticated || isSingleView }">
          <div class="" :class="{ 'main-holder': authenticated && !isSingleView , 'single-view-holder': isSingleView }">
              <filterBar v-if="authenticated && !isSingleView"/>
              <router-view></router-view>
          </div>
        </el-col>
</template>
<script>
import filterBar from './filterbar.vue';

export default {
    name: 'MainContent',
    components: { filterBar },
    props: ['authenticated', 'isSingleView'],
};
</script>
