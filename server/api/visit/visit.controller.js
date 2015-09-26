/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /Visits/              ->  create
 * GET     /Visits/:id           ->  show
 * DELETE  /Visits/user/:user_id/:venue_id  ->  destroy
 * DELETE  /visits/cleanup      ->  remove older visits
 */

'use strict';

var _ = require('lodash');
var Visit = require('./visit.model');

var getToday = function() {
  var today = new Date();
  return ''+today.getFullYear()+ 
                  (today.getMonth() < 9 ? '0':'')+(today.getMonth()+1) +
                  (today.getDate()  < 10 ? '0':'')+today.getDate();
};

// Get a single Visit
exports.show = function(req, res) {
  Visit.find({venue_id: req.params.id}, function (err, Visits) {
    if(err) { return handleError(res, err); }
    if(!Visit) { return res.status(404).send('Not Found'); }
    return res.json(Visits);
  });
};

// Creates a new Visit in the DB.
exports.create = function(req, res) {
  Visit.create(req.body, function(err, Visit) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(Visit);
  });
};

// Deletes a Visit before today.
exports.removeVisit = function(req, res) {
  Visit.find({
    venue_id: req.params.venue_id, 
    user_id: req.params.user_id
  }).remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('Delete was successful');
    });
};

// Deletes a Visit before today.
exports.cleanup = function(req, res) {
  Visit.find({date: {$lt: getToday()} }).remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('Cleanup was successful');
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
};
