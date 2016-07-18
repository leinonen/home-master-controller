'use strict';

const
  HMC = require('../../lib/hmc');

exports.getDevices = () => HMC.getDevices();

exports.getDevice = (id, type) => HMC.getDevice(id, type);

exports.controlDevice = (id, params, initiator) => HMC.control(id, params, initiator);
