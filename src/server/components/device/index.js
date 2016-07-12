'use strict';

const
  DeviceService = require('./device.service'),
  HMC = require('../../lib/hmc'),
  Links = require('../../lib/links'),
  isAuthenticated = require('../../components/auth/auth.service').isAuthenticated,
  serveJson = require('../../lib/json-controller');

module.exports = require('express').Router()

  .get('/', (req, res) =>
    serveJson(
      HMC.getDevices()
        .then(data => Links.apply(req, 'devices', data)),
      req, res
    )
  )

  .get('/:type/:id', (req, res) => serveJson(
    DeviceService.getDevice(req.params.id, req.params.type)
      .then(data => Links.apply(req, 'device', data)), req, res
  ))

  .post('/:type/:id/control', isAuthenticated(), (req, res) => serveJson(
    DeviceService.controlDevice(req.params.id, req.body, 'user'), req, res
  ));
