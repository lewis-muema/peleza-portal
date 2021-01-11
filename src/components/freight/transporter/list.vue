<template>
   <div class="stageone">
        <div class="applicants-holder">
            <div class="empty" v-if="transporters === null || transporters.length === 0">
                    <div v-if="loading">loading transporters ...</div>
                    <span v-if="!loading && requested">
                        <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/frontend_apps/Empty+user+dashboard.png" class="empty-image" />
                        <div class="empty-text">{{ notification }}</div>
                        <div class="empty-text-count">0 Items</div>
                    </span>
            </div>
            <el-table v-else v-loading.body="loading" :data="transporters" @row-click="startVerification" :default-sort="{ prop: 'date_created', order: 'descending' }" width="100">
                <el-table-column type="index" label=" " />
                <el-table-column prop="application_type" label="Application type" />
                <el-table-column label="ID No. / B. Registration " :formatter="determineIdentity" />
                <el-table-column prop="country" label="Country " :min-width="30" />

                <el-table-column v-if="routeName === 'transporter-reviewed'" prop="date_created" label="Reviewed Date" :formatter="determineDuration" sortable />
                <el-table-column v-else prop="date_created" label="Application Date" :formatter="determineDuration" sortable />

                <el-table-column prop="status" label="Status" :min-width="50">
                    <template slot-scope="scope">
                    <span class="applicant-status resolved" v-if="transporters[scope.$index]['review_status'] === '4'">Resolved</span>
                    <div class="applicant-status" :class="getApplicantStatus(transporters[scope.$index])" v-else>{{ getApplicantStatus(transporters[scope.$index]) }}</div>
                    </template>
                </el-table-column>
                 <el-table-column :min-width="15" class-name="icon-holder">
                    <template slot-scope="scope">
                    <i class="el-icon-arrow-right applicant-arrow" :class="transporters[scope.$index].id"></i>
                    </template>
                </el-table-column>


        </el-table>
        <div class="pagination mt mb" v-if="pagination !== null && transporters !== null && transporters.length !== 0 && transporters.length >= pagination.perPage">
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
    name: 'TransportersList',
     mixins: [GeneralMxn, TimezoneMxn],
        data() {
            return {
                page: 1,
                loading: false,
                transporters: null,
                requested: false,
                pagination: null,
                notification: '',
                transportersStatus: null,
                userType: '',
                searchedID: null,
                searched: false,
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
              async $route() {
                this.loading = false;
                this.requested = false;
                this.transporters = null;
                await this.getApplicantStatus();
                await this.retrieveTransporters();
            },
            async getSearchedApplicant(applicant) {
                this.userType = applicant.userType;
                this.loading = false;
                this.requested = false;
                this.transporters = null;
                this.searchedID = applicant.id;
                this.searched = applicant.searched;
                await this.retrieveTransporters();
             },
         },
        async  mounted() {
             this.userType = this.route.user;
            this.searchedID = null;
            this.searched = false;
            await this.getApplicantStatus();
            await this.retrieveTransporters();
        },
         methods: {
              async changePage() {
                this.page = this.pagination.page;
                this.transporters = null;
                await this.retrieveTransporters();
            },
             getApplicantStatus() {
                let status = 'pending';
                if (this.routeName.includes('reviewed')) {
                    status = 'reviewed';
                } else if (this.routeName.includes('inconsistencies')) {
                    status = 'inconsistencies';
                }
                this.transportersStatus = status;
                return status;
             },
             determineIdentity(row) {
                 return row.application_type === 'Business' ? row.company_reg_no : row.id_no;
             },
            checkTime(date) {
                const currentTime = moment();
                const timeStore = moment(date);

                return currentTime.diff(timeStore, 'h');
                },
            async startVerification(row) {
                const transporter = await this.retrieveSingleTransporter(row.id);


                transporter.transportersStatus = this.transportersStatus;

                const id = row.application_type === 'business' ? row.cop_id : row.user_id;
                this.$router.push({ name: `${this.singleView}`, params: { id: row.id } });
             },
              determineDuration(row) {
                const utcDate = this.convertToUTC(row.date_created);
                const localDate = this.convertToLocalTime(utcDate);
                const duration = this.checkTime(localDate);

                const displayDate = moment(localDate).fromNow();
                const formattedDate = duration <= 24 ? moment(localDate).fromNow() : `${moment(localDate).format('ddd, Do MMM YYYY')} at ${moment(localDate).format('h:mm a')}`;

                return formattedDate;
                },
              async retrieveTransporters() {
                this.loading = true;
                this.requested = true;

                const payload = {
                    page: this.page,
                    vendor_type: 25,
                    ...(this.transportersStatus === 'pending') && { pending: 1 },
                    ...(this.transportersStatus === 'inconsistencies') && { inconsistencies: 1 },
                    ...(this.transportersStatus === 'reviewed') && { reviewed: 1 },
                    ...(this.searched && this.searchedID !== null) && { partnerId: this.searchedID },

                };
                const endpoint = this.searched ? `onboarding/peleza/list-applicant/${this.searchedID}` : 'onboarding/peleza/list-applicants';

                const fullPayload = {
                    app: 'partner-api/',
                    ...(!this.searched) && { params: payload },
                    endpoint,
                };
                const arr = [];

                try {
                    const response = await this.axiosGetRequest(fullPayload);
                    if (!this.searched) {
                        this.transporters = response.status === 200 ? response.data.data : null;
                    } else {
                        const partner = [response.data];
                        this.transporters = response.status === 200 ? partner : null;
                    }

                    this.pagination = response.status === 200 && !this.searched ? response.data.pagination : null;
                    this.notification = response.status === 200 && response.data.data.length === 0 ? 'No applications to show on this list' : '';
                    this.loading = false;
                } catch (error) {
                    this.notification = 'Failed to fetch customer data. Kindly try again or contact Sendy tech support';
                    this.loading = false;
                }
            },

            getFreightPartners(partners) {
                const freightPartners = [];
                for (let i = 0; i < partners.length; i += 1) {
                    let filteredVehicles = [];

                    if (partners[i].vehicle.length !== 0) {
                        filteredVehicles = partners[i].vehicle.filter(vehicle => vehicle.vendor_type === 25);
                    }
                    if (filteredVehicles.length !== 0) {
                        freightPartners.push(partners[i]);
                    }
                }
                return freightPartners;
            },
         },

};
</script>

<style>

</style>
