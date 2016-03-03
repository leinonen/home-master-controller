'use strict';

const
  DeviceActions = require('./device-actions'),
  DeviceTypes = require('./device-types'),
  util = require('util');

let baseUrl = (req) => req.protocol + '://localhost:8080';

let makeLink = (base, method, name, url) => {
  return {
    rel: name,
    method: method,
    href: base + url
  };
};

let selfLink = (req) => makeLink(baseUrl(req), 'GET', 'self', req.originalUrl );

let buildUrl = (req, path, method, name, device) => {
  let url = util.format('/api/%s/%s/%s', path, device.type, device.id);
  return makeLink(baseUrl(req), method, name, url);
};

let controlUrl = (req, path, name, device, action) => {
  let fmt = '/api/%s/%s/%s/control';
  let url = makeLink(baseUrl(req), 'POST', name, util.format(fmt, path, device.type, device.id));
  url.params = {
    type: device.type,
    action: action
  };
  return url;
};

let isDevice = (item) => {
  if (item.type) {
    return item.type.indexOf('device') !== -1 || item.type.indexOf('switch') !== -1;
  } else {
    return false;
  }
};

let isGroup = (item) => {
  if (item.type) {
    return item.type.indexOf('group') !== -1;
  } else {
    return false;
  }
};

let applyLink = (req, name, item) => {
  item.links = [];


  if (isDevice(item)) {
    item.links.push(buildUrl(req, 'devices', 'GET', 'self', item));
  }
  if (isGroup(item)) {
    item.links.push(buildUrl(req, 'groups', 'GET', 'self', item));
  }

  if (item.type === DeviceTypes.HUE_DEVICE) {
    item.links.push(controlUrl(req, 'devices', 'colorloop-on', item, 'colorloop-on'));
    item.links.push(controlUrl(req, 'devices', 'colorloop-off', item, 'colorloop-off'));
    item.links.push(controlUrl(req, 'devices', 'set-brightness', item, 'bri'));
    item.links.push(controlUrl(req, 'devices', 'set-hue', item, 'hue'));
    item.links.push(controlUrl(req, 'devices', 'set-saturation', item, 'sat'));
  }

  if (item.state) {
    if (item.state.on === true) {
      if (isDevice(item)) {
        item.links.push(controlUrl(req, 'devices', 'disable', item, DeviceActions.ACTION_OFF));
      }
      if (isGroup(item)) {
        item.links.push(controlUrl(req, 'groups', 'disable', item, DeviceActions.ACTION_OFF));
      }

    } else if (item.state.on === false) {
      if (isDevice(item)) {
        item.links.push(controlUrl(req, 'devices', 'enable', item, DeviceActions.ACTION_ON));
      } else if (isGroup(item)) {
        item.links.push(controlUrl(req, 'groups', 'enable', item, DeviceActions.ACTION_ON));
      }

    }
  }

  return item;
};

let applyLinks = (req, name, devices) => devices.map(device => applyLink(req, name, device));

exports.apply = function(req, name, item) {
  let data = {};
  if (name === 'devices') {
    data[name] = applyLinks(req, name, item);
  } else if (name === 'groups') {
    data[name] = applyLinks(req, name, item);
  } else {
    data[name] = item; // no links!
  }

  data['links'] = [
    selfLink(req)
  ];
  return data;
};
