'use strict';

(function () {

  angular.module('app')
    .component('itemSelector', {
      bindings: {
        items: '='
      },
      templateUrl: 'app/common/item-selector.html',
      controller: function () {
        var ctrl = this;


        ctrl.toggleItem = function(item) {

          item.selected = !item.selected;

        };

      }
  });

})();
