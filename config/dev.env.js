const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENVIRONMENT: '"development"',
  DEBUG_MODE: true,
  AUTH_URL: '"https://authtest.sendyit.com/"',
  BASE_URL: '"https://ridertest.sendyit.com/admin_partner_api/v5/admin/"',
  PARTNER_BASE_URL: '"https://ridertest.sendyit.com/admin_partner_api/v5/"',
  ELASTIC_APM_SERVER_URL: '"https://staging-elk.sendyit.com:8200"',
});