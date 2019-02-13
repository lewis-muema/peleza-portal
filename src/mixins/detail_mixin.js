//detail mixin contains common methods computed properties across the details components

var DetailMxn = {
  created: function() {
    //call functions you want to execute when mixin is loaded into a component
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
      let obj = this.verification_details;
      obj[section]['review_status'] = false;
      this.verification_details = Object.assign({}, this.verification_details, obj);
    },
    createLogStatement(log) {
      let statement = `${log.admin_name}
        ${log.last_activity}
        on
        ${moment(log.date_time).format('Do MMM YYYY')}
        at
        ${moment(log.date_time).format('HH:mm:ss A')}`;
      return statement;
    },
    checkProperties(obj) {
      for (var key in obj) {
        if ((obj[key] == null || obj[key] === '') && obj[key] !== false) {
          return false;
        }
      }
      return true;
    },
    handleIdCardChange() {
      let files = document.getElementById('id_card')['files'];

      if (files.length < 1) {
        this.id_doc_change = false;
      } else {
        this.id_doc_change = true;
        let name = files[0]['name'];
        let obj = this.verification_details;
        obj['identity_check']['id_card'] = name;
        this.verification_details = Object.assign({}, this.verification_details, obj);

        //this.verification_details.identity_check.id_card = name;
      }
    },

    formatDate(date) {
      return moment(date).format('Do MMM YYYY');
    },

    formatYear(date) {
      return moment(date).format('YYYY');
    },

    getPartnerLogs() {
      let payload = {
        partner_id: this.applicant_details.partner_id,
      };

      axios
        .post(`${PARTNER_BASE_URL}peleza/logs/get_partner_logs/`, JSON.stringify(payload))
        .then(response => {
          if (response.data.status === true) {
            this.partner_logs = response.data.logs;
          } else {
            this.partner_logs = [];
          }
        })
        .catch(error => {
          throw new Error('Could not update applicant');
          this.$notify.error({
            title: 'submit applicant review',
            message: 'failed to update applicant review',
          });
        });
    },
    getAlbumName(iid) {
      if (iid === 'insurance') {
        return 'insu';
      } else if (iid === 'id_card' || iid === 'nok_id_card') {
        return 'id';
      } else if (iid === 'driver') {
        return 'photo';
      } else {
        return iid;
      }
    },

    checkReviewStatus() {
      let obj = this.verification_details;
      for (var key in obj) {
        if (obj[key]['review_status'] === false) {
          return false;
        }
      }
      return true;
    },
    appendConsentText() {
      return 'hereby authorize the relevant Insurance Company to disclose my insurance information to Sendy Limited through their partner Peleza International for the purposes of verifying the authenticity of my insurance particulars as provided to them. This authorization acts as my direct consent for the release of this information from my insurer for the purposes of my application to the use of my asset (motorbike/ vehicle) by Sendy.';
    },
    printInsurance() {
      const prtHtml = document.getElementById('print').innerHTML;
      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }
      const WinPrint = window.open(
        '',
        '',
        'left=0,top=0,margin-top=30000px,width=800,height=900,toolbar=0,scrollbars=0,status=0'
      );
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
