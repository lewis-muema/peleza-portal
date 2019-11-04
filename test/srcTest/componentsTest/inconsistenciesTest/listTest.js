/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable */

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

const applicationDetails = require('../../../../src/components/inconsistencies/list.vue');

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
  ],
});

describe('inconsistencies-lists-test', () => {
  let store;
  const returnedResponse = [
    {
      id: '96',
      name: 'Nyakundi Dervine',
      driver_photo: 'd4fpy7tspc-10.png',
      application_type: 'Owner',
      kra_pin: 'A234765345Z',
      date_created: '2019-01-25 10:53:06',
      date_verified: '2019-01-25 13:41:01',
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
      inconsistency_message: null,
      review_status: '3',
      vehicle_reg_no: 'KPB 345G',
      insurance_copy: 'dxfnat28au-10--282-29.png',
      vehicle_photo: 'xehnwmvukk-10.png',
      insurance_number: null,
      insurance_name: '',
      policy_number: null,
      verify_consent: null,
      good_conduct: null,
      vendor_type: '1',
    },
  ];
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
  it('Gets the inconsistencies list', done => {
    const wrapper = shallowMount(applicationDetails, {
      sync: false,
      store,
      localVue,
      router,
    });
    wrapper.vm.getApplicants();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status: true,
            applicants: returnedResponse,
          },
        })
        .then(() => {
          expect(wrapper.vm.empty_state).equal('No Data');
          expect(wrapper.vm.applicants.length).equal(1);
          expect(wrapper.vm.applicants[0].id).equal('96');
          done();
        });
    });
  });

  it('Populates inconsistencies list to a data element as an array', done => {
    const wrapper = shallowMount(applicationDetails, {
      sync: false,
      store,
      localVue,
      router,
    });
    wrapper.vm.getApplicants();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status: true,
            applicants: returnedResponse,
          },
        })
        .then(() => {
          expect(wrapper.vm.filteredData).to.be.an('array');
          expect(wrapper.vm.filteredData.length).equal(1);
          expect(wrapper.vm.filteredData[0].id).equal('96');
          done();
        });
    });
  });
  it('Fetches inconsistencies list in the background', done => {
    const wrapper = shallowMount(applicationDetails, {
      sync: false,
      store,
      localVue,
      router,
    });
    wrapper.vm.getApplicantsBackground();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status: true,
            applicants: returnedResponse,
          },
        })
        .then(() => {
          expect(wrapper.vm.applicants).to.be.an('array');
          done();
        });
    });
  });
  it('Set the date range accurately', () => {
    const wrapper = shallowMount(applicationDetails, {
      sync: false,
      store,
      localVue,
      router,
    });
    wrapper.vm.changeDateRange();
    expect(wrapper.vm.date_range[0]).to.be.a('date');
    expect(wrapper.vm.date_range[1]).to.be.a('date');
  });
});
