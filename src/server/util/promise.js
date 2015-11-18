'use strict';

var Q = require('q');

exports.resolve = (value) => {
  let deferred = Q.defer();
  deferred.resolve(value);
  return deferred.promise;
}

exports.reject = (value) => {
  let deferred = Q.defer();
  deferred.reject(value);
  return deferred.promise;
}

exports.all = Q.all;
