<template>
      <el-col :xs="24" :sm="19" :md="19" :lg="19" :xl="11" :class="{ 'login-holder': !authenticated || isSingleView }">
          <div class="main-content" :class="{ 'main-holder': authenticated, 'single-view-holder': isSingleView }">
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
