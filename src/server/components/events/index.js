'use strict';

var express = require('express');
var controller = require('./events.controller');
var auth = require('../../components/auth/auth.service');
var router = express.Router();

router.get('/events', auth.isAuthenticated(), controller.events);
router.get('/events/:id', auth.isAuthenticated(), controller.getEvent);
router.post('/events', auth.isAuthenticated(), controller.createEvent);
router.post('/events/:id', auth.isAuthenticated(), controller.updateEvent);

module.exports = router;
