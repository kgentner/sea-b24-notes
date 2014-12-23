'use strict';

module.exports = function(app) {
  app.controller('UsersCtrl', [
    '$scope', '$http', '$cookies', '$base64', '$location', 'validationService',
    function($scope, $http, $cookies, $base64, $location, validationService) {

    //if user still has a jwt, then go directly to notes template
    if (!$cookies.jwt) {
      $location.path('/users');
    } else {
      $location.path('/notes');
    }

    $scope.errors = [];
    $scope.signIn = function() {

      $scope.errors = validationService.isValid($scope.user.email, $scope.user.password, $scope.user.password);
      if ($scope.errors.length) return;

      $http.defaults.headers.common['Authorization'] =
        'Basic ' + $base64.encode($scope.user.email + ':' + $scope.user.password);

      $http({
        method: 'GET',
        url: '/api/users'
      })
      .success(function(data) {
        $cookies.jwt = data.jwt;
        $location.path('/notes');
      })
      .error(function(data) {
        $scope.errors.push(data);
      });
    };

    $scope.signUp = function() {

      $scope.errors = validationService.isValid($scope.newUser.email, $scope.newUser.password,
        $scope.newUser.passwordConfirmation);
      if ($scope.errors.length) return;

      $http.defaults.headers.common['Authorization'] =
        'Basic ' + $base64.encode($scope.newUser.email + ':' + $scope.newUser.password);

      $http({
        method: 'POST',
        url: '/api/users',
        data: $scope.newUser
      })
      .success(function(data) {
        $cookies.jwt = data.jwt;
        $location.path('/notes');
      })
      .error(function(data) {
        $scope.errors.push(data);
      });
    };
  }]);
};
