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

describe('Create User, Get User, & Password Validation', function() {
  var jwtToken;

  it('should not allow unconfirmed passwords',
    function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({
      email: 'test1@example.com',
      password: 'testing123',
      confirmPassword: 'testing129'
    })
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(500);
      done();
    });
  });

  it('should not allow passwords to be the email address',
    function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({
      email: 'test1@example.com',
      password: 'test1@example.com',
      confirmPassword: 'test1@example.com'
    })
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(500);
      done();
    });
  });

  it('should not allow passwords without a letter and number', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({
      email: 'test1@example.com',
      password: '!@#$%^&*',
      confirmPassword: '!@#$%^&*'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(500);
      done();
    });
  });

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

  it('should not allow generic users to enter admin', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/admin')
    .set({'jwt': jwtToken}) //user is generic@example.com
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('access denied');
      done();
    });
  });
});

describe('Admin & Admin Access', function() {
  var jwtToken;

  it('should be able to create a new admin', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({
      email: 'admin@example.com',
      password: 'admin123',
      confirmPassword: 'admin123',
      role: 'admin'
    })
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.include.keys('jwt');
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should allow admins to enter admin area', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/admin')
    .set({'jwt': jwtToken}) //user is admin@example.com
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('welcome to admin');
      done();
    });
  });
});

describe('Notes CRUD', function() {
  var id;
  var jwtToken;
  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({
      email: 'janedoe@example.com',
      password: 'testing123',
      confirmPassword: 'testing123'})
    .end(function(err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should be able to create a note', function(done) {
    chai.request('http://localhost:3000')
    .post('/v1/api/notes')
    .set({jwt: jwtToken})
    .send({noteBody: 'hello world'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      id = (res.body._id);
      expect(res.body.noteBody).to.eql('hello world');
      done();
    });
  });

  it('should be able to get an index', function(done) {
    chai.request('http://localhost:3000')
    .get('/v1/api/notes')
    .set({'jwt': jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });

  it('should be able to get a single note', function(done) {
    chai.request('http://localhost:3000')
    .get('/v1/api/notes/' + id)
    .set({'jwt': jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('hello world');
      done();
    });
  });

  it('should be able to update a note', function(done) {
    chai.request('http://localhost:3000')
    .put('/v1/api/notes/' + id)
    .set({'jwt': jwtToken})
    .send({noteBody: 'new note body'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('new note body');
      done();
    });
  });

  it('should be able to destroy a note', function(done) {
    chai.request('http://localhost:3000')
    .delete('/v1/api/notes/' + id)
    .set({'jwt': jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });
});
