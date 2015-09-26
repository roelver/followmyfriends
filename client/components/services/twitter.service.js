angular.module('followmyfriendsApp')

  .factory('twitterService', function($q) {

    var authorizationResult = false;
    var myName = '';
    var myAlias = '';

    return {
        initialize: function() {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('22KuNBzWtwuBKKEGQHeFG8QsaDc', {cache:true});
            //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
            authorizationResult = OAuth.create('twitter');
        },

        loggedIn: function() {
            return (myAlias.length > 0);
        },

        connectTwitter: function() {
            var deferred = $q.defer();
            OAuth.popup('twitter', {cache:true}, function(error, result) { //cache means to execute the callback if the tokens are already present
                if (!error) {
                    authorizationResult = result;
                    result.me().done(function(data) {
                        myName = data.name;
                        myAlias = data.alias;
                        deferred.resolve();
                   });
                } else {
                    //do something if there's an error
                }
            });
            return deferred.promise;
        },

        clearCache: function() {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        },

        getFullName: function() {
            return myName;
        },

        getUserName: function() {
            return myAlias;
        }
    }

});
