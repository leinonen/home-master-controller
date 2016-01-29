(function () {

  angular.module('app').service('Message', function ($rootScope) {

    function emit(msg, type) {
      $rootScope.$emit('message', {msg: msg, type: type});
    }

    this.success = function (msg) {
      emit(msg, 'success');
    };

    this.info = function (msg) {
      emit(msg, 'info');
    };

    this.warning = function (msg) {
      emit(msg, 'warning');
    };

    this.danger = function (msg) {
      emit(msg, 'danger');
    };

  });

  angular.module('app').controller('MessageCtrl', function ($scope, $rootScope, $timeout) {

    $scope.msg = {msg: '', type: 'info'};
    $scope.showMessage = false;

    $rootScope.$on('message', function (evt, data) {
      $scope.msg = data;
      $scope.showMessage = true;
      // hide after 5 sec.
      $timeout(function () {
        $scope.showMessage = false;
        $scope.$apply(); // update gui
      }, 5000);
    });

  });

  angular.module('app').directive('message', function () {
    return {
      scope: {},
      restrict: 'E',
      replace: 'true',
      template: '<div ng-show="showMessage" class="alert alert-{{msg.type}} core-message">{{msg.msg}}</div>',
      controller: 'MessageCtrl',
      controllerAs: 'ctrl'
    };
  });
})();
