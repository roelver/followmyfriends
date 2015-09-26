'use strict';

var express = require('express');
var controller = require('./yelp.controller');

var router = express.Router();

router.get('/:place2be', controller.search);

module.exports = router;