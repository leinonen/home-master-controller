'use strict';

describe('Component: device-card', function() {

  beforeEach(module('app'));
  beforeEach(module('app/views/header.html'));
  beforeEach(module('app/views/footer.html'));

  beforeEach(module('app/device/device-card.html'));

  var ctrl, element, scope, $rootScope, compile, Socket, http;

  function compileDeviceCard() {
    var markup = '<device-card device="device" controls="true"></device-card>';
    element = angular.element(markup);
    compile(element)(scope);
    scope.$digest();
    ctrl = element.isolateScope().$ctrl;
  }

  beforeEach(inject(function($injector) {
    compile = $injector.get('$compile');
    Socket = $injector.get('Socket');
    $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    http = $injector.get('$httpBackend');
    http.whenGET('/api/devices').respond([{}]);
//    http.whenGET('app/views/footer.html').respond('');
//    http.flush();

    scope.device = {
      name: 'test',
      id: 'id',
      type: 'type',
      state: {
        on: false
      }
    };

    compileDeviceCard();

  }));

  it('should send socket command when turning on or off a device', function() {
    spyOn(Socket, 'turnOn');
    spyOn(Socket, 'turnOff');

    ctrl.turnOn();
    scope.$digest();
    expect(Socket.turnOn).toHaveBeenCalledWith('id', 'type');

    ctrl.turnOff();
    scope.$digest();
    expect(Socket.turnOff).toHaveBeenCalledWith('id', 'type');
  });

  it('should display button text "turn on" or "turn off" for non-motorized devices', function() {
    expect(ctrl.buttonText()).toEqual('Turn On');
    scope.device.state.on = true;
    compileDeviceCard();
    expect(ctrl.buttonText()).toEqual('Turn Off');
  });

  it('should display button text "bring up" or "bring down" for motorized devices', function() {
    scope.device.state.on = false;
    scope.device.motorized = true;
    compileDeviceCard();
    expect(ctrl.buttonText()).toEqual('Bring Up');

    scope.device.state.on = true;
    scope.device.motorized = true;
    compileDeviceCard();
    expect(ctrl.buttonText()).toEqual('Bring Down');
  });

  it('should display device config when clicking on the device config icon', function() {
    spyOn($rootScope, '$emit');
    ctrl.toggleShowControls();
    expect($rootScope.$emit).toHaveBeenCalledWith('show-device-config', scope.device);
  });

});
