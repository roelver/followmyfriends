'use strict';

var express = require('express');
var controller = require('./visit.controller');

var router = express.Router();

router.get('/:id', controller.show);
router.post('/', controller.create);
router.delete('/user/:user_id/:venue_id', controller.removeVisit);
router.delete('/cleanup', controller.cleanup);

module.exports = router;