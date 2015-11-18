describe('api-wrapper', function() {

  var DeviceTypes = require('../api/hmc/device-types');
  var Actions = require('../api/hmc/device-actions');

  var wrapper = require('./api-wrapper-mock');

  beforeEach(function() {

  });

  it('should get all sensors', function(callback) {
    wrapper.sensors().then(function(sensors){
      expect(sensors.length).toBe(6);
      callback();
    });
  });

  it('should get a single z-wave sensor', function(callback) {
    wrapper.sensor('blah', DeviceTypes.ZWAVE_SENSOR).then(function(sensor){
      expect(sensor.deviceType).toBe('sensorMultilevel');
      expect(sensor.id).toBe('ZWayVDev_zway_2-0-49-4');
      callback();
    });
  });

  it('should get a single telldus sensor', function(callback) {
    wrapper.sensor('blah', DeviceTypes.TELLDUS_SENSOR).then(function(sensor){
      expect(sensor.name).toBe('Balkongen');
      expect(sensor.id).toBe('296281');
      callback();
    });
  });

  it('should get all groups', function(callback) {
    wrapper.groups().then(function(groups){
      expect(groups.length).toBe(3);
      expect(groups[0].name).toBe('Rullgardinerna');
      expect(groups[1].name).toBe('TV-Bänk');
      expect(groups[2].name).toBe('My awesome group');
      callback();
    });
  });

  it('should get all devices', function(callback) {
    wrapper.devices().then(function(devices){
      expect(devices.length).toBe(13);
      callback();
    });
  });

  it('should get a zwave device', function(callback) {
    wrapper.device('meh', DeviceTypes.ZWAVE_SWITCH).then(function(device){
      expect(device.name).toBe('Livingroom Lights Switch');
      callback();
    });
  });

  it('should get a telldus device', function(callback) {
    wrapper.device('meh', DeviceTypes.TELLDUS_DEVICE).then(function(device){
      expect(device.name).toBe('Balkong slinga');
      callback();
    });
  });

  it('should respond with error for invalid device types', function(callback) {
    wrapper.device('meh', 'something-else').catch(function(err) {
      expect(err).toBe('Invalid device type: something-else');
      callback();
    });
  });

  it('should return devices in a custom group', function(callback) {
    wrapper.groupDevices('meh', DeviceTypes.GENERIC_GROUP)
      .then(function(devices){
        expect(devices.length).toBe(2);
        expect(devices[0].name).toBe('Livingroom Lights Switch');
        expect(devices[1].name).toBe('Livingroom Light Strip');
        expect(devices[1].manufacturername).toBe('Philips');
        callback();
      })
      .catch(function(err) {
      console.error(err);
      callback();
    });
  });

  it('should be possible to turn a z-wave device on', function(callback) {
    var params = {
      type: DeviceTypes.ZWAVE_SWITCH,
      action: Actions.ACTION_ON
    };
    wrapper.control('meh', params).then(function(response) {
      expect(response.status).toBe('200 OK');
      callback();
    });
  });

  it('should be possible to turn a z-wave device off', function(callback) {
    var params = {
      type: DeviceTypes.ZWAVE_SWITCH,
      action: Actions.ACTION_OFF
    };
    wrapper.control('meh', params).then(function(response) {
      expect(response.status).toBe('200 OK');
      callback();
    });
  });

/* TODO:
  it('should be possible to turn a telldus device on', function(callback) {
    var params = {
      type: DeviceTypes.TELLDUS_DEVICE,
      action: Actions.ACTION_ON
    };
    wrapper.control('meh', params).then(function(response) {
      expect(response.status).toBe('200 OK');
      callback();
    });
  });
*/

  it('should not be possible to turn a UNSUPPORTED device off', function(callback) {
    var params = {
      type: 'unsupported',
      action: Actions.ACTION_OFF
    };
    wrapper.control('meh', params).catch(function(err) {
      expect(err).toBe('unsupported is not implemented');
      callback();
    });
  });

});