/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Visit = require('../api/visit/visit.model');

Visit.find({}).remove(function() {
  Visit.create({
    venue_id : 'x',
    user_id : 'y',
    date: '20150922'
  },{
    venue_id : 'x',
    user_id : 'y',
    date: '20150921'
  });
});

