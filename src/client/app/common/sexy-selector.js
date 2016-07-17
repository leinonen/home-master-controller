'use strict';

(function () {

  angular.module('app')
    .component('sexySelector', {
      bindings: {
        items: '=',
        model: '='
      },
      templateUrl: 'app/common/sexy-selector.html',
      controller: function () {
        var ctrl = this;

        //ctrl.selectedItem = {};

        ctrl.toggleItem = function(item) {
          //item.selected = !item.selected;
          ctrl.model = item.value;
        };

      }
  });

})();
