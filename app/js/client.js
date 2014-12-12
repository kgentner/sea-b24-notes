'use strict';

require('angular/angular');
require('angular-route');

var notesApp = angular.module('notesApp', ['ngRoute']);

//services
require('./services/resource_backend_service')(notesApp);

//controllers
require('./notes/controllers/notes_controller')(notesApp);

notesApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/notes', {
    templateUrl: 'templates/notes/notes_template.html',
    controller: 'notesCtrl'
  })
  .otherwise({
    redirectTo: '/notes'
  });
}]);
