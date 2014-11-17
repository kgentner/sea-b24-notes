'use strict';

module.exports = function(app) {
  var jwtauth = require('../lib/jwt_auth')(app.get('jwtSecret'));
  var isAdmin = require('../lib/isAdmin');

  app.get('/api/admin', jwtauth, isAdmin, function(req, res) {
    res.send('welcome to admin');
  });
};
