describe('scheduler', function() {
  describe('scheduler service', function() {

    var service, $rootScope, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      service = $injector.get('SchedulerService');
      ['app/views/header.html',
        'app/views/footer.html',
        'app/login/login.html'
      ].forEach(function(view) {
          $httpBackend.expectGET(view).respond(200, '');
        });
    }));

    afterEach(function() {
      $httpBackend.flush();
    });

    function respondGet(url, data) {
      $httpBackend.when('GET', url).respond(data);
    }

    it('should get schedules', function() {
      respondGet('/api/scheduler/schedules', [
        {id: 'test1'}, {id: 'test2'}
      ]);
      service.getSchedules().then(function(schedules) {
        expect(schedules.length).toBe(2);
      });
    });

    it('should get a single schedule', function() {
      respondGet('/api/scheduler/schedules/123', [
        {id: 'test1'}, {id: 'test2'}
      ]);
      service.getSchedule(123).then(function(schedules) {
        expect(schedules.length).toBe(2);
      });
    });

    it('should get sunset and sunrise time', function() {
      respondGet('/api/scheduler/sun', {
        sunset: 'bla', sunrise: 'blaha'
      });
      service.getSun().then(function(time) {
        expect(time.sunset).toBe('bla');
        expect(time.sunrise).toBe('blaha');
      });
    });
  });

  describe('weekdays service', function() {

    var service, $rootScope, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
      service = $injector.get('Weekdays');
      ['app/views/header.html',
        'app/views/footer.html',
        'app/login/login.html'
      ].forEach(function(view) {
          $httpBackend.expectGET(view).respond(200, '');
        });
    }));

    afterEach(function() {
      $httpBackend.flush();
    });

    function respondGet(url, data) {
      $httpBackend.when('GET', url).respond(data);
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