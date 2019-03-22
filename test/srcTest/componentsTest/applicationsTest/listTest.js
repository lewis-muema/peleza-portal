/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
import Vue from 'vue';
// import sinon from 'sinon';
import axios from 'axios';
// import flushPromises from 'flush-promises';
import { expect, chai } from 'chai';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import moment from 'moment';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import App from '../../../../src/App.vue';
import router from '../../../../src/router';

const applicationDetails = require('../../../../src/components/applications/list.vue');

const localVue = createLocalVue();
localVue.use(Vuex);
Vue.use(ElementUI, { locale });
Vue.use(Vuex);
describe('lists-test', () => {
  let store;
  let getters;

  beforeEach(() => {
    /* getters = { current_verification: () => [] };
    store = new Vuex.Store({
      getters,
    }); */
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
    global.VENDOR_TYPES = [
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
  });
  it('Partner list loads ', async () => {
    // const wrapper = shallowMount(Getters, { store, localVue });
    const wrapper = shallowMount(applicationDetails, { sync: false });
    expect(wrapper.vm.$data.filterState).equal(false);
    expect(wrapper.vm.sayHello()).equal('hello');
    wrapper.vm.getApplicants();
    await flushPromises();
    expect(wrapper.vm.empty_state).equal('No Data');

    // const p = wrapper.find('p');
    // expect(p.text()).toBe(getters.current_verification());
    // expect(wrapper1).toBe('hello');
    // assert.equal(applicationDetails(), 'hello');
  });
});
