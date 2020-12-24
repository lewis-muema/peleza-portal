import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';

const generalMxn = {
    data() {
        return {
            applicantCategory: localStorage.getItem('category'),
            links: [{
                    icon: 'pending_actions',
                    text: 'Pending Applicants',
                    name: 'pending',
                    title: 'Pending Applicants',
                    singleView: 'applicant',
                    hasChild: true,
                    subMenu: [
                        {
                            text: 'Owners',
                            name: 'applications',
                            title: 'Pending - Owners',
                            singleView: 'applicant',
                            category: 'logistics',

                        },
                        {
                            text: 'Drivers',
                            name: 'driver-applications',
                            title: 'Pending - Drivers',
                            singleView: 'driver',
                            category: 'logistics',

                        },
                        {
                            text: 'Transporters',
                            name: 'transporters',
                            title: 'Freight Transporters',
                            singleView: 'transporter',
                            category: 'freight',
                            user: 'partner',

                        },
                        {
                            text: 'Freight Peer Customers ',
                            name: 'freight-peer',
                            title: 'Freight Peer Customers',
                            singleView: 'customer',
                            category: 'freight',
                            user: 'peer',


                        },
                        {
                            text: 'Freight Business Customers ',
                            name: 'freight-business',
                            title: 'Freight Business Customers',
                            singleView: 'customer',
                            category: 'freight',
                            user: 'cop',


                        },
                    ],
                },
                {
                    icon: 'error_outline',
                    text: 'Inconsistencies',
                    name: 'inconsistencies',
                    title: 'Inconsistencies',
                    singleView: 'inconsistency',
                    hasChild: true,
                    category: 'freight',
                    subMenu: [
                        {
                            icon: 'mdi-message-outline',
                            text: 'Freight Peer Customers',
                            name: 'peer-inconsistencies',
                            title: 'Inconsistencies - Peer Customers',
                            singleView: 'customer',
                            category: 'freight',
                            user: 'peer',
                        },
                        {
                            icon: 'mdi-message-outline',
                            text: 'Freight Business Customers',
                            name: 'cop-inconsistencies',
                            title: 'Inconsistencies - Business Customers',
                            singleView: 'customer',
                            category: 'freight',
                            user: 'cop',
                        },
                        {
                            icon: 'mdi-message-outline',
                            text: 'Transporters',
                            name: 'transporter-inconsistencies',
                            title: 'Inconsistencies - Transporters',
                            singleView: 'transporter',
                            category: 'freight',
                            user: 'transporter',
                        },
                        {
                            icon: 'error_outline',
                            text: 'Inconsistencies',
                            name: 'inconsistencies',
                            title: 'Inconsistencies',
                            singleView: 'inconsistency',
                            hasChild: false,
                            category: 'logistics',

                        },

                ],
                },
                {
                    icon: 'done_all',
                    text: 'Reviewed',
                    name: 'reviewed',
                    title: 'Reviewed -  All Applications',
                    singleView: 'reviewed-applicant',
                    hasChild: true,
                    category: 'logistics',
                    subMenu: [{
                            icon: 'mdi-message-outline',
                            text: 'All',
                            name: 'reviewed',
                            title: 'Reviewed - All Applications',
                            singleView: 'reviewed-applicant',
                            category: 'logistics',

                        },
                        {
                            icon: 'mdi-message-outline',
                            text: 'Freight Peer Customers',
                            name: 'reviewed-peer',
                            title: 'Reviewed - Peer Customers',
                            singleView: 'customer',
                            category: 'freight',
                            user: 'peer',
                        },
                        {
                            icon: 'mdi-message-outline',
                            text: 'Freight Business Customers',
                            name: 'reviewed-business',
                            title: 'Reviewed - Business Customers',
                            singleView: 'customer',
                            category: 'freight',
                            user: 'cop',
                        },
                        {
                            icon: 'mdi-message-outline',
                            text: 'Transporters',
                            name: 'transporter-reviewed',
                            title: 'Reviewed - Transporters',
                            singleView: 'transporter',
                            category: 'freight',
                            user: 'transporter',
                        },
                        {
                            icon: 'mdi-message-outline',
                            text: 'Recommended',
                            name: 'recommended',
                            title: 'Reviewed - Recommended',
                            singleView: 'reviewed-applicant',
                            category: 'logistics',


                        },
                        {
                            icon: 'mdi-message-outline',
                            text: 'Not Recommended',
                            name: 'not-recommended',
                            title: 'Reviewed - Not Recommended',
                            singleView: 'reviewed-applicant',
                            category: 'logistics',

                        },
                    ],
                },
            ],
            footerLinks: [{
                icon: 'el-icon-menu',
                text: 'Logout',
                name: 'logout',
                hasChild: false,
            }],
            linkDetails: null,
            routeTitle: 'Pending',
            routeIDName: null,
            options: [{
                value: 'all',
                label: 'All Applicants',
            }, {
                value: 'Owner',
                label: 'Owners',
            }, {
                value: 'Driver',
                label: 'Driver',
            }, {
                value: 'Driver and 0wner',
                label: 'Driver & Owner',
            }, {
                value: 'Vehicle',
                label: 'New Vehicles',
            }],
            statuses: [
                     {
                        freightStatus: 1, reviewStatus: null, name: 'pending', title: 'Pending',
                    },
                     {
                        freightStatus: 1, reviewStatus: 3, name: 'inconsistencies', title: 'inconsistencies',
                    },
                    {
                        freightStatus: 0, reviewStatus: null, name: 'danger', title: 'Not Freight',
                    },
                    {
                        freightStatus: 1, reviewStatus: 1, name: 'reviewed', title: 'Reviewed',
                    },
                    {
                        freightStatus: 1, reviewStatus: 2, name: 'pending', title: 'Pending',
                    },


            ],
        };
    },
    computed: {
    ...mapGetters({ getCategory: 'getCategory' }),
    },
    watch: {
        $route() {
            this.routeDetails(this.$route.name);
        },
        linkDetails(data) {
            this.routeTitle = data.title;
            this.routeIDName = data.name;
        },
        getCategory(category) {
            this.applicantCategory = category;
        },
    },
    methods: {
        async retrieveSingleTransporter(id) {
            const endpoint = `onboarding/peleza/list-applicant/${id}`;

            const fullPayload = {
                app: 'partner-api/',
                endpoint,
            };
            const arr = [];

            try {
                const response = await this.axiosGetRequest(fullPayload);
                  const data = response.status === 200 ? response.data : null;
                  if (response.status === 200) {
                        this.$store.commit('changeVerification', data);
                  }

                  return data;
            } catch (error) {
                this.notification = 'Failed to fetch transporter data. Kindly try again or contact Sendy tech support';
            }
        },
        routeDetails(item) {
            let name = item === 'not-recommended' || item === 'recommended' || item === 'reviewed-business' || item === 'reviewed-peer' || item === 'transporter-reviewed' ? 'reviewed' : item;
            name = name === 'driver-applications' || name === 'applications' || name === 'vehicles' || name === 'transporters' || name === 'freight-peer' || name === 'freight-business' ? 'pending' : name;
            name = name === 'cop-inconsistencies' || name === 'peer-inconsistencies' || name === 'transporter-inconsistencies' ? 'inconsistencies' : name;

            let linkArr = this.links.filter((link) => link.name === name);
            let linkDetails = linkArr.length > 0 ? linkArr[0] : null;
            const hasChild = linkDetails !== null ? linkDetails.hasChild : false;

            if (hasChild) {
                const subMenu = linkDetails.subMenu;
                linkArr = subMenu.filter((m) => m.name === item);
                linkDetails = linkArr.length > 0 ? linkArr[0] : null;
            }
            linkDetails = linkArr.length > 0 ? linkArr[0] : null;
            this.linkDetails = linkDetails;
            return this.linkDetails;
        },
        capitalizeFirstLetter(string) {
            return typeof string === 'undefined' || string === null ? 'N/A' : `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
        },
        async custom_headers() {
            const authToken = localStorage.token;

            const param = {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: authToken,
              },
            };

            return param;
          },
        async axiosGetRequest(payload) {
            const headers = await this.custom_headers();
            const { endpoint } = payload;
            const { params } = payload;
            const { app } = payload;
            const { id } = payload;

            let url = `${AUTH_URL}${app}${endpoint}`;
            url = typeof id === 'undefined' ? url : `${url}/${id}`;

            const values = {
              params,
              headers: headers.headers,
            };
            // eslint-disable-next-line no-restricted-syntax
            for (const value in values) {
              if (values[value] === null || values[value] === undefined) {
                delete values[value];
              }
            }

            try {
              const response = await axios.get(url, values);
              return response;
            } catch (error) {
              return error.response;
            }
          },

          getApplicantStatus(customer) {
              let filteredStatus;
            if (typeof customer.review_status !== 'undefined') {
                 filteredStatus = this.statuses.filter((event) => event.freightStatus === customer.freight_status && event.reviewStatus === customer.review_status);
            } else {
                filteredStatus = this.statuses.filter((event) => event.freightStatus === customer.freight_status);
            }
            return filteredStatus[0];
        },
        async axiosPostRequest(payload) {
            const { endpoint } = payload;
            const { app } = payload;

            const headers = await this.custom_headers();

            const url = `${AUTH_URL}${app}${endpoint}`;
            const values = JSON.stringify(payload.params);


            try {
              const response = await axios.post(`${url}`, payload.params, headers);
              return response;
            } catch (error) {
              return error.response;
            }
          },


    },
};
export default generalMxn;
