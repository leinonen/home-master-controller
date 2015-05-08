(function () {

  angular.module('device').service('DeviceHelper', function () {

    var TELLSTICK_TURNON = 1;
    var TELLSTICK_TURNOFF = 2;
//    var TELLSTICK_BELL = 4;
    var TELLSTICK_TOGGLE = 8;
//    var TELLSTICK_DIM = 16;
//    var TELLSTICK_LEARN = 32;
//    var TELLSTICK_EXECUTE = 64;
    var TELLSTICK_UP = 128;
    var TELLSTICK_DOWN = 256;
    var TELLSTICK_STOP = 512;

    function bitset(value, mask) {
      return (value & mask) !== 0;
    }

    var service = this;


    service.bitset = bitset;


    service.isMotorized = function (device) {
      return bitset(device.methods, TELLSTICK_DOWN) || bitset(device.methods, TELLSTICK_UP);
    };

    service.isOn = function (device) {
      return service.isMotorized(device) ?
        bitset(device.state, TELLSTICK_UP) :
        bitset(device.state, TELLSTICK_TURNON);
    };

    service.isOff = function (device) {
      return service.isMotorized(device) ?
        bitset(device.state, TELLSTICK_DOWN) :
        bitset(device.state, TELLSTICK_TURNOFF);
    };

    service.getSupportedMethods = function (device) {
      var methods = [];
      if (bitset(device.methods, TELLSTICK_TURNON)) {
        methods.push('turnon');
      }
      if (bitset(device.methods, TELLSTICK_TURNOFF)) {
        methods.push('turnoff');
      }
      if (bitset(device.methods, TELLSTICK_UP)) {
        methods.push('up');
      }
      if (bitset(device.methods, TELLSTICK_DOWN)) {
        methods.push('down');
      }
      if (bitset(device.methods, TELLSTICK_STOP)) {
        methods.push('stop');
      }
      return methods.join(', ');
    };

    service.getStates = function (device) {
      var state = [];
      if (bitset(device.state, TELLSTICK_TURNON)) {
        state.push('on');
      }
      if (bitset(device.state, TELLSTICK_TURNOFF)) {
        state.push('off');
      }
      if (bitset(device.state, TELLSTICK_UP)) {
        state.push('up');
      }
      if (bitset(device.state, TELLSTICK_DOWN)) {
        state.push('down');
      }
      if (bitset(device.state, TELLSTICK_STOP)) {
        state.push('stopped');
      }
      return state.join(', ');
    };


  });

})();
