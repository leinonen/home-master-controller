'use strict';

var Qs = require('querystring');
var OAuth = require('oauth');
var http = require('request-promise-json');
var Promise = require('../../util/promise');

function TelldusConnector() {

}

function errorHandler(err){
  if (err.code === 'ECONNREFUSED' ||
    err.code === 'ENETUNREACH' ||
    err.code === 'ETIMEDOUT') {
    return Promise.reject({
      statusCode: 500,
      message: 'Unable to connect to Telldus endpoint. Check your configuration'
    });
  } else {
    return Promise.reject(err);
  }
}

var createOAuthParams = (url, params, config) => {
  let oauth = new OAuth.OAuth(null, null,
    config.publicKey,
    config.privateKey, '1.0', null, 'HMAC-SHA1');
  let oauthParameters = oauth._prepareParameters(
    config.accessToken,
    config.accessTokenSecret, 'GET', url, params);
  let messageParameters = {};
  oauthParameters.forEach(params => messageParameters[params[0]] = params[1]);
  return messageParameters;
};

TelldusConnector.prototype.get = (config, path, params) => {
  let url = config.endpoint + path;
  let oAuthParams = createOAuthParams(url, params, config);
  return http.get(url + '?' + Qs.stringify(oAuthParams)).catch(errorHandler);
};

module.exports = new TelldusConnector();