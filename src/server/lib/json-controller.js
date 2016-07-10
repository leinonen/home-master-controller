'use strict';

const ErrorHandler = require('../util/errorhandler');

module.exports = (promise, req, res) => promise
  .then(data => res.json(data))
  .catch(err => ErrorHandler.handle(res, err));