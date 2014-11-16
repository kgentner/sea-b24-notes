'use strict';

var User = require('../models/user');

module.exports = function(app, passport) {
  app
  .get(
    '/api/users',
    passport.authenticate('basic', {session: false}),
    function(req, res) {
      res.json({'jwt': req.user.generateToken(app.get('jwtSecret'))});
    });

  app.post('/api/users', function(req, res) {
    User.findOne({'basic.email': req.body.email}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (user) return res.status(500).send('cannot create that user');
      if (req.body.password === req.body.email) {
        return res.status(500).send('invalid password');
      }
      //password pattern: any 8-12 character length combo of ASCII
      //with at least one number and one letter
      var passwordPattern = /^(?=.*\d+)(?=.*[a-z A-Z])[ -~]{8,12}$/;
      if (!passwordPattern.test(req.body.password)) {
        return res.status(500).send('invalid password');
      }
      var newUser = new User();
      newUser.basic.email = req.body.email;
      newUser.basic.password = newUser.generateHash(req.body.password);
      newUser.save(function(err, data) {
        if (err) return res.status(500).send('server error');
        res.json({'jwt': newUser.generateToken(app.get('jwtSecret'))});
      });
    });
  });
};
