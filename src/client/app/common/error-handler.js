'use strict';

(function () {

  angular.module('app').service('ErrorHandler', function ($log, Message) {

    this.handle = function (error) {
      var msg;
      if (error.data) {
        msg = error.data.statusCode + ' : ' + error.data.message;
      } else {
        msg = 'Unable to ' + error.config.method + ' ' + error.config.url;
      }
      $log.error(msg);
      Message.danger(msg);
    };

  });

})();
