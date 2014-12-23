'use strict';

require('../../app/js/client');
require('angular-mocks');

describe('UsersController', function() {
  var $controllerConstructor;
  var $httpBackend;
  var $scope;
  var $cookies = {jwt: 'super_duper_secret_hash'};

  beforeEach(angular.mock.module('notesApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  it('should be able to create a controller', function() {
    var usersController = $controllerConstructor('UsersCtrl', {$scope: $scope});
    expect(typeof usersController).toBe('object');
  });

  describe('rest request', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $controllerConstructor('UsersCtrl', {$scope: $scope, $cookies: $cookies});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should log in an existing user', function() {
      $httpBackend.expectGET('/api/users').respond(200, $cookies);

      $scope.user = {email: 'test@example.com', password: 'testing123'};
      $scope.signIn();

      $httpBackend.flush();

      expect($cookies.jwt).toBe('super_duper_secret_hash');
    });

    it('should create a new user', function() {
      $httpBackend.expectPOST('/api/users').respond(200, $cookies);

      $scope.newUser = {email: 'tubby@example.com', password: 'testing123', passwordConfirmation: 'testing123'};
      $scope.signUp();

      $httpBackend.flush();

      expect($cookies.jwt).toBe('super_duper_secret_hash');
    });

  });
});
