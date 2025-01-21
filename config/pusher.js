const PushNotifications = require('@pusher/push-notifications-server');

const beamsClient = new PushNotifications({
  instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID,
  secretKey: process.env.PUSHER_BEAMS_PRIMARY_KEY,
});

module.exports = beamsClient;