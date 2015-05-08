'use strict';

describe('DeviceHelper Service', function () {

  var $rootScope, service;

  // Load the module
  beforeEach(module('hmc'));
  beforeEach(module('device'));

  // Load our dependencies.
  beforeEach(inject(function ($injector) {
    service = $injector.get('DeviceHelper');
  }));


  it('should indentify a motorized device', function () {
    var device = {
      methods: 896
    };
    expect(service.isMotorized(device)).toBe(true);
  });

  it('should indentify a motorized device that is up', function () {
    var device = {
      methods: 896,
      state: 128
    };
    var TELLSTICK_UP = 128;

    expect(service.isMotorized(device)).toBe(true);
    expect(service.isOn(device)).toBe(true);
    expect(service.bitset(device.state, TELLSTICK_UP));
  });


});
