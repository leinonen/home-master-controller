(function () {

  angular.module('app')
    .directive('configurationTelldus', function () {
      return {
        scope: {
          telldus: '='
        },
        templateUrl: 'app/configuration/configuration-telldus.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function() {

        }
      }
    });

})();
