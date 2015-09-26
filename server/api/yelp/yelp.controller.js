/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var oauthSignature = require('oauth-signature');
var http = require('http');

var randomString = function(length) {
     var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
     var result = '';
     for (var i = length; i > 0; --i) result += str[Math.round(Math.random() * (str.length - 1))];
     return result;
};

// Call the Yelp API
exports.search = function(req, res) {

     var method = 'GET';
     var url = 'http://api.yelp.com/v2/search';
     var params = {
         location: req.params.place2be,
         term: "nightlife",
         oauth_consumer_key: 'i8R3oETYrkJ6rXK_5GQ_Pg', //Consumer Key
         oauth_token: 'urNUPbe_B-naayHYYZmTPDjFuh6U-qT1', //Token
         oauth_signature_method: "HMAC-SHA1",
         oauth_timestamp: new Date().getTime(),
         oauth_nonce: randomString(32)
     };
     var consumerSecret = 'dadX5kv9xJNqzJGiE5fxEMbw1pc'; //Consumer Secret
     var tokenSecret = '55VHyI6PRL_YlwfMri8mLpFZtlo'; //Token Secret
     var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
     var rqUrl = url+'?location='+params.location+
                  '&term='+params.term+
                  '&oauth_consumer_key='+params.oauth_consumer_key+
                  '&oauth_token='+params.oauth_token+
                  '&oauth_timestamp='+params.oauth_timestamp+
                  '&oauth_nonce='+ params.oauth_nonce +
                  '&oauth_signature_method='+ params.oauth_signature_method +
                  '&oauth_signature='+signature;
     http.get(rqUrl, function(data){

        var yelpResponse='';

        data.on("data", function(chunk) {
          yelpResponse += chunk;
        });

        data.on("end", function() {
          res.writeHead(200, {"Content-Type": "application/json"});
          return res.end(yelpResponse);
        });

     }).on('error', function(e) {
         console.log("Got error: " + e.message);
     });

};
