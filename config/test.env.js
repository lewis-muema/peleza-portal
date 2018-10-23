module.exports = {
  NODE_ENV: '"testing"',
  ENVIRONMENT: '"testing"',
  DEBUG_MODE : true,
  BASE_URL: '"https://ridertest.sendyit.com/admin_partner_api/v3/admin/"',
  PARTNER_BASE_URL: '"https://ridertest.sendyit.com/admin_partner_api/v4/"',
  NODE_PARTNER_API: '"https://ridertest.sendyit.com/node_partner_api/v1/"',
  NODE_API_SWITCH:false,

  rbmq_link: '"wss://rabbitmqtest.sendyit.com:8443/ws?apikey="'+process.env.BACKEND_KEY,
  rbmq_user: process.env.BROKER_USER,
  rbmq_pass: process.env.BACKEND_PASS,
  websocket: '"wss://api.sendyit.com:9780/libraries"',

}
