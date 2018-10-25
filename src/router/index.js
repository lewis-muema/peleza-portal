import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import applications_list from '@/components/applications/list'
import applicant_detail from '@/components/applications/details'

import reviewed_list from '@/components/reviewed/list'
import renewals_list from '@/components/renewals/list'


Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/applications',
      name: 'applications',
      component: applications_list
    },
    {
      path: '/applicant/:id',
      name: 'applicant',
      component: applicant_detail
    },
    {
      path: '/reviewed',
      name: 'reviewed',
      component: reviewed_list
    },
    {
      path: '/renewals',
      name: 'renewals',
      component: renewals_list
    },

  ]
})

router.beforeEach((to, from, next) => {
  if(to.path == '/') {
    if(!localStorage.authenticated || !JSON.parse(localStorage.authenticated)) next();
    else next('/applications');
    return;
  }
  if(localStorage.authenticated) {
    JSON.parse(localStorage.authenticated) ? next() : next('/');
  } else {
    next('/');
  }
})

export default router;
