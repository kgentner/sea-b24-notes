'use strict';

module.exports = function(app) {
  app.factory('authService', ['$http', '$cookies', '$location', function($http, $cookies, $location) {

    return {
      isAuthenticated: function() {
        if (!$cookies.jwt || $cookies.jwt.length === 0) return $location.path('/users');
        $http.defaults.headers.common['jwt'] = $cookies.jwt;
      },
      logOut: function() {
        $cookies.jwt = null;
        return $location.path('/users');
      }
    };
  }]);
};
