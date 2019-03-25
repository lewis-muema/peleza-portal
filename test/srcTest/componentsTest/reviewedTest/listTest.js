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

const applicationDetails = require('../../../../src/components/reviewed/list.vue');

const localVue = createLocalVue();
localVue.use(Vuex);
Vue.use(ElementUI, { locale });
Vue.use(Vuex);
describe('Reviewed-lists-test', () => {
  let store;
  let getters;

  beforeEach(() => {
    moxios.install(axios);
    getters = { current_verification: () => [] };
    store = new Vuex.Store({
      getters,
    });
    window.axios = axios;
    global.moment = moment;
    global.BASE_URL = process.env.BASE_URL;
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
  it('Gets the reviewed applicants list', done => {
    const wrapper = shallowMount(applicationDetails, { sync: false, store, localVue });
    wrapper.vm.getApplicants();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status: true,
            applicants: [],
          },
        })
        .then(() => {
          expect(wrapper.vm.empty_state).equal('No Data');
          done();
        });
    });
  });

  it('Populates reviewed applicants list to a data element as an array', done => {
    const wrapper = shallowMount(applicationDetails, { sync: false, store, localVue });
    wrapper.vm.getApplicants();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status: true,
            applicants: [],
          },
        })
        .then(() => {
          expect(wrapper.vm.filteredData).to.be.an('array');
          done();
        });
    });
  });
  it('Fetches reviewed applicants list in the background', done => {
    const wrapper = shallowMount(applicationDetails, { sync: false, store, localVue });
    wrapper.vm.getApplicantsBackground();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            status: true,
            applicants: [],
          },
        })
        .then(() => {
          expect(wrapper.vm.applicants).to.be.an('array');
          done();
        });
    });
  });
  it('Set the date range accurately', () => {
    const wrapper = shallowMount(applicationDetails, { sync: false, store, localVue });
    wrapper.vm.changeDateRange();
    expect(wrapper.vm.date_range[0]).to.be.a('date');
    expect(wrapper.vm.date_range[1]).to.be.a('date');
  });
});
