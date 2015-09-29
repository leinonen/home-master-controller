var express = require('express');
var controller = require('./hmc.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/configuration', controller.readConfiguration);
router.post('/configuration', auth.isAuthenticated(), controller.saveConfiguration);

router.get('/sensors', controller.sensors);
router.get('/sensors/:id', controller.sensor);

router.get('/devices', controller.devices);
router.get('/device/:id', controller.device);

router.get('/groups', controller.groups);
router.post('/groups', controller.createGroup);
router.get('/groupState/:id', controller.groupState);

router.get('/group/:id', controller.group);
router.post('/group/:id', controller.updateGroup);
router.delete('/group/:id', controller.deleteGroup);
router.get('/group/:id/devices', controller.groupDevices);

router.post('/control/:id', auth.isAuthenticated(), controller.control);

// Scheduler
router.get('/schedules', controller.schedules);
router.post('/schedules', auth.isAuthenticated(), controller.createSchedule);
router.get('/schedules/:id', controller.schedule);
router.put('/schedules/:id', auth.isAuthenticated(), controller.updateSchedule);
router.delete('/schedules/:id', auth.isAuthenticated(), controller.deleteSchedule);

module.exports = router;
