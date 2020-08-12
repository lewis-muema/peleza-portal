<template>
      <el-col :xs="24" :sm="19" :md="19" :lg="19" :xl="11" :class="{ 'login-holder': !authenticated }">
          <el-main class="main-content" :class="{ 'main-holder': authenticated }">
              <router-view></router-view>
          </el-main>
        </el-col>
</template>
<script>
export default {
    name: 'MainContent',
    props: ['authenticated'],
};
</script>
