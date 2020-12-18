<template>
  <div v-if="!loading">
       <el-card header="Activity" class="applicant-details__profile__personal-details activity-logs">
         <div class="empty" v-if="logs === null || logs.length === 0">
            <div v-if="loading">loading partner logs ...</div>
                <span v-if="!loading && requested">
                    <div class="empty-text">{{ notification }}</div>
                </span>
           </div>
            <ul class="logs-list" v-if="logs !== null && logs.length !== 0">
              <li v-for="log in logs.slice().reverse()" :key="log.index">
                <span class="statement-log">{{ createLogStatement(log).statement }} </span>
                <span class="statement-time">{{ createLogStatement(log).date }} </span>
                <span class="statement-time">{{ createLogStatement(log).time }} </span>

                <span></span>
              </li>
            </ul>
      </el-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import DetailMxn from '../../../mixins/detail_mixin';
import timzoneMixin from '../../../mixins/timezone_mixin';


export default {
    name: 'ActivityLogs',
    mixins: [timzoneMixin],
    props: ['id'],
    data() {
      return {
        loading: false,
        logs: null,
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
                await this.getPartnerLogs();
             }
         },
     },
    async  mounted() {
      this.loading = true;
      await this.getPartnerLogs();
      this.loading = false;
    },
    methods: {
       createLogStatement(log) {
          const localDate = this.formatDateToLocal(log.date_time);
          const statement = `${log.admin_name} ${log.last_activity}`;
          const arr = [];
          arr.statement = statement;
          arr.date = moment(localDate).format('Do MMM YYYY');
          arr.time = moment(localDate).format('HH:mm:ss A');

          return arr;
        },
       getPartnerLogs() {
         this.loading = true;
         this.requested = true;
          const payload = {
            partner_id: this.id,
          };

          axios
            .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/logs/get_partner_logs/`, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: localStorage.token } })
            .then(response => {
              if (response.data.status) {
                this.logs = response.data.logs;
                this.notification = this.logs === 0 ? 'No activity logs' : '';
              } else {
                this.logs = null;
                this.notification = 'Failed to fetch customer activity logs. Kindly try again or contact Sendy tech support';
              }
              this.loading = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch(error => {
              this.loading = false;
              this.errorObj = error.response;
              this.$notify.error({
                title: 'Retrieve logs',
                message: 'failed to retrieve partner logs',
              });
              throw new Error('Could not retrieve partner logs');
            });
        },
    },

};
</script>

<style>

</style>
