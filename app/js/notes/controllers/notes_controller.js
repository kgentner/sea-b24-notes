'use strict';

module.exports = function(app) {
  app.controller('notesCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.index = function() {
      $http({
        method: 'GET',
        url: '/api/notes'
      })
      .success(function(data) {
        $scope.notes = data;
      })
      .error(function(data, status) {
        console.log(data);
      });
    };
//
    $scope.saveNewNote = function() {
      $http({
        method: 'POST',
        url: '/api/notes',
        data: $scope.newNote
      })
      .success(function(data) {
        $scope.notes.push(data);
        $scope.newNote = null;
      })
      .error(function(data) {
        console.log(data);
      });
    };

    $scope.saveNote = function(note) {
      $http({
        method: 'PUT',
        url: '/api/notes/' + note._id,
        data: note
      })
      .success(function() {
        note.editing = false; 
      })
      .error(function(data) {
        console.log(data);
      });
    };

    $scope.deleteNote = function(note) {
      $http({
        method: 'DELETE',
        url: '/api/notes/' + note._id
      }) 
      .success(function() {
        $scope.notes.splice($scope.notes.indexOf(note), 1);
      })
      .error(function(data) {
        console.log(data);
      });
    };
  }]);
};
