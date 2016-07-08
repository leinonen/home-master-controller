(function () {

  angular.module('app')
    .component('sexyCheckbox', {
      bindings: {
        text: '@',
        checked: '='
      },
      templateUrl: 'app/common/sexyCheckbox.html',
      controller: function () {
        var ctrl = this;
        ctrl.toggle = function() {
          ctrl.checked = !ctrl.checked;
        };
      }
    });

})();
