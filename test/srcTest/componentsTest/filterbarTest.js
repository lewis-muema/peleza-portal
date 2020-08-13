import Vue from 'vue';
import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

// eslint-disable-next-line import/no-unresolved
const applicationDetails = require('../../../src/components/filterbar.vue');
// eslint-disable-next-line import/no-unresolved
const generalMixin = require('../../../src/mixins/general_mixin');


const localVue = createLocalVue();
localVue.use(VueRouter);
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [{
        path: '/applications',
        name: 'applications',
    }],
});

const wrapper = shallowMount(applicationDetails, {
    sync: false,
    localVue,
    router,
    stubs: ['generalMixin'],
});
describe('filterbar-test', () => {
    it('It determines the title of page depending on the route', done => {
        wrapper.vm.routeDetails('not-recommended');
        expect(wrapper.vm.routeDetails('not-recommended')).to.be.an('object');
        expect(wrapper.vm.routeDetails('inconsistencies').title).to.equal('Inconsistencies');

        done();
    });
});
