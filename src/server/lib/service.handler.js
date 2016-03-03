var Promise = require('../util/promise');

var noService = (err) => Promise.reject(err);

var noServices = (err) => {
  if (err.serviceDisabled && err.serviceDisabled === true) {
    return [];
  } else {
    return Promise.reject(err);
  }
};

exports.noService = noService;
exports.noServices = noServices;

exports.serviceDisabled = (message) =>
  Promise.reject({serviceDisabled: true, message: message});
