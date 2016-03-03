'use strict';
var express = require('express');
var controller = require('././configuration.controller');
var auth = require('../../components/auth/auth.service');
var router = express.Router();

router.get('/configuration', controller.readConfiguration);
router.post('/configuration', auth.isAuthenticated(), controller.saveConfiguration);

module.exports = router;
