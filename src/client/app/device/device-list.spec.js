'use strict';

describe('Component: device-list', function() {

  beforeEach(module('app'));
  beforeEach(module('app/views/header.html'));
  beforeEach(module('app/views/footer.html'));

  beforeEach(module('app/device/device-config.html'));
  beforeEach(module('app/device/device-card.html'));
  beforeEach(module('app/device/device-list.html'));

  var ctrl, element, scope, $rootScope, compile, Devices, http;

  function compileDeviceList() {
    element = angular.element('<device-list></device-list>');
    compile(element)(scope);
    scope.$digest();
    ctrl = element.isolateScope().$ctrl;
  }

  beforeEach(inject(function($injector) {
    compile = $injector.get('$compile');
    Devices = $injector.get('Devices');
    $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    http = $injector.get('$httpBackend');
    http.whenGET('/api/devices').respond([{}]);

    spyOn(Devices, 'getModel').and.returnValue({
      devices: [{},{}]
    });

    compileDeviceList();

  }));

  it('should obtain devices from Devices service', function() {
    var devices = ctrl.getDevices();
    expect(devices.length).toEqual(2);
    expect(ctrl.showDevices()).toEqual(true);
  });

});
