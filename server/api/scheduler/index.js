var express = require('express');
var controller = require('./scheduler.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

// Scheduler
router.get('/schedules', controller.schedules);
router.post('/schedules', auth.isAuthenticated(), controller.createSchedule);
router.get('/schedules/:id', controller.schedule);
router.put('/schedules/:id', auth.isAuthenticated(), controller.updateSchedule);
router.delete('/schedules/:id', auth.isAuthenticated(), controller.deleteSchedule);

module.exports = router;
