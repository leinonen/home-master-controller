describe('sensor', function() {
  describe('sensor-list', function() {

    var controller, $rootScope, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function($injector, $controller) {
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      [ 'app/views/header.html',
        'app/views/footer.html',
        'app/login/login.html'
      ].forEach(function(view) {
        $httpBackend.expectGET(view).respond(200, '');
      });
      $httpBackend.when('GET', '/api/hmc/sensors').respond([{id: 'test'}]);

      controller = $controller('SensorListCtrl', {
        $scope: $rootScope.$new()
      });
      $httpBackend.flush();
    }));

    it('should load sensors', function() {
      expect(controller.sensors.length).toBe(1);
    });
  });
});