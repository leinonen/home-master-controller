var Configuration = require('./configuration.model');
var Logger = require('../../util/logger');

var errorHandler = (res, err) => {
  Logger.error(err.message);
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