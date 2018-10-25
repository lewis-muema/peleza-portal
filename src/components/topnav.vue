<template>
  <div>
    <el-menu theme="dark" :default-active="current_route" mode="horizontal" router class="nav">
      <span class="nav__logo el-menu-item">
        <img src="../assets/sendy-logo-white.png" class="header-logo"/>
      </span>
      <div class="nav__links">
      <!-- <el-menu-item index="/">Dashboard</el-menu-item> -->
      <el-menu-item class="ml" index="/applications" :class="{'is-active':(current_route === 'applications')}" exact replace>
          Applications
      </el-menu-item>
      <el-menu-item :class="{'is-active':(current_route === 'reviewed')}" index="/reviewed" exact replace>Reviewed</el-menu-item>
      <el-menu-item :class="{'is-active':(current_route === 'renewals')}" index="/renewals" exact replace>Renewals</el-menu-item>

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
    <div class="row" v-if="current_route !== 'applicant'">
      <div class="nav-search">
          <input class="nav__search" type="search" placeholder="Search ID/KRA PIN" v-model="search_term" @input="search"/>
      </div>
    </div>
  </div>
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
<style scoped>
.header-logo {
  width: auto;
  height: 60px;
  margin-top: -5px;
}
.el-table .cell{
    word-break: initial;
}
.nav-search {
  width: 50%;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 20px;
}
.nav__search {
  width: 100%;
  border: 1px solid grey;
  font-size: 18px;
  font-weight: 300;
  text-transform: uppercase;
  text-align: center;
  color: #333;
}
.nav.el-menu {
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    height: 80px;
}
.nav__links {
    height: 80px;
    margin-top: 40px;
    text-transform: uppercase;
}
.nav__links .el-menu-item {
      font-size: 15px;
      font-weight: 300;
      letter-spacing: 1px;
}
.nav__links .el-menu-item.is-active {

}
</style>
