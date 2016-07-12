'use strict';

const
  GroupsService = require('./groups.service'),
  Links = require('../../lib/links'),
  serveJson = require('../../lib/json-controller'),
  isAuthenticated = require('../../components/auth/auth.service').isAuthenticated;

module.exports = require('express').Router()

  .get('/', (req, res) =>
    serveJson(GroupsService
      .getGroups()
      .then(groups => Links.apply(req, 'groups', groups)), req, res))

  .post('/', isAuthenticated(), (req, res) =>
    serveJson(GroupsService
      .createGroup(req.body)
      .then(group => Links.apply(req, 'group', group)), req, res))

  .get('/:type/:id', (req, res) =>
    serveJson(GroupsService
      .getGroup(req.params.id, req.params.type)
      .then(group => Links.apply(req, 'group', group)), req, res))

  .post('/:type/:id', isAuthenticated(), (req, res) =>
    serveJson(GroupsService
      .updateGroup(req.params.id, req.body), req, res))

  .delete('/:id', isAuthenticated(), (req, res) =>
    serveJson(GroupsService
      .removeGroup(req.params.id), req, res))

  .get('/:type/:id/state', (req, res) =>
    serveJson(GroupsService
      .groupState(req.params.id), req, res))

  .get('/:type/:id/devices', (req, res) =>
    serveJson(GroupsService
      .groupDevices(req.params.id, req.query.type)
      .then(devices => Links.apply(req, 'devices', devices)), req, res))

  .post('/:type/:id/control', isAuthenticated(), (req, res) =>
    serveJson(GroupsService
      .controlGroup(req.params.id, req.body), req, res));
