<template>
   <el-card header="Activity" class="applicant-details__profile__personal-details activity-logs">
        <div class="empty" v-if="logs === null || logs.length === 0">
            <div v-if="loading">loading customer logs ...</div>
            <span v-if="!loading && requested">
                <div class="empty-text">{{ notification }}</div>
            </span>
        </div>
        <ul class="logs-list">
            <li v-for="log in logs" :key="log.index">
            <span class="statement-log">{{ createLogStatement(log).statement }} </span>
            <span class="statement-time">{{ createLogStatement(log).date }} </span>
            <span class="statement-time">{{ createLogStatement(log).time }} </span>

            <span></span>
            </li>
        </ul>
          </el-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import generalMixin from '../../../mixins/general_mixin';
import timezoneMxn from '../../../mixins/timezone_mixin';

export default {
    name: 'ActivityLogs',
    mixins: [generalMixin, timezoneMxn],
    props: ['userType'],
    data() {
        return {
            logs: null,
            loading: false,
            requested: false,
            updateStatus: false,
            notification: '',
        };
    },
     computed: {
    ...mapGetters({ getUpdateStatus: 'getUpdateStatus' }),
     },
     watch: {
         async getUpdateStatus(status) {
             this.updateStatus = status;
             if (status) {
                this.logs = null;
                this.loading = false;
                this.requested = false;
                await this.retrieveLogs();
             }
         },
     },
    async  mounted() {
        this.customerData = this.getCustomerVerification;
        await this.retrieveLogs();
    },
    methods: {
        async retrieveLogs() {
            this.loading = true;
            this.requested = true;

            const payload = {
                ...(this.userType === 'business') && { copId: this.$route.params.id },
                ...(this.userType === 'personal') && { userId: this.$route.params.id },
                page: 1,
            };

            const fullPayload = {
                app: 'adonis/',
                params: payload,
                endpoint: 'freight-customer-approval-logs',
            };

            try {
                const response = await this.axiosGetRequest(fullPayload);
                this.logs = response.status === 200 ? response.data.data : null;
                this.notification = response.status === 200 && response.data.data.length === 0 ? 'No activity logs' : '';
                this.loading = false;
            } catch (error) {
                this.notification = 'Failed to fetch customer activity logs. Kindly try again or contact Sendy tech support';
                this.loading = false;
            }
        },
        createLogStatement(log) {
            const localDate = this.formatDateToLocal(log.date_time);
            const statement = `${log.name} ${log.action}`;
            const arr = [];
            arr.statement = statement;
            arr.date = moment(localDate).format('Do MMM YYYY');
            arr.time = moment(localDate).format('HH:mm:ss A');

            return arr;
        },
    },


};
</script>

<style>

</style>
