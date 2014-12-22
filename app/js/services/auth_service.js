'use strict';

module.exports = function(app) {
  app.factory('authService', ['$http', '$cookies', '$location', function($http, $cookies, $location) {

    return {
      isAuthenticated: function() {
        if (!$cookies.jwt) {
          return $location.path('/users');
        }
        return ($http.defaults.headers.common['jwt'] = $cookies.jwt);
      },
      logOut: function() {
        delete $cookies.jwt;
        $http.defaults.headers.common['jwt'] = null;
        return $location.path('/users');
      }

    };
  }]);
};
