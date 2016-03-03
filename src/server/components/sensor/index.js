'use strict';

const
  SensorService = require('./sensor.service'),
  ErrorHandler = require('../../util/errorhandler');

module.exports = require('express').Router()

  .get('/', (req, res) =>
    SensorService.getSensors()
      .then(sensors => res.json(sensors))
      .catch(err => ErrorHandler(res, err)))

  .get('/:type/:id', (req, res) =>
    SensorService.getSensor(req.params.id, req.params.type)
      .then(sensor => res.json(sensor))
      .catch(err => ErrorHandler(res, err)));

