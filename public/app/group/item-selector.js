(function () {

  var module = angular.module('group');

  module.controller('SelectItemCtrl', function ($rootScope, $scope) {
    var ctrl = this;
    ctrl.items = $scope.items;
    ctrl.selectedItem = {};
    ctrl.addItem = function (item) {
      $rootScope.$emit('item.selected', (typeof item === 'string') ? JSON.parse(item) : item);
      ctrl.selectedItem = {};
    };
  });

  module.directive('itemSelector', function () {
    return {
      replace: true,
      scope: {
        items: '='
      },
      templateUrl: 'app/group/item-selector.html',
      controller: 'SelectItemCtrl',
      controllerAs: 'ctrl',
      link: function ($scope, element, attrs, ctrl) {
        $scope.$watch('items', function () {
          ctrl.items = $scope.items;
        });
      }
    };
  });

})();