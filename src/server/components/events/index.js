'use strict';

var express = require('express');
var controller = require('./events.controller');
var auth = require('../../components/auth/auth.service');
var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.events);
router.get('/:id', auth.isAuthenticated(), controller.getEvent);
router.post('/', auth.isAuthenticated(), controller.createEvent);
router.post('/:id', auth.isAuthenticated(), controller.updateEvent);

module.exports = router;
