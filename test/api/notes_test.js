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
    .post('/api/notes')
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
    .get('/api/notes')
    .set({'jwt': jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });

  it('should be able to get a single note', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/notes/' + id)
    .set({'jwt': jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('hello world');
      done();
    });
  });

  it('should be able to update a note', function(done) {
    chai.request('http://localhost:3000')
    .put('/api/notes/' + id)
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
    .delete('/api/notes/' + id)
    .set({'jwt': jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });
});
