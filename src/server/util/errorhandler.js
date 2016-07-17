'use strict';

var winston = require('winston');

module.exports = (res, err) => {
  winston.error(err.message);
  res.status(err.statusCode || 400).json({
    error: err
  });
};