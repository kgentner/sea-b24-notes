'use strict';

var isAdmin = function(req, res, next) {
  if (req.decodedjwt.role !== 'admin') {
    return res.status(403).send('access denied');
  }
  next();
};

module.exports = isAdmin;
