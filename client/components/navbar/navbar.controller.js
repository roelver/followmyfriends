'use strict';

angular.module('followmyfriendsApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, twitterService) {

    $scope.isCollapsed = true;
    $rootScope.userName ='';
    $rootScope.userId ='';
    twitterService.initialize();

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    //when the user clicks the connect twitter button, the popup authorization window opens
    $scope.connectButton = function() {
        twitterService.connectTwitter().then(function() {
            if (twitterService.loggedIn()) {
                $rootScope.userName = twitterService.getFullName();
                $rootScope.userId = twitterService.getUserName();
                //if the authorization is successful, hide the connect button and display the tweets
                $rootScope.$$phase || $rootScope.$apply();
            }
        });
    };

    $scope.getUserName = function() {
      return $rootScope.userName;
    };

    $scope.getUserId = function() {
      return $rootScope.userId;
    };

    $scope.isLoggedIn = twitterService.loggedIn;

    //if the user is a returning user, hide the sign in button and display the tweets
    if (twitterService.loggedIn()) {
       // $('#connectButton').hide();
       $rootScope.userName = twitterService.getFullName();
       $rootScope.userId = twitterService.getUserName();
       $rootScope.$$phase || $rootScope.$apply();
    };

  });