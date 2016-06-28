(function () {

  angular.module('app')
    .component('itemSelector', {
      bindings: {
        items: '='
      },
      templateUrl: 'app/common/item-selector.html',
      controller: function ($rootScope) {
        var ctrl = this;
        console.log(ctrl.items);
        ctrl.selectedItem = {};
        ctrl.addItem = function (item) {
          $rootScope.$emit('item.selected', (typeof item === 'string') ? JSON.parse(item) : item);
          ctrl.selectedItem = {};
        };
      }
  });

})();
