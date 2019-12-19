import * as moment from 'moment';

const timezone = {
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
    convertToUTCToLocal(date) {
      const formated = moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');
      return formated;
    },
    },
  };
  export default timezone;
