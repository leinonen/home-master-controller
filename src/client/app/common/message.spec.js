'use strict';

describe('message', function() {
  describe('message service', function() {

    var service, $rootScope;

    beforeEach(module('app'));

    beforeEach(inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      service = $injector.get('Message');
    }));

    it('should emit success message', function() {
      spyOn($rootScope, '$emit');
      service.success('hallo');
      expect($rootScope.$emit).toHaveBeenCalledWith('message', {msg: 'hallo', type: 'success'});
    });

    it('should emit info message', function() {
      spyOn($rootScope, '$emit');
      service.info('hallo');
      expect($rootScope.$emit).toHaveBeenCalledWith('message', {msg: 'hallo', type: 'info'});
    });

    it('should emit warning message', function() {
      spyOn($rootScope, '$emit');
      service.warning('hallo');
      expect($rootScope.$emit).toHaveBeenCalledWith('message', {msg: 'hallo', type: 'warning'});
    });
    it('should emit danger message', function() {
      spyOn($rootScope, '$emit');
      service.danger('hallo');
      expect($rootScope.$emit).toHaveBeenCalledWith('message', {msg: 'hallo', type: 'danger'});
    });

  });
});