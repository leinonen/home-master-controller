'use strict';

(function() {

  angular.module('app')
    .directive('configurationZwave', function() {
    return {
      scope: {
        zwave: '='
      },
      templateUrl: 'app/configuration/configuration-zwave.html',
      controllerAs: 'ctrl',
      bindToController: true,
      controller: function() {

      }
    };
  });

})();
