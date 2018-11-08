var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENVIRONMENT: '"development"',
  DEBUG_MODE : true,
  BASE_URL: '"https://ridertest.sendyit.com/admin_partner_api/v5/admin/"',
  PARTNER_BASE_URL: '"https://ridertest.sendyit.com/admin_partner_api/v5/"'
  
});
