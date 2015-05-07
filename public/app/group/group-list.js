(function () {

  var module = angular.module('group', ['hmc']);

  module.controller('GroupListCtrl', function (MasterApi) {
    var ctrl = this;
    this.groups = [];
    MasterApi.getGroups().then(function (groups) {
      ctrl.groups = groups;
    });
  });

  module.directive('groupList', function () {
    return {
      scope: {},
      templateUrl: 'app/group/group-list.html',
      replace: true,
      controller: 'GroupListCtrl',
      controllerAs: 'ctrl'
    };
  });

})();
