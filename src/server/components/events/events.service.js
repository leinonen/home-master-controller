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

exports.updateEvent = (id, update) =>
  EventModel.findById(id)
  .then(model => {
    model.name = update.name;
    model.sensorAction = update.sensorAction;
    model.sensor = update.sensor;
    model.devices = update.devices;
    model.deviceAction = update.deviceAction;
    console.log('update event', model);
    return model;
  });

exports.removeEvent = (id) =>
  EventModel.findById(id)
  .then(model => {
    model.remove();
    return 'Event removed';
  });