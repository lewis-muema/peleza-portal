/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import axios from 'axios';
import moment from 'moment';

import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-default/index.css';

import App from './App';
import router from './router';
import { logger } from './utils';
import store from './store';
import EventBus from './event-bus.js';

Vue.config.productionTip = false;

Vue.use(ElementUI, { locale });

window.axios = axios;
window.moment = moment;
window.BASE_URL = process.env.BASE_URL;
window.PARTNER_BASE_URL = process.env.PARTNER_BASE_URL;
window.NODE_PARTNER_API = process.env.NODE_PARTNER_API;
window.rbmq_link = process.env.rbmq_link;
window.rbmq_user = process.env.rbmq_user;
window.rbmq_pass = process.env.rbmq_pass;
window.websocket = process.env.websocket;
window._ = require('underscore');

window.NODE_API_SWITCH = process.env.NODE_API_SWITCH;

window.AWS_URL = 'https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/';
window.MISSING_PHOTO_URL = 'https://placehold.it/300/300';
window.VENDOR_TYPES = [
  'Bike',
  'Pick Up',
  'Van',
  'Laundry',
  'Cooler Van',
  '3T Truck',
  'Donation',
  'Intercity',
  'Cab',
  '5T Truck',
  'Boda Boda',
  'Tuk Tuk',
  '7T Truck',
  '10T Truck',
  'Promotion',
  'Donation',
  '14T Truck',
  '20T Truck',
  '24T Truck',
  '28T Truck',
  'Foot Soldier',
];
window.log = function (x) {
  console.log(x);
};
window.debug = function (m, x) {
  console.debug(m, x);
};
window.error = function (m, x) {
  console.error(m, x);
};
window.warn = function (m, x) {
  console.warn(m, x);
};
window.empty = function (value) {
  return value == null || value.length === 0 || Object.getOwnPropertyNames(value).length === 0;
};
window.isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
window.$eventBus = EventBus;
window.AWS_URL = 'https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/';

Vue.prototype.$store = store;

console.log('ENV', process.env.NODE_ENV);
console.log('BASE URL', process.env.BASE_URL);
console.log('PARTNER BASE URL', process.env.PARTNER_BASE_URL);

Vue.prototype.$lightbox = {
  open(src, rotation) {
    if (!src) return;
    if (!rotation) rotation = 0;
    const lightbox = document.querySelector('.lightbox');
    const lightbox_image = lightbox.querySelector('.lightbox__image');
    lightbox_image.src = src;
    lightbox_image.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    lightbox.style.display = '';
    document.querySelector('.lightbox').addEventListener('click', () => {
      document.querySelector('.lightbox').style.display = 'none';
    });
  },
};

/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
