/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
// detail mixin contains common methods computed properties across the details components

const DetailMxn = {
  created() {
    // call functions you want to execute when mixin is loaded into a component
  },
  methods: {
    getVendorType(vendor) {
      return vendor !== null
        ? vendor === '0'
          ? 'Unknown'
          : this.vendor_types[Number(vendor) - 1]
        : 'N/A';
    },
    handleReviewEdit(section) {
      const obj = this.verification_details;
      obj[section].review_status = false;
      this.verification_details = Object.assign({}, this.verification_details, obj);
    },
    createLogStatement(log) {
      const statement = `${log.admin_name} ${log.last_activity} on ${moment(log.date_time).format(
        'Do MMM YYYY',
      )} at ${moment(log.date_time).format('HH:mm:ss A')}`;
      return statement;
    },
    checkProperties(obj) {
      for (const key in obj) {
        if ((obj[key] === null || obj[key] === '') && !obj[key]) {
          return false;
        }
      }
      return true;
    },
    handleIdCardChange() {
      const files = document.getElementById('id_card').files;

      if (files.length < 1) {
        this.id_doc_change = false;
      } else {
        this.id_doc_change = true;
        const name = files[0].name;

        const obj = this.verification_details;
        obj.identity_check.id_card = name;
        this.verification_details = Object.assign({}, this.verification_details, obj);
      }
    },

    formatDate(date) {
      return moment(date).format('Do MMM YYYY');
    },

    formatYear(date) {
      return moment(date).format('YYYY');
    },

    getPartnerLogs() {
      const payload = {
        partner_id: this.applicant_details.partner_id,
      };

      axios
        .post(`${PARTNER_BASE_URL}peleza/logs/get_partner_logs/`, JSON.stringify(payload))
        .then((response) => {
          if (response.data.status) {
            this.partner_logs = response.data.logs;
          } else {
            this.partner_logs = [];
          }
        })
        .catch(() => {
          this.$notify.error({
            title: 'submit applicant review',
            message: 'failed to update applicant review',
          });
          throw new Error('Could not update applicant');
        });
    },
    getAlbumName(iid) {
      if (iid === 'insurance') {
        return 'insu';
      }
      if (iid === 'id_card' || iid === 'nok_id_card') {
        return 'id';
      }
      if (iid === 'driver') {
        return 'photo';
      }
      return iid;
    },

    checkReviewStatus() {
      const obj = this.verification_details;
      for (const key in obj) {
        if (!obj[key].review_status) {
          return false;
        }
      }
      return true;
    },
  },
  computed: {},
};
export default DetailMxn;
