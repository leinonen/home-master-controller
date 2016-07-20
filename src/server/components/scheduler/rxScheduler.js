'use strict';

const
  Rx = require('rx'),
  bus = require('../../util/bus'),
  HMC = require('../../lib/hmc'),
  Events = require('./../../lib/events'),
  moment = require('moment'),
  SchedulerModel = require('./schedule.model'),
  SchedulerHelper = require('./SchedulerHelper'),
  dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function Scheduler() {

  let scheduleList = [];

  return {
    start: () => {
      Rx.Observable
        .interval(1000)
        .subscribe(() => {
          scheduleList.forEach(schedule => {
            let currentTime = moment(new Date()).millisecond(0);
            if (SchedulerHelper.isScheduleTime(currentTime, schedule)) {
              bus.emit(Events.SCHEDULE_TRIGGER, {
                schedule: schedule,
                scheduleTime: currentTime,
                currentDay: dayMap[currentTime.day()]
              });
            }
          });
        });

      Rx.Observable
        .fromEvent(bus, Events.SCHEDULE_TRIGGER)
        .tap(x => console.log('Trigger schedule'))
        .subscribe(msg => {
          msg.schedule.weekdays
            .filter(wd => wd === msg.currentDay)
            .map(() => msg.schedule.items)
            .forEach(wd => msg.schedule.items.forEach(
              item => bus.emit(Events.CONTROL_DEVICE, {
                id: item.id,
                action: msg.schedule.action,
                type: item.type
              })
            ));
        });

      Rx.Observable
        .fromEvent(bus, Events.UPDATE_SCHEDULER)
        .flatMapLatest(x => Rx.Observable.fromPromise(SchedulerModel.findAll()))
        .tap(x => console.log('Update scheduler'))
        .subscribe(schedules => scheduleList = schedules);

      Rx.Observable
        .fromEvent(bus, Events.CONTROL_DEVICE)
        .tap(x => console.log('Control device'))
        .subscribe(device =>
          HMC.control(device.id, {action: device.action, type: device.type}, 'scheduler')
        );

      bus.emit(Events.UPDATE_SCHEDULER);
    }
  };
}

module.exports = function() {
  return new Scheduler();
};


