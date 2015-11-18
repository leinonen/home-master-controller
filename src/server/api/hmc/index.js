'use strict';
var express = require('express');
var hmc = require('./hmc.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/sensors', hmc.sensors);
router.get('/sensors/:id', hmc.sensor);

router.get('/devices', hmc.devices);
router.get('/device/:id', hmc.device);

router.get('/groups', hmc.groups);
router.post('/groups', hmc.createGroup);
router.get('/groupState/:id', hmc.groupState);

router.get('/group/:id', hmc.group);
router.post('/group/:id', hmc.updateGroup);
router.delete('/group/:id', hmc.deleteGroup);
router.get('/group/:id/devices', hmc.groupDevices);

router.post('/control/:id', auth.isAuthenticated(), hmc.control);

module.exports = router;
