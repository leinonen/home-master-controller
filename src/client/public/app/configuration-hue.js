(function () {

  angular.module('app')
    .directive('configurationHue', function () {
      return {
        scope: {
          hue: '='
        },
        templateUrl: 'app/configuration-hue.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function() {

        }
      }
    });

})();
