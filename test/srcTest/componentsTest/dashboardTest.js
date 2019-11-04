/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable */

import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';

const applicationDetails = require('../../../src/components/dashboard.vue');

describe('Dashboard-test', () => {
  it('Check whether the dashboard is rendered since it has no functions', () => {
    const wrapper = shallowMount(applicationDetails, { sync: false });
    expect(wrapper.vm.name).equal('dashboard');
  });
});
