'use strict';
var mongoose = require('mongoose');
var noteSchema = mongoose.Schema;

function validator(val) {
  if (val.length < 5) {
    return false;
  }
}
var noteValidator = [validator, 'Uh Oh! Validation Failed!'];
var noteSchema = mongoose.Schema({
  noteBody: {type: String, validate: noteValidator}
});

module.exports = mongoose.model('Note', noteSchema);
