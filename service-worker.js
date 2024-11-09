// importScripts("https://js.pusher.com/beams/service-worker.js");
const Pusher = require("pusher");
const PushNotifications = require('@pusher/push-notifications-server');
const pusher = new Pusher({
  appId: "1893242",
  key: "4cf77679a2cbb8dc1484",
  secret: "0693011340cf3ab569d1",
  cluster: "ap2",
  useTLS: true
});
const beamsClient = new PushNotifications({
    instanceId: '8ada9f25-cf20-486f-87d6-45d216c148a8',
    secretKey:'7905545CC51AED29913866B5F0DED0800C3C344389045E677E3918FFCB749718'
  });

//   beamsClient.start()
//     .then(() => beamsClient.addDeviceInterest('hello'))
//     .then(() => console.log('Successfully registered and subscribed!'))
//     .catch(console.error);

module.exports = { beamsClient, pusher };