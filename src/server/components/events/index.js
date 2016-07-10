'use strict';

var express = require('express');
var isAuthenticated = require('../../components/auth/auth.service').isAuthenticated;
var EventsService = require('./events.service');
var serveJson = require('../../lib/json-controller');

module.exports = express.Router()
  .get('/', isAuthenticated(), (req, res) =>
    serveJson(EventsService.getEvents(), req, res)
  )
  .get('/:id', isAuthenticated(), (req, res) =>
    serveJson(EventsService.getEvent(req.params.id), req, res)
  )
  .delete('/:id', isAuthenticated(), (req, res) =>
    serveJson(EventsService.removeEvent(req.params.id), req, res)
  )
  .post('/', isAuthenticated(), (req, res) =>
    serveJson(EventsService.createEvent(req.body), req, res)
  )
  .post('/:id', isAuthenticated(), (req, res) =>
    serveJson(EventsService.updateEvent(req.params.id, req.body), req, res)
  );

