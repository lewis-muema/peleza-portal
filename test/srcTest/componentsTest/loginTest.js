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

const applicationDetails = require('../../../src/components/login.vue');

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

describe('login-test', () => {
  let store;
  let getters;

  beforeEach(() => {
    moxios.install(axios);
    getters = { current_verification: () => [] };
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
    global.BASE_URL = 'https://ridertest.sendyit.com/admin_partner_api/v5/admin/';
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
  it('Check if user logs in', done => {
    const wrapper = shallowMount(applicationDetails, {
      sync: false,
      store,
      localVue,
      router,
    });
    wrapper.vm.login_form.email = 'marketing@sendy.co.ke';
    wrapper.vm.login_form.password = 'qwerty';
    expect(wrapper.vm.login_form.email).equal('marketing@sendy.co.ke');
    expect(wrapper.vm.login_form.password).equal('qwerty');
    wrapper.vm.sumbitLoginData();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          response:
            { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJwYXlsb2FkIjp7ImFkbWluX3R5cGUiOiIwIiwiYWRtaW5faWQiOiIwIiwiZWNvbW1lcmNlX29ubHkiOiIwIiwic3RhdHVzIjoiMSIsImVtYWlsIjoibWFya2V0aW5nQHNlbmR5LmNvLmtlIiwiYWdlbnRfZXh0ZW5zaW9uIjoiMCIsImV4dGVybmFsX3N0YXR1cyI6IjEiLCJjb3BfaWQiOm51bGwsIm5hbWUiOiJNYXJrZXRpbmciLCJwb3N0IjoiTWFya2V0aW5nIiwiZGV2IjoiMSIsInBpYyI6ImVnZ3kucG5nIiwicHJpdmlsZWdlIjoie1widmlld19uZXdfZmVhdHVyZVwiOiBmYWxzZSwgXCJyZWNvcmRfbXBlc2FcIjogZmFsc2UsIFwiY2hhdFwiOiBmYWxzZSwgXCJhcHByb3ZlX3BhcnRuZXJzXCI6IHRydWUsIFwiYXBwcm92ZV9wb3N0cGF5XCI6IGZhbHNlLCBcInJlY29yZF9jaGVxdWVzXCI6IGZhbHNlLCBcInJlY29yZF9wYXJ0bmVyX3dpdGhkcmF3YWxcIjogZmFsc2UsIFwicmVjb3JkX3Byb21vX2NvZGVcIjogZmFsc2UsIFwicmVjb3JkX3VzZXJcIjogZmFsc2UsIFwicmVjb3JkX3Bhc3NfY2hhbmdlXCI6IGZhbHNlLCBcImFwcHJvdmVfcHJlcGF5X2JpbGxpbmdcIjogZmFsc2UsIFwiYXBwcm92ZV9wb3N0cGF5X2JpbGxpbmdcIjogdHJ1ZSwgXCJjaGFuZ2VfYWNjb3VudF9tYW5hZ2VyXCI6IGZhbHNlLCBcImxvY2F0aW9uX3Byb3hpbWl0eVwiOiBmYWxzZSwgXCJyZWFzc2lnbl9vcmRlcnNcIjogZmFsc2V9Iiwic2VuZF9kZXB0X2lkIjoiNyIsInJvbGUiOiIxIiwicGhvbmUiOiIiLCJzaG93X2Vjb21tZXJjZSI6IjAiLCJhbGxvd2VkX29yZGVycyI6IiJ9fQ.yB1DqS2qim9wZ_BDX7JezB2KzLP1g0vy08mA63L4VY0', refresh_token: 'justfortests' },
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
            url: 'https://ridertest.sendyit.com/admin_partner_api/v5/admin/login/verify',
            data: '{"email":"marketing@sendy.co.ke","password":"qwerty"}',
          },
          request: {},
        })
        .then(() => {
          expect(localStorage.authenticated).equal('true');
          expect(JSON.parse(localStorage.user)).to.be.an('object');
          expect(JSON.parse(localStorage.user).email).equal(wrapper.vm.login_form.email);
          done();
        });
    });
  });
});
