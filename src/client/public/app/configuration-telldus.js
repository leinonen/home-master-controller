(function () {

  angular.module('app')
    .directive('configurationTelldus', function () {
      return {
        scope: {
          telldus: '='
        },
        templateUrl: 'app/configuration-telldus.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function() {

        }
      }
    });

})();
