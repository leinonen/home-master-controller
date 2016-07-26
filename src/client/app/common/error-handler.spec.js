'use strict';

describe('Service: ErrorHandler', function() {

  beforeEach(module('app'));
  beforeEach(module('app/views/header.html'));
  beforeEach(module('app/views/footer.html'));

  var ErrorHandler, $rootScope, Message;

  beforeEach(inject(function($injector) {
    ErrorHandler = $injector.get('ErrorHandler');
    Message = $injector.get('Message');
    $rootScope = $injector.get('$rootScope');
    spyOn(Message, 'danger');
  }));

  it('should handle error messages with data property', function() {
    var error = {
      data: {
        statusCode: 404,
        message: 'Resource not found'
      }
    };
    ErrorHandler.handle(error);
    expect(Message.danger).toHaveBeenCalledWith('404 : Resource not found');
  });

  it('should handle error messages without data property', function() {
    var error = {
      config: {
        method: 'GET',
        url: '/some/cool/url'
      }
    };
    ErrorHandler.handle(error);
    expect(Message.danger).toHaveBeenCalledWith('Unable to GET /some/cool/url');
  });

});
