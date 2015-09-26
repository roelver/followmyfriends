'use strict';

angular.module('followmyfriendsApp')
  .controller('MainCtrl', ['$scope', '$http', 'yelpService', '$cookieStore', 
    function ($scope, $http, yelpService, $cookieStore) {

      $scope.place2be = $cookieStore.get('searchcity');
      $scope.default_img = '/assets/images/default_pub.jpg';

      // Cleanup  database
      $http({method: 'DELETE', url: '/api/visits/cleanup'})
        .then(function(response){
           console.log('Cleanup of old data was successful');
         }), function(response) {
          console.log('Cleanup failed: '+response.status+': '+response.data);
      };

      $scope.search = function() {
        var tmp = $scope.place2be;
        $scope.place2be = '.';
        $scope.place2be = tmp;
        yelpService.setCity($scope.place2be);
      };
 
      if ($scope.place2be && $scope.place2be.length  > 0 ) {
        yelpService.setCity($scope.place2be);
      };

    }])

    .controller('ResultsCtrl', ['$scope', '$rootScope', '$http','yelpService','twitterService', '$cookieStore',
      function ($scope, $rootScope, $http, yelpService, twitterService, $cookieStore) {

      $scope.results = [];

      $scope.$watch(function() { return yelpService.getCity(); }, 
           function (newValue, oldValue) {
              if (newValue != null) {
                $scope.results = [];
                $scope.setCookie(yelpService.getCity());
                yelpService.search($scope.showResults);
         }
       }, true);

      $scope.showResults = function(data, status, headers, config) {
        $('footer').removeClass('results');
        $scope.results = data.businesses;
        $rootScope.userId  = twitterService.getUserName();
        if ($scope.results) {
          $scope.resultCount = $scope.results.length;
          for (var i=0; i < $scope.results.length; i++) {
              $scope.getVisits(i, $scope.results[i]);
          }
          $('footer').addClass('results');
        }
        else {
          if (data.error) {
            alert('Error connecting to Yelp: '+data.error.text);
          }
          else {
            alert('Error retrieving venues');
          }
        } 
      };

      $scope.getToday = function() {
        var today = new Date();
        return ''+today.getFullYear()+ 
                  (today.getMonth() < 9 ? '0':'')+(today.getMonth()+1) +
                  (today.getDate()  < 10 ? '0':'')+today.getDate();
      };

      $scope.goingPressed = function(idx) {
          if (!twitterService.loggedIn()) {
              $scope.idxPressed = idx;
              twitterService.connectTwitter().then(function() {
                  $rootScope.userName = twitterService.getFullName();
                  $rootScope.userId   = twitterService.getUserName();
                  //if the authorization is successful, update meGoing for all venues
                  $scope.resultCount = $scope.results.length;
                  $scope.updateResults();
              });
          }
          else {
              $scope.setGoing(idx);
          }
      };

     $scope.updateFinished = function() {
        $scope.resultCount--;
       if ($scope.resultCount > 0) return;
       // Only updates counts if all results were updated
       if ($scope.idxPressed >= 0) {
           $scope.setGoing($scope.idxPressed);
           $rootScope.$$phase || $rootScope.$apply();
       }
     };

     $scope.updateResults = function() {
        for (var i=0; i < $scope.results.length; i++) {
            $scope.getVisits(i, $scope.results[i]);
        }
     };

      $scope.getVisits = function(idx, result) {
          result.going = 0;
          $http.get('/api/visits/'+result.id )
             .then(function(response) {
                result.going = response.data.length || 0;
                result.meGoing = false;
                if ($rootScope.userId != "") {
                  for (var i=0; i< response.data.length; i++) {
                    if (response.data[i].user_id === $rootScope.userId) {
                       result.meGoing = true;
                       break;
                    }
                  }
                }
                $scope.results[idx] = result;
                $scope.updateFinished();
             }), function(response) {
                console.log('Error on visit '+result.id);
                $scope.updateFinished();
             };
      };

      $scope.setCookie = function(city) {
        $cookieStore.put('searchcity', city);
      };

      $scope.setGoing = function(idx) {
          if ($scope.results[idx].meGoing) {
            $scope.results[idx].going--;
            $scope.removeMe($scope.results[idx]);
          }
          else {
            $scope.results[idx].going++;          
            $scope.addMe($scope.results[idx]);
          }
          $scope.results[idx].meGoing = !$scope.results[idx].meGoing;
      };

      $scope.removeMe = function(visit) {
          $http.delete('/api/visits/user/'+twitterService.getUserName()+'/'+visit.id )
             .then(function(response) {
                console.log('Deleted visit ', response);
             }), function(response) {
                console.log('Error on deleting a visit ', response);
             };
      };

      $scope.addMe = function(visit) {
          $http.post('/api/visits/', {
               venue_id : visit.id,
                user_id : twitterService.getUserName(),
                date: $scope.getToday()
              } )
             .then(function(response) {
                console.log('Added visit ', response);
             }), function(response) {
                console.log('Error on adding a visit ', response);
             };
      };

}]);


