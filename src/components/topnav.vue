<template>
  <el-menu theme="dark" :default-active="current_route" mode="horizontal" router class="nav">
    <span class="nav__logo el-menu-item">Partner Onboarding Admin</span>
    <input class="nav__search" type="search" placeholder="Search" v-model="search_term" @input="search"/>
    <div class="nav__links">
    <!-- <el-menu-item index="/">Dashboard</el-menu-item> -->
    <el-menu-item class="ml" index="/stageone" :class="{'is-active':(current_route === 'stageone')}" exact replace>Stage 1</el-menu-item>
    <el-menu-item :class="{'is-active':(current_route === 'approved')}" index="/approved" exact replace>Approved</el-menu-item>

    </div>
    <el-submenu index="6" class="nav__session">
      <template slot="title">
      <img
      style="
          height: 40px;
          width: 40px;
          border-radius: 50%;
          margin-right: 10px;
      "
      :src="`http://care.sendyit.com/customer/include/team/${user.pic}`"/>
      <span>{{ user.name }}</span>
      </template>
      <div class="el-menu-item" @click="logout">Logout</div>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  name: 'topnav',
  data(){
    return {
      search_term: ''
    }
  },
  computed: {
    current_route() {
      return this.$route.name
    },
    user() {
      return JSON.parse(localStorage.user)
    }
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.search_term = '';
      })
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.replace('/');
    },
    search(ev) {
      this.$store.commit('search', ev.target.value.split(' ').join('').toLowerCase());
    }
  }
}
</script>
<style>
.el-table .cell{
    word-break: initial;
}
</style>
