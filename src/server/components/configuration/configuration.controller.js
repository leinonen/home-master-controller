'use strict';

var Configuration = require('./configuration.model');
var ErrorHandler = require('../../util/errorhandler');

exports.readConfiguration = (req, res) => Configuration
  .get()
  .then(cfg => res.json(cfg))
  .catch(err => ErrorHandler.handle(res, err));

exports.saveConfiguration = (req, res) => Configuration
  .saveConfig(req.body._id, req.body)
  .then(cfg => res.json(cfg))
  .catch(err => ErrorHandler.handle(res, err));
