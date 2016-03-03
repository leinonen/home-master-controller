var ErrorHandler = require('../../util/errorhandler');
var EventsService = require('./events.service');

exports.events = (req, res) =>
  EventsService.getEvents()
  .then(devices => res.json(devices))
  .catch(err => ErrorHandler.handle(res, err));

exports.getEvent = (req, res) =>
  EventsService.getEvent(req.params.id)
    .then(devices => res.json(devices))
    .catch(err => ErrorHandler.handle(res, err));

exports.createEvent = (req, res) =>
  EventsService.createEvent(req.body)
  .then(devices => res.json(devices))
  .catch(err => ErrorHandler.handle(res, err));

exports.updateEvent = (req, res) =>
  EventsService.updateEvent(req.params.id, req.body)
    .then(devices => res.json(devices))
    .catch(err => ErrorHandler.handle(res, err));
