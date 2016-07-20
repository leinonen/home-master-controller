'use strict';

const HPromise = require('../util/promise');

const noService = (err) => HPromise.reject(err);

const noServices = (err) => {
  if (err.serviceDisabled && err.serviceDisabled === true) {
    return [];
  } else {
    return HPromise.reject(err);
  }
};

exports.noService = noService;
exports.noServices = noServices;

exports.serviceDisabled = (message) => HPromise.reject({
  serviceDisabled: true,
  message: message
});
