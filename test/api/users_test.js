'use strict';

process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var User = require('../../models/user');
var Note = require('../../models/note');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

//Clear pre-existing users and notes collections from notes_test db
User.collection.remove(function(err) {if (err) throw err;});
Note.collection.remove(function(err) {if (err) throw err;});

describe('Create User & Get User', function() {
  var jwtToken;

  it('should be able to create a new user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({
      email: 'test1@example.com',
      password: 'testing123',
      confirmPassword: 'testing123',
      role: 'generic'
    })
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.include.keys('jwt');
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should be able to login as existing user', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/users')
    .auth('test1@example.com', 'testing123')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.include.keys('jwt');
      done();
    });
  });
});
