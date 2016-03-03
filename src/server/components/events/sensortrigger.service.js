'use strict';

module.exports = function SensorTrigger() {

  let _timerHandle = null;
  let _triggers = [];

  let start = () => {
    _timerHandle = setInterval(() => {
      _triggers.forEach(trigger => {
        executeTrigger(trigger);
      });
    }, 1000);
  };

  let stop = () => {
    clearInterval(_timerHandle);
  };

  let updateTriggers = () => {

  };

  let executeTrigger = (trigger) => {

  };

  return {
    start: start,
    stop: stop
  };
};
