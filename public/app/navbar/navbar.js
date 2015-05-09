(function () {

  var module = angular.module('navbar', []);

  module.controller('NavbarCtrl', function () {

    var ctrl = this;
    ctrl.title = 'Home Master Controller';

    ctrl.items = [{
      title: 'Devices',
      state: 'root.devices'
    }, {
      title: 'Groups',
      state: 'root.groups'
    }, {
      title: 'Sensors',
      state: 'root.sensors'
    }, {
      title: 'About',
      state: 'root.about'
    }
    ];

  });

  module.directive('navbar', function () {
    return {
      scope: {},
      templateUrl: 'app/navbar/navbar.html',
      replace: true,
      controller: 'NavbarCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
