'use strict';

module.exports = function(app) {
  app.controller('notesCtrl', ['$scope', '$http', '$location', '$cookies', 'ResourceBackend', 'authService',
    function($scope, $http, $location, $cookies, ResourceBackend, authService) {

    var notesBackend = new ResourceBackend('notes');

    //log out of the notes application & return to log in
    $scope.logOut = function() {
      authService.logOut();
    };

    //get all notes
    $scope.index = function() {
      authService.isAuthenticated();
      notesBackend.index()
      .success(function(data) {
        $scope.notes = data;
      })
      .error(function() {
        $location.path('/users');
      });
    };

    //save a new note
    $scope.saveNewNote = function(newNote) {
      if (newNote === undefined || newNote === null) {
        return $location.path('/notes');
      } else {
        authService.isAuthenticated();
        notesBackend.saveNew(newNote)
        .success(function(data) {
          $scope.notes.push(data);
          $scope.newNote = null;
        });
      }
    };

    //save a modified note
    $scope.saveNote = function(note) {
      authService.isAuthenticated();
      notesBackend.save(note)
      .success(function() {
        note.editing = false;
      });
    };

    //delete a note
    $scope.deleteNote = function(note) {
      authService.isAuthenticated();
      notesBackend.delete(note)
      .success(function() {
        $scope.notes.splice($scope.notes.indexOf(note), 1);
      });
    };
  }]);
};
