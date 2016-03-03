'use strict';

const
  DeviceService = require('./device.service'),
  error = require('../../util/errorhandler'),
  Links = require('../../lib/links'),
  isAuthenticated = require('../../components/auth/auth.service').isAuthenticated,
  json = (res, data) => res.json(data);

module.exports = require('express').Router()

  .get('/', (req, res) =>
  DeviceService.getDevices()
    .then(data => Links.apply(req, 'devices', data))
    .then(data => json(res, data))
    .catch(e => error(res, e)))

  .get('/:type/:id', (req, res) =>
  DeviceService.getDevice(req.params.id, req.params.type)
    .then(data => Links.apply(req, 'device', data))
    .then(data => json(res, data))
    .catch(e => error(res, e)))

  .post('/:type/:id/control', isAuthenticated(), (req, res) =>
  DeviceService.controlDevice(req.params.id, req.body, 'user')
    .then(data => json(res, data))
    .catch(e => error(res, e)));
