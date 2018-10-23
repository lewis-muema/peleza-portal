var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENVIRONMENT: '"development"',
  DEBUG_MODE : true,
  BASE_URL: '"https://ridertest.sendyit.com/admin_partner_api/v3/admin/"',
  PARTNER_BASE_URL: '"https://ridertest.sendyit.com/admin_partner_api/v4/"',

  rbmq_link: '"wss://staging-stomp.sendyit.com:15675/ws"',
  rbmq_user: '"staging"',
  rbmq_pass: '"0FAHmQQmjfsIXdro"',
  websocket: '"wss://api.sendyit.com:9780/libraries"',

});
