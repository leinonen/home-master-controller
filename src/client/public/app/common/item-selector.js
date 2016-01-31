(function () {

  angular.module('app').directive('itemSelector', function () {
    return {
      replace: true,
      scope: {
        items: '='
      },
      templateUrl: 'app/common/item-selector.html',
      controllerAs: 'ctrl',
      bindToController: true,
      controller: function ($rootScope) {
        var ctrl = this;
        ctrl.selectedItem = {};
        ctrl.addItem = function (item) {
          $rootScope.$emit('item.selected', (typeof item === 'string') ? JSON.parse(item) : item);
          ctrl.selectedItem = {};
        };
      }
    };
  });

})();
