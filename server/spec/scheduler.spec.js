describe('Scheduler', function() {

  var Scheduler = require('../api/hmc/scheduler/scheduler');
  var Bus = require('../util/bus');
  var Promise = require('../util/promise');
  var mockSchedules = require('../testdata/schedules.json');
  var mock = {
    findAll: () => Promise.resolve(mockSchedules)
  };
  var scheduler = null;

  beforeEach(function() {
    scheduler = new Scheduler(mock);
  });

  afterEach(function() {
    scheduler.stop();
  });


  it('should fetch schedules on start', function(callback) {
    expect(scheduler.getSchedules().length).toBe(0);
    scheduler.start();
    setTimeout(function() {
      expect(scheduler.getSchedules().length).toBe(1);
      callback();
    }, 10);
  });

  it('should execute runSchedule 5 times in 5 seconds', function(callback) {
    scheduler.start();
    spyOn(scheduler, 'runSchedule');
    var numCycles = 5;
    setTimeout(function() {
      expect(scheduler.runSchedule.calls.count()).toEqual(numCycles);
      callback();
    }, numCycles * 1000);
  });

  it('should be able to get schedules from database', function(callback) {
    scheduler.fetchSchedules().then( function(schedules){
      expect(schedules.length).toBe(1);
      callback();
    });
  });

  it('should trigger ScheduleTrigger when a schedule is scheduled to run', function(callback) {
    spyOn(Bus, 'emit');
    var schedule = mockSchedules[0];
    var now = new Date('2015-01-01 ' + schedule.time);
    scheduler.runSchedule(now, schedule);
    expect(Bus.emit).toHaveBeenCalledWith('ScheduleTrigger', {
      schedule: schedule,
      scheduleTime : '20:04:00',
      currentDay : 'thu',
      currentTime : '20:04:00'
    });
    callback();
  });

});