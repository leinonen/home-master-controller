'use strict';

describe('Component: sexy-selector', function() {

  beforeEach(module('app'));
  beforeEach(module('app/views/header.html'));
  beforeEach(module('app/views/footer.html'));

  beforeEach(module('app/common/sexy-selector.html'));

  var ctrl, element, scope, $rootScope, compile; //, http;

  beforeEach(inject(function($injector) {
    compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    //    http = $injector.get('$httpBackend');
    //    http.whenGET('app/views/header.html').respond('');
    //    http.whenGET('app/views/footer.html').respond('');
    //    http.flush();

    scope.items = [{name: 'test', value: 123}];
    scope.model = {};

    var markup = '<sexy-selector items="items" model="model"></sexy-selector>';
    element = angular.element(markup);
    compile(element)(scope);
    scope.$digest();
    ctrl = element.isolateScope().$ctrl;
  }));

  it('should select an item from given items', function() {
    expect(scope.model).toEqual({});

    ctrl.selectItem(scope.items[0]);
    scope.$digest();
    expect(scope.model).toEqual(scope.items[0].value);
  });

});
