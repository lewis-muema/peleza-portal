import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import stageone from '@/components/stageone/stageone'
import approved from '@/components/approved/approved'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/stageone',
      name: 'stageone',
      component: stageone
    },
    {
      path: '/approved',
      name: 'approved',
      component: approved
    },

  ]
})

router.beforeEach((to, from, next) => {
  if(to.path == '/') {
    if(!localStorage.authenticated || !JSON.parse(localStorage.authenticated)) next();
    else next('/stageone');
    return;
  }
  if(localStorage.authenticated) {
    JSON.parse(localStorage.authenticated) ? next() : next('/');
  } else {
    next('/');
  }
})

export default router;
