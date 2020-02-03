import * as moment from 'moment';

const TimezoneMxn = {
    methods: {
    convertToUTC(date) {
      const UTCDate = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
      return UTCDate;
    },
    convertToLocalTime(date) {
      const localTime = moment(date)
      .local()
      .format('YYYY-MM-DD HH:mm:ss');
      return localTime;
    },
    formatDateToLocal(date) {
      const formated = moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');
      return formated;
    },
    },
  };
  export default TimezoneMxn;
