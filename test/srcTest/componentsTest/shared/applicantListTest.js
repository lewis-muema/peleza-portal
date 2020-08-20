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

const applicationDetails = require('../../../../src/components/shared/applicantList.vue');


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
        path: '/applications',
        name: 'applications',
    }],
});

describe('Reviewed-lists-test', () => {
    let store;
    const returnedResponse = [{
            id: '206',
            name: 'Baron Driver',
            driver_photo: 'wybptwrvny-whatsapp-image-2019-03-21-at-18.25.11.jpeg',
            application_type: 'Driver',
            kra_pin: null,
            date_created: '2019-03-11 10:48:01',
            date_verified: '2019-03-15 11:36:05',
            id_no: '90128942',
            nok_id: null,
            peleza_approval_id: '107',
            identity_check: '{"applicant_name":"Baron Driver","gender":"Female","review_status":true,"inconsistency":false}',
            criminal_records_check: null,
            driving_license_check: '{"applicant_name":"Baron Driver","dl_no":"D90128942","date_of_issue":"2013-03-09T21:00:00.000Z","expiry_date":"2023-03-13T21:00:00.000Z","classes":"FG","id_no":"90128942","review_status":true,"inconsistency":false}',
            motor_vehicle_records_check: null,
            car_insurance_validity: '',
            kra_pin_verification: '',
            next_of_kin: '',
            recommendation_status: '1',
            review_status: '1',
            vehicle_reg_no: null,
            insurance_copy: null,
            vehicle_photo: null,
            insurance_number: null,
            insurance_name: null,
            policy_number: null,
            verify_consent: null,
            good_conduct: null,
            approved_by: '106',
            vendor_type: null,
        },
        {
            id: '205',
            name: 'Baron owner',
            driver_photo: '',
            application_type: 'Owner',
            kra_pin: 'A008678900N',
            date_created: '2019-03-11 10:40:16',
            date_verified: '2019-03-11 10:56:47',
            id_no: '8678900',
            nok_id: null,
            peleza_approval_id: '104',
            identity_check: '{"applicant_name":"Baron Owner","dob":"2004-02-29T21:00:00.000Z","pob":"Narok","gender":"Male","review_status":true,"inconsistency":false}',
            criminal_records_check: null,
            driving_license_check: null,
            motor_vehicle_records_check: '{"ownership_details":"Baron Owner","chasis_no":"C1234567H","make":"Isuzu","body_type":"Isuzu","engine_no":"E245678h","manufacture_year":"2017-12-31T21:00:00.000Z","caveats":"None","review_status":true,"inconsistency":false}',
            car_insurance_validity: '{"owner_name":"Baron Owner","vehicle_number_plate":"KZQ 900L","issue_date":"2019-03-09T21:00:00.000Z","expiry_date":"2020-03-11T21:00:00.000Z","validity":"Valid","policy_number":"12345432","review_status":true,"inconsistency":false,"insurance_cert_number":" r0987"}',
            kra_pin_verification: '{"validity":"Valid","name":"Baron Owner","pin_number":"A008678900N","tax_obligations":"INC","registration_date":"2019-03-02T21:00:00.000Z","review_status":true,"inconsistency":false}',
            next_of_kin: '',
            recommendation_status: '1',
            review_status: '1',
            vehicle_reg_no: 'KZQ 900L',
            insurance_copy: null,
            vehicle_photo: null,
            insurance_number: 'r0987',
            insurance_name: 'Sanlaam',
            policy_number: '12345432',
            verify_consent: '1',
            good_conduct: null,
            approved_by: '106',
            vendor_type: '2',
        },
        {
            id: '204',
            name: 'Griffin Muteti',
            driver_photo: 'yta9fkz2ar-bed-bedroom-cozy-164595.jpg',
            application_type: 'Driver and owner',
            kra_pin: 'KRAPIN',
            date_created: '2019-03-06 16:32:59',
            date_verified: '2019-03-08 08:45:53',
            id_no: '5445454',
            nok_id: '30486246',
            peleza_approval_id: '102',
            identity_check: '{"applicant_name":"de","dob":"2019-03-02T21:00:00.000Z","pob":"csc","gender":"Male","review_status":true,"inconsistency":false}',
            criminal_records_check: null,
            driving_license_check: '{"applicant_name":"cds","dl_no":" s ","date_of_issue":"2019-03-09T21:00:00.000Z","expiry_date":"2019-03-20T21:00:00.000Z","classes":"edwa","id_no":"233","review_status":true,"inconsistency":false}',
            motor_vehicle_records_check: '{"ownership_details":"3d3","chasis_no":"3e2e2","make":"d1d","body_type":"dd","engine_no":"d","manufacture_year":"2014-12-31T21:00:00.000Z","caveats":"ed","review_status":true,"inconsistency":false}',
            car_insurance_validity: '{"owner_name":"wqdq","vehicle_number_plate":"dqwd","issue_date":"2019-03-03T21:00:00.000Z","expiry_date":"2019-03-14T21:00:00.000Z","validity":"dqwx","policy_number":"dqwxas","review_status":true,"inconsistency":false}',
            kra_pin_verification: '{"validity":"2ewax","name":"cas ","pin_number":"asxa","tax_obligations":"xasz","registration_date":"2019-03-03T21:00:00.000Z","review_status":true,"inconsistency":false}',
            next_of_kin: '',
            recommendation_status: '1',
            review_status: '1',
            vehicle_reg_no: '333',
            insurance_copy: 'gyplbqwccb-1520000951915151842842903915171765403311500901929276insurance.jpg',
            vehicle_photo: 'afp77yhbcw-1520000925094151842871919315171732284891497001216792vehicle.jpg',
            insurance_number: 'INSU',
            insurance_name: null,
            policy_number: null,
            verify_consent: null,
            good_conduct: '1520000925094151842871919315171732284891497001216792vehicle',
            approved_by: '35',
            vendor_type: '1',
        },
    ];
    beforeEach(() => {
        moxios.install(axios);
        store = new Vuex.Store({
            state: {
                dateRange: ['2020-07-31T21:00:00.000Z', '2020-08-30T21:00:00.000Z'],
                search_term: '',
                applicantionType: '',
                current_verification: localStorage.current_verification ? JSON.parse(localStorage.current_verification) : {},
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
                getDateRange: (state) => state.dateRange,
                getApplicantionType: (state) => state.applicantionType,
                search_term: (state) => state.search_term,
                current_verification: state => state.current_verification,
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
    it('Gets the reviewed applicants list', done => {
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
                    expect(wrapper.vm.applicants.length).equal(3);
                    expect(wrapper.vm.empty_state).equal('No Data');
                    expect(wrapper.vm.applicants[0].id).equal('206');
                    done();
                });
        });
    });

    it('Populates reviewed applicants list to a data element as an array', done => {
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
              expect(wrapper.vm.empty_state).equal('No Data');
              expect(wrapper.vm.filteredData[0].id).equal('206');
        done();
            });
        });
    });
    it('Fetches reviewed applicants list in the background', done => {
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
    expect(wrapper.vm.date_range[0]).to.equal('2020-07-31T21:00:00.000Z');
    expect(wrapper.vm.date_range[1]).to.equal('2020-08-30T21:00:00.000Z');
    });
});
