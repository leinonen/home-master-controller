'use strict';

const
  GroupsService = require('./groups.service'),
  ErrorHandler = require('../../util/errorhandler'),
  Links = require('../../lib/links'),
  isAuthenticated = require('../../components/auth/auth.service').isAuthenticated;

module.exports = require('express').Router()

  .get('/', (req, res) =>
    GroupsService.getGroups()
      .then(groups => Links.apply(req, 'groups', groups))
      .then(data => res.json(data))
      .catch(e => ErrorHandler(res, e)))

  .post('/', isAuthenticated(), (req, res) =>
    GroupsService.createGroup(req.body)
      .then(group => Links.apply(req, 'group', group))
      .then(group => res.json(group))
      .catch(err => ErrorHandler(res, err)))

  .get('/:type/:id', (req, res) =>
    GroupsService.getGroup(req.params.id, req.params.type)
      .then(group => Links.apply(req, 'group', group))
      .then(group => res.json(group))
      .catch(err => ErrorHandler(res, err)))

  .post('/:type/:id', isAuthenticated(), (req, res) =>
    GroupsService.updateGroup(req.params.id, req.body)
      .then(group => res.json(group))
      .catch(err => ErrorHandler(res, err)))

  .delete('/:id', isAuthenticated(), (req, res) =>
    GroupsService.removeGroup(req.params.id)
      .then(group => res.json(group))
      .catch(err => ErrorHandler(res, err)))

  .get('/:type/:id/state', (req, res) =>
    GroupsService.groupState(req.params.id)
      .then(group => res.json(group))
      .catch(err => ErrorHandler(res, err)))

  .get('/:type/:id/devices', (req, res) =>
    GroupsService.groupDevices(req.params.id, req.query.type)
      .then(devices => Links.apply(req, 'devices', devices))
      .then(devices => res.json(devices))
      .catch(err => ErrorHandler(res, err)))

  .post('/:type/:id/control', isAuthenticated(), (req, res) => {
    console.log('body: ', req.body);
    return GroupsService.controlGroup(req.params.id, req.body)
      .then(group => res.json(group))
      .catch(err => ErrorHandler(res, err))
  });