/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
import Vue from 'vue';
import axios from 'axios';
import moxios from 'moxios';
import { expect, chai } from 'chai';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import moment from 'moment';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import VueRouter from 'vue-router';
import 'mock-local-storage';

const applicationDetails = require('../../../src/components/shared/navigation.vue');

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
Vue.use(ElementUI, { locale });
Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/applications',
      name: 'applications',
    },
    {
      path: '/applicant',
      name: 'applicant',
    },
  ],
});

describe('navigation-test', () => {
  let store;
  let getters;
  const applicantsData = {
    response: {
      status: false,
      applicants: [
        {
          id: '96',
          name: 'Nyakundi Dervine',
          driver_photo: 'd4fpy7tspc-10.png',
          application_type: 'Owner',
          kra_pin: 'A234765345Z',
          date_created: '2019-01-25 10:53:06',
          id_no: '34507898',
          nok_id: null,
          peleza_approval_id: '32',
          identity_check: '{"applicant_name":"Dervine","dob":"2019-01-27T21:00:00.000Z","pob":"dervine","gender":"Female","review_status":true,"inconsistency":true}',
          criminal_records_check: '{"applicant_name":"","criminal_history":"","authenticity":"","id_no":"","ref_no":"","review_status":true,"inconsistency":false}',
          driving_license_check: '{"applicant_name":"","dl_no":"","date_of_issue":"","expiry_date":"","classes":"","id_no":"","review_status":true,"inconsistency":false}',
          motor_vehicle_records_check: '{"ownership_details":"SASAS","chasis_no":"3333","make":"SWDWD","body_type":"SWDW","engine_no":"233","manufacture_year":"2009-12-31T21:00:00.000Z","caveats":"DWD","review_status":true,"inconsistency":true}',
          car_insurance_validity: '{"owner_name":"dededeq","vehicle_number_plate":"dwde","issue_date":"2019-01-27T21:00:00.000Z","expiry_date":"2019-01-30T21:00:00.000Z","validity":"dede","policy_number":"55655","review_status":true,"inconsistency":true}',
          kra_pin_verification: '{"validity":"dede","name":"dede","pin_number":"A22222","tax_obligations":"edec","registration_date":"2019-01-26T21:00:00.000Z","review_status":true,"inconsistency":false}',
          next_of_kin: '',
          recommendation_status: '0',
          review_status: '4',
          vehicle_reg_no: 'KPB 345G',
          insurance_copy: 'dxfnat28au-10--282-29.png',
          insurance_number: 'A334539',
          insurance_name: 'AMACO insurance',
          policy_number: '55655',
          verify_consent: null,
          vehicle_photo: 'xehnwmvukk-10.png',
          good_conduct: null,
          vendor_type: '1',
          date_time: '2019-01-25 13:41:01',
        },
      ],
    },
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'text/html; charset=UTF-8',
    },
    config: {
      transformRequest: {},
      transformResponse: {},
      timeout: 0,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxContentLength: -1,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'post',
      url: 'https://ridertest.sendyit.com/admin_partner_api/v5/peleza/applications/list_updated_inconsistencies/',
      data: '{"email":"marketing@sendy.co.ke","password":"qwerty"}',
    },
    request: {},
  };
  beforeEach(() => {
    moxios.install(axios);
    getters = { current_verification: () => [] };
    store = new Vuex.Store({
      state: {
        current_verification: localStorage.current_verification ? JSON.parse(localStorage.current_verification) : {},
        search_term: '',
        applicantCount: 10,
        category: 'freight',
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
        setApplicantionCount(state, applicantCount) {
          state.applicantCount = applicantCount;
        },
        setCategory(state, category) {
            state.category = category;
        },
      },
      getters: {
        current_verification: state => state.current_verification,
        search_term: state => state.search_term,
        getApplicantCount: state => state.applicantCount,
        getCategory: state => state.category,

      },
    });
    window.axios = axios;
    global.moment = moment;
    global.BASE_URL = 'https://ridertest.sendyit.com/admin_partner_api/v5/admin/';
    global.AUTH_URL = process.env.AUTH_URL;
    global.PARTNER_BASE_URL = 'https://ridertest.sendyit.com/admin_partner_api/v5/';
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
  it('Check whether logout clears the localStorage', () => {
    const wrapper = shallowMount(applicationDetails, {
      sync: false,
      store,
      localVue,
      router,
    });
    wrapper.vm.logout();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith(applicantsData).then(() => {
      });
    });
  });
});
