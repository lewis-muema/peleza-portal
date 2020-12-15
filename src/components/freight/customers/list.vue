<template>
  <div class="stageone">
    <div class="applicants-holder">
        <div class="empty" v-if="customers === null || customers.length === 0">
            <div v-if="loading">loading customers ...</div>
            <span v-if="!loading && requested">
                <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/frontend_apps/Empty+user+dashboard.png" class="empty-image" />
                <div class="empty-text">{{ notification }}</div>
                <div class="empty-text-count">0 Items</div>
            </span>
        </div>
        <el-table v-else v-loading.body="loading" :data="customers" @row-click="startVerification" :default-sort="{ prop: 'date_created', order: 'descending' }" width="100">
            <el-table-column type="index" label=" " />
            <el-table-column prop="application_type" label="Application type" :formatter="getCustomerApplicantType" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="country" label="Country" />
            <el-table-column prop="application_date" label="Application Date " :formatter="determineDuration" sortable />
            <el-table-column prop="freight_status" label="Status">
                <template slot-scope="scope">
                    <div class="applicant-status" :class="getApplicantStatus(customers[scope.$index]).name">{{ getApplicantStatus(customers[scope.$index]).title }}</div>
                </template>
            </el-table-column>
            <el-table-column :min-width="15" class-name="icon-holder">
                <template slot-scope="scope">
                <i class="el-icon-arrow-right applicant-arrow" :class="customers[scope.$index]"></i>
                </template>
            </el-table-column>

        </el-table>
        <div class="pagination mt mb" v-if="customers !== null && customers.length !== 0 ">
            <el-pagination layout="total, sizes, prev, pager, next" :total="pagination.total" :page-size="pagination.perPage" :current-page.sync="pagination.page" @current-change="changePage" :page-sizes="[pagination.perPage]"></el-pagination>
         </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import GeneralMxn from '../../../mixins/general_mixin';
import TimezoneMxn from '../../../mixins/timezone_mixin';


export default {
    name: 'CustomerList',
    mixins: [GeneralMxn, TimezoneMxn],
    data() {
        return {
            page: 1,
            loading: false,
            customers: null,
            requested: false,
            pagination: null,
            notification: '',
            searchedID: null,
            searched: false,
            userType: '',
        };
    },
    computed: {
     ...mapGetters({ getSearchedApplicant: 'getSearchedApplicant' }),

        routeName() {
        return this.$route.name;
        },
        route() {
            const routeDetails = this.routeDetails(this.routeName);
            return routeDetails;
        },
        singleView() {
            return this.route.singleView;
        },
    },
    watch: {
        async userType(type) {
             await this.retrieveCustomers();
        },
        async $route() {
           this.userType = this.route.user;
             this.loading = false;
            this.requested = false;
            this.customers = null;
            await this.retrieveCustomers();
        },
        async getSearchedApplicant(applicant) {
            this.userType = applicant.userType;
             this.loading = false;
            this.requested = false;
            this.customers = null;
            this.searchedID = applicant.id;
            this.searched = applicant.searched;
            await this.retrieveCustomers();
        },
    },
   async  mounted() {
       this.userType = this.route.user;
        this.searchedID = null;
       this.searched = false;
        await this.retrieveCustomers();
    },
    methods: {
        async retrieveCustomers() {
            this.loading = true;
            this.requested = true;

            const payload = {
                page: this.page,
                freightStatus: 1,

                ...(this.userType === 'cop') && { cop: true },
                ...(this.userType === 'peer') && { peer: true },
                ...(this.routeName === 'cop-inconsistencies' || this.routeName === 'peer-inconsistencies') && { reviewStatus: 3 },
                ...(this.routeName === 'reviewed-peer' || this.routeName === 'reviewed-business') && { reviewStatus: 1 },
                ...(this.searched && this.searchedID !== null && this.userType === 'cop') && { copId: this.searchedID },
                ...(this.searched && this.searchedID !== null && this.userType === 'peer') && { userId: this.searchedID },


            };

            const fullPayload = {
                app: 'adonis/',
                params: payload,
                endpoint: 'freight-customer-approvals',
            };

            try {
                const response = await this.axiosGetRequest(fullPayload);
                this.customers = response.status === 200 ? response.data.data : null;
                this.pagination = response.status === 200 ? response.data.pagination : null;
                this.notification = response.status === 200 && response.data.data.length === 0 ? 'No applications to show on this list' : '';
                this.loading = false;
            } catch (error) {
                this.notification = 'Failed to fetch customer data. Kindly try again or contact Sendy tech support';
                this.loading = false;
            }
        },
        getCustomerApplicantType(customer) {
            return customer.application_type === 'undefined' || customer.application_type === null ? 'N/A' : this.capitalizeFirstLetter(customer.application_type);
        },
        async changePage() {
            this.page = this.pagination.page;
            this.customers = null;
            await this.retrieveCustomers();
        },
        startVerification(row) {
            this.$store.commit('setCustomerVerification', row);
            const id = row.application_type === 'business' ? row.cop_id : row.user_id;
            this.$router.push({ name: `${this.singleView}`, params: { id } });
        },
        checkTime(date) {
         const currentTime = moment();
         const timeStore = moment(date);

         return currentTime.diff(timeStore, 'h');
        },
        determineDuration(row) {
           let formattedDate = 'N/A';
            if (row.application_date !== null) {
            const localDate = this.convertToLocalTime(row.application_date);
            const duration = this.checkTime(localDate);

            const displayDate = moment(localDate).fromNow();
            formattedDate = duration <= 24 ? moment(localDate).fromNow() : `${moment(localDate).format('ddd, Do MMM YYYY')} at ${moment(localDate).format('h:mm a')}`;
            }

            return formattedDate;
            },

    },
};
</script>
