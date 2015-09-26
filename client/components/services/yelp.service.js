// Consumer Key:  i8R3oETYrkJ6rXK_5GQ_Pg
// Consumer Secret: dadX5kv9xJNqzJGiE5fxEMbw1pc
// Token: urNUPbe_B-naayHYYZmTPDjFuh6U-qT1
// Token Secret:  55VHyI6PRL_YlwfMri8mLpFZtlo

angular.module('followmyfriendsApp')

.service('yelpService', function($http) {
  var city;

  var setCity = function(searchCity) {
      city = searchCity;
  };

  var getCity = function() {
      return city;
  };

  var search = function(callback){

     $http({method: 'GET', url: '/api/yelp/'+city})
     .then(function(response){
         callback(response.data);
     }), function(response) {
        console.log('Request failed: '+response.status+': '+response.data);
     };
  };

  return {
    getCity:    getCity,
    setCity:    setCity,
    search:     search
  };

});
