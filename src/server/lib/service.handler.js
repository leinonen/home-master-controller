'use strict';

const Promise = require('../util/promise');

const noService = (err) => Promise.reject(err);

const noServices = (err) => {
  if (err.serviceDisabled && err.serviceDisabled === true) {
    return [];
  } else {
    return Promise.reject(err);
  }
};

exports.noService = noService;
exports.noServices = noServices;

exports.serviceDisabled = (message) => Promise.reject({
  serviceDisabled: true,
  message: message
});
