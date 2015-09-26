'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VisitSchema = new Schema({
  venue_id: String,
  user_id: String,
  date: String
});

module.exports = mongoose.model('Visit', VisitSchema);