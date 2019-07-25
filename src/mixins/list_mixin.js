/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
// list mixin contains common methods computed properties across the list components

// eslint-disable-next-line import/no-mutable-exports
const ListMxn = {
  created() {
    // call functions you want to execute when mixin is loaded into a component
  },
  methods: {
    formatTime(row, column) {
      return moment(row.date_created).format('Do MMM YYYY, h:mm:ss a');
    },
    changeSize(val) {
      this.pagination_page = 1;
      this.pagination_limit = val;
    },
    changePage() {
      console.log('Page changed to', this.pagination_page);
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      const paginated_applicants = this.searched_applicants.slice(from, to);
      console.log(from, to, paginated_applicants);
    },
    changeDateRange() {
      this.pagination_page = 1;
      this.getApplicants();
    },

    getVendorType(row, column) {
      return row.vendor_type ? (row.vendor_type === '0' ? 'Unknown' : this.vendor_types[Number(row.vendor_type) - 1]) : 'N/A';
    },
    getVendorTypeName(vendor) {
      return vendor !== null ? (vendor === '0' ? 'Unknown' : this.vendor_types[Number(vendor) - 1]) : 'N/A';
    },
    getDesk(row, column) {
      return row.admin_name ? (row.admin_name.length > 0 ? row.admin_name : 'N/A') : 'N/A';
    },
    getLastActivity(row, column) {
      return row.last_activity ? (row.last_activity.length > 0 ? row.last_activity : 'N/A') : 'N/A';
    },
  },
  computed: {
    searched_applicants() {
      return this.applicants.filter(applicant => {
        const searchable_string = (applicant.id_no + applicant.kra_pin + this.getVendorTypeName(applicant.vendor_type))
          .split(' ')
          .join('')
          .toLowerCase();
        return searchable_string.indexOf(this.$store.getters.search_term) > -1;
      });
    },
    paginated_applicants() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      return this.searched_applicants.slice(from, to);
    },
    current_verification() {
      return this.$store.getters.current_verification;
    },
  },
};
export default ListMxn;
