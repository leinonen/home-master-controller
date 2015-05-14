/**
 * Master API - Control everything! :D
 * @type {exports}
 */
var telldus = require('./api/telldus');
var telldusHelper = require('./api/telldus-helper');

var hue = require('./api/hue');
var Q = require('q');

var Group = require('../models/group');

function errorHandler(error) {
  var deferred = Q.defer();
  var msg = {};
  msg.statusCode = error.statusCode;
  msg.message = error.statusCode === 404 ? 'Not found' : 'error';
  if (error.hasOwnProperty('request')) {
    msg.url = error.request.url;
  }
  deferred.reject(msg);
  return deferred.promise;
}

/**
 * Get all sensors
 */
exports.sensors = function () {
  return telldus.listSensors().then(function (sensors) {
    return Q.all(sensors.map(function (sensor) {
      return telldus.getSensor(sensor.id);
    })).then(transformTelldusSensors);
  });
};

exports.sensor = function (id) {
  return telldus.getSensor(id);
};


function getGenericGroups() {
  return Group.find().execQ();
}
exports.getGenericGroups = getGenericGroups;

function createGenericGroup(group){
  var g = new Group(group);
  g.save();
  return g;
}

exports.createGenericGroup = createGenericGroup;

function transformGenericGroups(groups){
  return groups.map(function(group){
    var item = {};
    item.name = group.name;
    item.id = group._id;
    item.items = [];
    group.items.forEach(function(a){
      item.items.push(a);
    });
    item.type = 'generic-group';
    item.state = {
      on: false
    };
    item.motorized = false;
    return item;
  });
}

/**
 * Get all groups
 */
exports.groups = function () {
  return telldus.listGroups().then(transformTelldusGroups).then(function (telldusGroups) {
    return hue.getGroups().then(transformHueGroups).then(function (hueGroups) {
      return getGenericGroups().then(transformGenericGroups).then(function(genericGroups){
        return telldusGroups.concat(hueGroups).concat(genericGroups);
      });
    });
  });
};

/**
 * Get all devices
 */
exports.devices = function () {
  return telldus.listDevices().then(transformTelldusDevices).then(function (telldusDevices) {
    return hue.getLights().then(transformHueDevices).then(function (hueDevices) {
      return telldusDevices.concat(hueDevices);
    }).catch(function (err) {
      return errorHandler(err);
    });
  });
};

/**
 * Get a specific device.
 * @param id
 * @param type
 * @returns {*}
 */
exports.device = function (id, type) {
  if (type === 'telldus-device') {
    return telldus.getDevice(id).then(transformTelldusDevice);
  } else if (type === 'hue-device') {
    return hue.getLight(id).then(function (device) {
      device.id = id;
      return transformHueDevice(device);
    });
  } else {
    var deferred = Q.defer();
    deferred.reject('Not implemented');
    return deferred.promise;
  }
};

/**
 * Control a device or group
 * @param device
 */
exports.control = function (id, params) {
  console.log('control %d : %s -> action: %s', id, params.type, params.action);

  if (params.type === 'telldus-device' || params.type === 'telldus-group') {
    return controlTelldus(id, params);
  } else if (params.type === 'hue-device' || params.type === 'hue-group') {
    return controlHue(id, params);
  } else {
    var deferred = Q.defer();
    deferred.reject('Not implemented');
    return deferred.promise;
  }
};

/**
 * Handle telldus device.
 * @param id
 * @param params
 * @returns {*}
 */
function controlTelldus(id, params) {
  if (params.action === 'on') {
    return telldus.turnOn(id);
  } else if (params.action === 'off') {
    return telldus.turnOff(id);
  } else if (params.action === 'up') {
    return telldus.goUp(id);
  } else if (params.action === 'down') {
    return telldus.goDown(id);
  }
}


/**
 * Handle Philips Hue device.
 * @param id
 * @param params
 * @returns {*}
 */
function controlHue(id, params) {
  if (params.action === 'on') {

    if (params.type === 'hue-device'){
      console.log('turn light on');
      return hue.setLightState(id, {on: true});
    } else if (params.type === 'hue-group') {
      console.log('turn group on');
      return hue.setGroupAction(id, {on: true});
    }

  } else if (params.action === 'off') {

    if (params.type === 'hue-device'){
      console.log('turn light off');
      return hue.setLightState(id, {on: false});
    } else if (params.type === 'hue-group'){
      console.log('turn group off');
      return hue.setGroupAction(id, {on: false});
    }

  } else if (params.action === 'bri') {
    console.log('set brightness to ' + params.value);
    return hue.setLightState(id, {bri: Number(params.value)});

  } else if (params.action === 'sat') {
    console.log('set saturation to ' + params.value);
    return hue.setLightState(id, {sat: Number(params.value)});

  } else if (params.action === 'hue') {
    console.log('set hue to ' + params.value);
    return hue.setLightState(id, {hue: Number(params.value)});

  }

}


function transformTelldusSensors(sensors) {
  return sensors.map(function (sensor) {
    sensor.type = 'telldus-sensor';
    return sensor;
  });
}

function transformTelldusGroups(groups) {
  return groups.map(function (group) {
    var item = {};
    item.id = group.id;
    item.name = group.name;
    item.type = 'telldus-group';
    item.methods = telldusHelper.getSupportedMethods(group);
    item.state = {};
    item.state.on = telldusHelper.isOn(group);
    item.devices = group.devices.split(',');
    item.motorized = telldusHelper.isMotorized(group);
    return item;
  });
}

function transformHueGroups(groups) {
  return groups.map(function (group) {
    var item = {};
    item.id = group.id;
    item.name = group.name;
    item.type = 'hue-group';
    item.state = group.action;
    item.devices = group.lights;
    item.motorized = false;
    return item;
  });
}

function transformTelldusDevice(device) {
  var item = {};
  item.id = device.id;
  item.name = device.name;
  item.type = 'telldus-device';
  item.motorized = telldusHelper.isMotorized(device);
  item.methods = telldusHelper.getSupportedMethods(device);
  item.state = {};
  item.state.on = telldusHelper.isOn(device);
  return item;
}

function transformTelldusDevices(devices) {
  return devices.map(transformTelldusDevice);
}

function transformHueDevice(device) {
  var item = {};
  item.id = device.id;
  item.name = device.name;
  item.type = 'hue-device';
  item.modelid = device.modelid;
  item.manufacturername = device.manufacturername;
  item.state = device.state;
  return item;
}

function transformHueDevices(devices) {
  return devices.map(transformHueDevice);
}
