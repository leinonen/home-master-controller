var Qs = require('qs');
var OAuth = require('oauth');
var crypto = require('crypto');
var http = require('request-promise-json');
var config = require('./config');

function toYQL(url, params) {
	var yqlUrl = 'http://query.yahooapis.com/v1/public/yql?q=';
  var query = 'select * from json where url="{url}"'.replace('{url}', url);
  return yqlUrl + encodeURIComponent(query) + '&format=json';
}

function generateOAuth(url, params) {    
  var oauth = new OAuth.OAuth(null, null, config.publicKey, config.privateKey, '1.0', null, 'HMAC-SHA1');
  var oauthParameters = oauth._prepareParameters(config.accessToken, config.accessTokenSecret, 'GET', url, params);
  var messageParameters = {};
  oauthParameters.forEach(function(params){
  	messageParameters[params[0]] = params[1];
  });
  return messageParameters;
}

function createCORSRequest(url, params) {
	return http.get(toYQL(url + '?' + Qs.stringify(params)));
}

exports.doCall = function(path, params) {
	var url = config.endpoint + path;
	return createCORSRequest(url, generateOAuth(url, params));
};