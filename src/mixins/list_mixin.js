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
      const localDate = this.convertToLocalTime(row.date_created);
      return moment(localDate).format('Do MMM YYYY, h:mm:ss a');
    },
    formatVerified(row) {
      const localDate = this.convertToLocalTime(row.date_verified);
      return moment(localDate).format('Do MMM YYYY, h:mm:ss a');
    },
    changeSize(val) {
      this.pagination_page = 1;
      this.pagination_limit = val;
    },
    changePage() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      const paginated_applicants = this.searched_applicants.slice(from, to);
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
    searchApplicants(searchTerm, array) {
      const data = array.filter(applicant => {
        const searchable_string = (applicant.id_no + applicant.kra_pin + this.getVendorTypeName(applicant.vendor_type))
          .split(' ')
          .join('')
          .toLowerCase();
        return searchable_string.indexOf(searchTerm) > -1;
      });
      // this.filteredData = data;
      return data;
    },
  },
  computed: {
    searched_applicants() {
      this.$store.commit('setApplicantionCount', this.applicants.length);
      return this.searchApplicants(this.$store.getters.search_term, this.applicants);
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
