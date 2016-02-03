describe('scheduler', function() {

  describe('weekdays service', function() {

    var service, $rootScope, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      //$httpBackend = $injector.get('$httpBackend');
      service = $injector.get('Weekdays');
      /*['app/views/header.html',
        'app/views/footer.html',
        'app/user/login.html'
      ].forEach(function(view) {
          $httpBackend.expectGET(view).respond(200, '');
        }); */
    }));

    afterEach(function() {
      //$httpBackend.flush();
    });

    function respondGet(url, data) {
//      $httpBackend.when('GET', url).respond(data);
    }

    it('should get workdays', function() {
      var days = service.getWorkdays();
      expect(days.mon).toBe(true);
      expect(days.tue).toBe(true);
      expect(days.wed).toBe(true);
      expect(days.thu).toBe(true);
      expect(days.fri).toBe(true);
      expect(days.sat).toBe(false);
      expect(days.sun).toBe(false);
    });

    it('should get weekend days', function() {
      var days = service.getWeekend();
      expect(days.mon).toBe(false);
      expect(days.tue).toBe(false);
      expect(days.wed).toBe(false);
      expect(days.thu).toBe(false);
      expect(days.fri).toBe(false);
      expect(days.sat).toBe(true);
      expect(days.sun).toBe(true);
    });

    it('should get weekend days', function() {
      var days = service.getFullWeek();
      expect(days.mon).toBe(true);
      expect(days.tue).toBe(true);
      expect(days.wed).toBe(true);
      expect(days.thu).toBe(true);
      expect(days.fri).toBe(true);
      expect(days.sat).toBe(true);
      expect(days.sun).toBe(true);
    });

  });
});