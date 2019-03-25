/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable import/no-extraneous-dependencies */
require('eventsource-polyfill');
const hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true');

hotClient.subscribe((event) => {
  if (event.action === 'reload') {
    window.location.reload();
  }
});
