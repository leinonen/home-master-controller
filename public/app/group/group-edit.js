(function () {

  var module = angular.module('group');

  module.controller('EditGroupCtrl', function ($stateParams, MasterApi, Message) {
    var ctrl = this;
    ctrl.group = {};

    MasterApi.getGroup($stateParams.id, $stateParams.type).then(function (group) {
      ctrl.group = group;
    }).catch(function (err) {
      Message.danger(err.data.message);
    });
  });

  module.directive('groupEdit', function () {
    return {
      scope: {},
      templateUrl: 'app/group/group-edit.html',
      controller: 'EditGroupCtrl',
      controllerAs: 'ctrl'
    }
  });


})();
