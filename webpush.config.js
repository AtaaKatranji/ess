const webPush = require('web-push');

// Your VAPID keys
const vapidKeys = {
    publicKey: `${process.env.PUBLIC_VAPID_KEY}`, // Replace with the correctly generated key
    privateKey: `${process.env.PRIVATE_VAPID_KEY}` // Replace with the correctly generated key
};

// Set the VAPID keys
webPush.setVapidDetails(
    'mailto:ataa.katranji@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

module.exports = { webPush };