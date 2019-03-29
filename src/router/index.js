/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/login';
import applications_list from '@/components/applications/list';
import applicant_detail from '@/components/applications/details';

import reviewed_list from '@/components/reviewed/list';
import renewals_list from '@/components/renewals/list';

import reviewed_detail from '@/components/reviewed/details';

import inconsistencies_list from '@/components/inconsistencies/list';
import inconsistencies_details from '@/components/inconsistencies/details';
import driver_applications from '@/components/driver-applications/list';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path: '/applications',
      name: 'applications',
      component: applications_list,
    },
    {
      path: '/applicant/:id',
      name: 'applicant',
      component: applicant_detail,
    },
    {
      path: '/reviewed',
      name: 'reviewed',
      component: reviewed_list,
    },
    {
      path: '/reviewed-applicant/:id',
      name: 'reviewed-applicant',
      component: reviewed_detail,
    },
    {
      path: '/renewals',
      name: 'renewals',
      component: renewals_list,
    },
    {
      path: '/inconsistencies',
      name: 'inconsistencies',
      component: inconsistencies_list,
    },
    {
      path: '/inconsistency/:id',
      name: 'inconsistency',
      component: inconsistencies_details,
    },
    {
      path: '/driver-applications',
      name: 'driver-applications',
      component: driver_applications,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    if (!localStorage.authenticated || !JSON.parse(localStorage.authenticated)) next();
    else next('/applications');
    return;
  }
  if (localStorage.authenticated) {
    JSON.parse(localStorage.authenticated) ? next() : next('/');
  } else {
    next('/');
  }
  // eslint-disable-next-line semi
});

export default router;
