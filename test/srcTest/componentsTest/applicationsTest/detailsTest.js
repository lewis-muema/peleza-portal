/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
import Vue from 'vue';
// import sinon from 'sinon';
import { expect } from 'chai';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const applicationDetails = require('../../../../src/components/applications/details.vue');

const localVue = createLocalVue();
localVue.use(Vuex);

Vue.use(Vuex);
describe('application-details-test', () => {
  let store;
  let getters;

  beforeEach(() => {
    getters = { current_verification: () => [] };
    store = new Vuex.Store({
      getters,
    });
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
  it('Vendor-type value should be ', () => {
    // const wrapper = shallowMount(Getters, { store, localVue });
    // const wrapper = shallowMount(applicationDetails, { store, localVue });
    // expect(wrapper.vm.$methods.sayHello).toBe('hello');
    // const p = wrapper.find('p');
    // expect(p.text()).toBe(getters.current_verification());
    // expect(wrapper1).toBe('hello');
    // assert.equal(applicationDetails(), 'hello');
  });
});
