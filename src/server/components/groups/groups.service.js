'use strict';

const
  Group = require('./group.model.js'),
  Promise = require('../../util/promise'),
  Transformer = require('./group-transformer'),
  DeviceTypes = require('../../lib/device-types'),
  DeviceService = require('../device/device.service'),
  ServiceHandler = require('../../lib/service.handler'),
  Hue = require('../../lib/hue/hue'),
  Telldus = require('../../lib/telldus/telldus');

var GENERIC_GROUP  = (id) =>
  Group.findById(id)
    .then(Transformer.GenericGroup);

var GENERIC_GROUPS = () =>
  Group.findAll()
    .then(Transformer.GenericGroups)
    .then(groups => Promise.all(groups.map(group =>
      Promise
        .all(group.items.map(item => DeviceService.getDevice(item.id, item.type)))
        .then(function(items) {
          group.items = items;
          group.state.on = items.every(item => item.state.on === true);
          return group;
        }))
    ));

let HUE_GROUP = (id) =>
  Hue.group(id)
    .then(Hue.transformGroup)
    .catch(ServiceHandler.noService);

let HUE_GROUPS = () =>
  Hue.groups()
    .then(groups => Hue.transformGroups(groups))
    .catch(err =>ServiceHandler.noServices(err));

var TELLDUS_GROUP = (id) =>
  Telldus.group(id)
    .then(Telldus.transformGroup)
    .catch(ServiceHandler.noService);

var TELLDUS_GROUPS = () =>
  Telldus.groups()
    .then(groups => Telldus.transformGroups(groups))
    .catch(err => ServiceHandler.noServices(err));


exports.createGroup = (group) => {
  var g = new Group(group);
  g.save();
  return Promise.resolve(g);
};

exports.updateGroup = (id, group) => Group.findById(id)
  .then(g => {
    g.name = group.name;
    g.items = group.items;
    g.save();
    return g;
  });

exports.removeGroup = (id) => Group.findById(id).then(g => {
  g.remove();
  return 'Group removed!';
});

var groupDevices = (id) => Group.findById(id).then(group => group.items);


exports.getGroups = () => {
  let promises = [
    TELLDUS_GROUPS(),
    HUE_GROUPS(),
    GENERIC_GROUPS()
  ];
  return Promise.all(promises).then(arr => arr.reduce((a, b) => a.concat(b)));
};

exports.getGroup = (id, type) => {
  switch (type) {
    case DeviceTypes.GENERIC_GROUP:
      return GENERIC_GROUP(id);
    case DeviceTypes.TELLDUS_GROUP:
      return TELLDUS_GROUP(id);
    case DeviceTypes.HUE_GROUP:
      return HUE_GROUP(id);
    default:
      return Promise.reject('Unsupported group ' + type);
  }
};

let getDevicePromises = (devices) =>
  devices.map(device => DeviceService.getDevice(device.id, device.type));


exports.groupDevices = (id, type) =>
  groupDevices(id)
  .then(devices => Promise.all(getDevicePromises(devices)));



exports.groupState = (id) =>
  groupDevices(id)
  .then(items => Promise.all(getDevicePromises(items)).then(devices => {
    return {
      id: id,
      state: {
        // Group is on if all devices are on
        on: devices.every(device => device.state.on === true)
      },
      devices: devices
    }
  }));

exports.controlGroup = (id, data) => {
  return groupDevices(id)
    .then(devices => Promise.all(devices.map(device => {

      data.type = device.type;
      data.id = device.id;
      console.log('dauta: ', data);
      return DeviceService.controlDevice(device.id, data, 'user');
    })));
};



