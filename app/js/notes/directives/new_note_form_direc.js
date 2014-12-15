'use strict';

module.exports = function(app) {
  app.directive('newNoteDirec', function() {
    return {
      restrict: 'EAC',
      templateUrl: 'templates/notes/directives/new_note_form.html',
      scope: {save: '&',
              fieldname: '=',
              resourcename: '@'},
      controller: function($scope) {
        $scope.saveResource = function() {
          $scope.save({resource: $scope.resource});
          $scope.resource = null;
        };
      }
    };
  });
};
