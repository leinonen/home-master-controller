'use strict';

var Configuration = require('./configuration.model');
var winston = require('winston');

var errorHandler = (res, err) => {
  winston.error(err.message);
  res.status(err.statusCode || 400).json(err);
};

exports.readConfiguration = (req, res) => Configuration
  .get()
  .then(cfg => res.json(cfg))
  .catch(err => errorHandler(res, err));

exports.saveConfiguration = (req, res) => Configuration
  .saveConfig(req.body._id, req.body)
  .then(cfg => res.json(cfg))
  .catch(err => errorHandler(res, err));