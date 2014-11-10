'use strict';
var mongoose = require('mongoose');
var noteSchema = mongoose.Schema;

function validator(val) {
  return val === 'hello world';
}
var noteValidator = [validator, 'Uh Oh! Validation Failed!'];
var noteSchema = mongoose.Schema({
  noteBody: {type: String, validate: noteValidator}
});

module.exports = mongoose.model('Note', noteSchema);
