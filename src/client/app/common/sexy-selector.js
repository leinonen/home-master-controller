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

        ctrl.selectItem = function(item) {
          ctrl.model = item.value;
        };

      }
  });

})();
