'use strict';

const
  SensorService = require('./sensor.service'),
  serveJson = require('../../lib/json-controller');

module.exports = require('express').Router()

  .get('/', (req, res) =>
    serveJson(SensorService
      .getSensors(), req, res))

  .get('/:type/:id', (req, res) =>
    serveJson(SensorService
      .getSensor(req.params.id, req.params.type), req, res));
