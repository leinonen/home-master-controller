(function () {

  angular.module('app')
    .directive('configurationZwave', function () {
    return {
      scope: {
        zwave: '='
      },
      templateUrl: 'app/configuration-zwave.html',
      controllerAs: 'ctrl',
      bindToController: true,
      controller: function() {

      }
    }
  });

})();
