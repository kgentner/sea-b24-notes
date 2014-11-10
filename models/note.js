'use strict';
var mongoose = require('mongoose');

function validator(val) {
  if (val.length < 5) {
    return false;
  }
}

var noteSchema = mongoose.Schema({
  noteBody: {
    type: String,
    validate: [validator, 'Note must be longer than 4 characters.']
  }
});

module.exports = mongoose.model('Note', noteSchema);
