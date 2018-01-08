const firebase = require("firebase-admin");
const errors = require('../errors');

module.exports.sendToDevices = (registrationTokens, payload) => {
  firebase.messaging.sendToDevice(registrationTokens, payload)
    .then(function(response) {
        
    })
    .catch(function(error) {

    });
};

module.exports.sendToDeviceGroup = (notificationKey, payload) => {
  firebase.messaging.sendToDeviceGroup(notificationKey, payload)
    .then(function(response) {

    })
    .catch(function(error) {

    });
};

module.exports.sendToTopic = (topic, payload) => {
  firebase.messaging.sendToTopic(topic, payload)
    .then(function(response) {

    })
    .catch(function(error) {

    });
};

module.exports.sendToCondition = (condition, payload) => {
  firebase.messaging.sendToCondition(condition, payload)
    .then(function(response) {

    })
    .catch(function(error) {

    });
};

module.exports.subscribeToTopic = (registrationTokens, topic) => {
  firebase.messaging.subscribeToTopic(registrationTokens, topic)
    .then(function(response) {

    })
    .catch(function(error) {

    });
};

module.exports.unsubscribeFromTopic = (registrationTokens, topic) => {
  firebase.messaging.unsubscribeFromTopic(registrationTokens, topic)
    .then(function(response) {

    })
    .catch(function(error) {

    });
};
