'use strict';

var EventModel = require('./events.model');
var Promise = require('../../util/promise');

exports.getEvents = () => EventModel.findAll();

exports.getEvent = (id) => EventModel.findById(id);

exports.createEvent = (data) => {
  var model = new EventModel(data);
  model.save();
  return Promise.resolve(model);
};

exports.updateEvent = (id, data) =>
  EventModel.findById(id)
  .then(model => {
    model.name = data.name;
    model.action = data.action;
    model.sensor = data.sensor;
    model.items = data.items;
    return model;
  });

exports.removeEvent = (id) =>
  EventModel.findById(id)
  .then(model => {
    model.remove();
    return 'Event removed';
  });