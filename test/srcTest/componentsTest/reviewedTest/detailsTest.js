/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
import Vue from 'vue';
import axios from 'axios';
import moxios from 'moxios';
import {
  expect,
  chai,
} from 'chai';
import Vuex from 'vuex';
import {
  shallowMount,
  createLocalVue,
} from '@vue/test-utils';
import moment from 'moment';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import VueRouter from 'vue-router';
import 'mock-local-storage';

const listDetails = require('../../../../src/components/applications/list.vue');
const applicationDetails = require('../../../../src/components/applications/details.vue');

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
Vue.use(ElementUI, {
  locale,
});
Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [{
    path: '/applicant',
    name: 'applicant',
  }],
});

describe('Reviewed-details-test', () => {
  let store;
  const returnedResponse = [{
    id: '217',
    name: 'Dervine Test',
    driver_photo: null,
    application_type: 'Owner',
    kra_pin: 'A345678987L',
    date_created: '2019-03-26 14:10:24',
    id_no: '43526755',
    nok_id: null,
    peleza_approval_id: null,
    identity_check: null,
    criminal_records_check: null,
    driving_license_check: null,
    motor_vehicle_records_check: null,
    car_insurance_validity: null,
    kra_pin_verification: null,
    next_of_kin: null,
    recommendation_status: null,
    review_status: null,
    vehicle_reg_no: 'KCT 786Y',
    insurance_copy: null,
    insurance_number: 'A234567898tr666',
    insurance_name: 'AMACO',
    policy_number: '3245678987',
    verify_consent: '1',
    vehicle_photo: null,
    good_conduct: null,
    vendor_type: '2',
  }];

  beforeEach(() => {
    moxios.install(axios);
    store = new Vuex.Store({
      state: {
        current_verification: localStorage.current_verification ? JSON.parse(localStorage.current_verification) : {},
        search_term: '',
      },
      mutations: {
        changeVerification(state, current_verification) {
          Object.assign(state.current_verification, current_verification);
          localStorage.current_verification = JSON.stringify(current_verification);
        },
        resetVerification(state) {
          Object.assign(state.current_verification, {});
          localStorage.current_verification = JSON.stringify({});
        },
        search(state, search_term) {
          state.search_term = search_term;
        },
      },
      getters: {
        current_verification: state => state.current_verification,
        search_term: state => state.search_term,
      },
    });
    window.axios = axios;
    global.moment = moment;
    global.BASE_URL = process.env.BASE_URL;
    global.AUTH_URL = process.env.AUTH_URL;
    global.PARTNER_BASE_URL = process.env.PARTNER_BASE_URL;
    global.NODE_PARTNER_API = process.env.NODE_PARTNER_API;
    global.rbmq_link = process.env.rbmq_link;
    global.rbmq_user = process.env.rbmq_user;
    global.rbmq_pass = process.env.rbmq_pass;
    global.websocket = process.env.websocket;
    global._ = require('underscore');

    global.NODE_API_SWITCH = process.env.NODE_API_SWITCH;

    global.AWS_URL = 'https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/';
    global.MISSING_PHOTO_URL = 'https://placehold.it/300/300';
    global.axios = axios;
    global.VENDOR_TYPES = ['Bike', 'Pick Up', 'Van', 'Laundry', 'Cooler Van', '3T Truck', 'Donation', 'Intercity', 'Cab', '5T Truck', 'Boda Boda', 'Tuk Tuk', '7T Truck', '10T Truck', 'Promotion', 'Donation', '14T Truck', '20T Truck', '24T Truck', '28T Truck', 'Foot Soldier'];
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it('Check if details list loads data from localStorage', () => {
    localStorage.user = JSON.stringify({
      admin_type: '0',
      admin_id: '0',
      ecommerce_only: '0',
      status: '1',
      email: 'marketing@sendy.co.ke',
      agent_extension: '0',
      external_status: '1',
      cop_id: null,
      name: 'Marketing',
      post: 'Marketing',
      dev: '1',
      pic: 'eggy.png',
      privilege: '{"view_new_feature": false, "record_mpesa": false, "chat": false, "approve_partners": true, "approve_postpay": false, "record_cheques": false, "record_partner_withdrawal": false, "record_promo_code": false, "record_user": false, "record_pass_change": false, "approve_prepay_billing": false, "approve_postpay_billing": true, "change_account_manager": false, "location_proximity": false, "reassign_orders": false}',
      send_dept_id: '7',
      role: '1',
      phone: '',
      show_ecommerce: '0',
      allowed_orders: '',
    });
    const detailsWrapper = shallowMount(applicationDetails, {
      sync: false,
      store,
      localVue,
      router,
    });
    expect(detailsWrapper.vm.current_verification).to.be.an('object');
  });
});
