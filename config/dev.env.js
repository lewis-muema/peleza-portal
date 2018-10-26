var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENVIRONMENT: '"development"',
  DEBUG_MODE : true,
  BASE_URL: '"https://ridertest.sendyit.com/admin_partner_api/v3/admin/"',
  PARTNER_BASE_URL: '"https://ridertest.sendyit.com/admin_partner_api/v5/"',
  //PARTNER_BASE_URL: '"http://localhost:8888/admin_partner_api/index.php/v5/"',


});
