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
      return vendor !== null ? (vendor === '0' ? 'Unknown' : this.vendor_types[Number(vendor) - 1]) : 'N/A';
    },
    handleReviewEdit(section) {
      const obj = this.verification_details;
      obj[section].review_status = false;
      this.verification_details = Object.assign({}, this.verification_details, obj);
    },
    createLogStatement(log) {
      const localDate = this.formatDateToLocal(log.date_time);
      const statement = `${log.admin_name} ${log.last_activity} on ${moment(localDate).format('Do MMM YYYY')} at ${moment(localDate).format('HH:mm:ss A')}`;
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

        // this.verification_details.identity_check.id_card = name;
      }
    },

    formatDate(date) {
      const localDate = this.formatDateToLocal(date);
      return moment(localDate).format('Do MMM YYYY');
    },

    formatYear(date) {
      return moment(date).format('YYYY');
    },

    getPartnerLogs() {
      const payload = {
        partner_id: this.applicant_details.partner_id,
      };

      axios
        .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/logs/get_partner_logs/`, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: localStorage.token } })
        .then(response => {
          if (response.data.status) {
            this.partner_logs = response.data.logs;
          } else {
            this.partner_logs = [];
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => {
          this.errorObj = error.response;
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
        // eslint-disable-next-line no-else-return
      } else {
        return iid;
      }
    },

    checkReviewStatus() {
      const obj = this.verification_details;
      for (const key in obj) {
        if (obj[key].review_status === false) {
          return false;
        }
      }
      return true;
    },
    appendConsentText() {
      return 'hereby authorize the relevant Insurance Company to disclose my insurance information to Sendy Limited through their partner Verify portal International for the purposes of verifying the authenticity of my insurance particulars as provided to them. This authorization acts as my direct consent for the release of this information from my insurer for the purposes of my application to the use of my asset (motorbike/ vehicle) by Sendy.';
    },
    printInsurance() {
      const prtHtml = document.getElementById('print').innerHTML;
      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }
      const WinPrint = window.open('', '', 'left=0,top=0,margin-top=30000px,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
          ${stylesHtml}
        </head>
        <body>
          ${prtHtml}
        </body>
      </html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },
  },
  computed: {},
};
export default DetailMxn;
