  'use strict';

require('../../app/js/client');
require('angular-mocks');

describe('UsersController', function() {
  var $controllerConstructor;
  var $httpBackend;
  var $scope;
  var $cookies;

  beforeEach(angular.mock.module('notesApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  it('should be able to create a controller', function() {
    var usersController = $controllerConstructor('UsersCtrl', {$scope: $scope}, {$cookies: $cookies});
    expect(typeof usersController).toBe('object');
  });

  describe('rest request', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $controllerConstructor('UsersCtrl', {$scope: $scope}, {$cookies: $cookies});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    // it('make an call to index', function() {
    //   $httpBackend.expectGET('/api/users').respond(200, [{'noteBody': 'test note', '_id': '1'}]);

    //   $scope.index();
    //   $httpBackend.flush();

    //   expect($scope.notes).toBeDefined();
    //   expect(Array.isArray($scope.notes)).toBeTruthy();
    //   expect(typeof $scope.notes[0]).toBe('object');
    //   expect($scope.notes[0].noteBody).toBe('test note');
    // });

    it('should log in an existing user', function() {
      $httpBackend.expectGET('/api/users').respond(200, {'jwt': 'super duper secret hash'});

      $scope.user = {'email': 'test@example.com', 'password': 'testing123'};
      $scope.signIn();

      $httpBackend.flush();

      //expect($cookies.jwt).toBeDefined();
      //expect(typeof $cookies.jwt).toBe('object');
      expect($cookies.jwt).toBe('super duper secret hash');
      //expect($scope.user).toBe(null);
    });

    // it('should create a new user', function() {
    //   $httpBackend.expectPOST('/api/notes').respond(200, {'jwt': 'super duper secret hash'});
    //   $scope.notes = [];
    //   $scope.newNote = {'noteBody': 'test note'};
    //   $scope.saveNewNote();

    //   $httpBackend.flush();

    //   expect($scope.notes.length).toBe(1);
    //   expect($scope.notes[0].noteBody).toBe('test note');
    //   expect($scope.newNote).toBe(null);
    // });

  });
});
