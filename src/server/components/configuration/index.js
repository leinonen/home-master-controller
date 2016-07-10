'use strict';
var auth = require('../../components/auth/auth.service');
var serveJson = require('../../lib/json-controller');
var Configuration = require('./configuration.model');

module.exports = require('express').Router()
  .get('/configuration', (req, res) => serveJson(
    Configuration.get(), req, res
  ))

  .post('/configuration', auth.isAuthenticated(), (req, res) => serveJson(
    Configuration.saveConfig(req.body._id, req.body), req, res
  ));

