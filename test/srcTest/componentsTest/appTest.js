import Vue from 'vue';
import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

// eslint-disable-next-line import/no-unresolved
const applicationDetails = require('../../../src/app.vue');

const localVue = createLocalVue();
localVue.use(VueRouter);
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [{
        path: '/applications',
        name: 'applications',
    }],
});

describe('app-test', () => {
    it('Check if the route is a single applicant view', done => {
        const wrapper = shallowMount(applicationDetails, {
            sync: false,
            localVue,
            router,
        });
        expect(wrapper.vm.isSingleView).to.equal(false);
        done();
    });
});
