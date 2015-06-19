'use strict';

angular.module('erestoApp')
  .factory('User', function (Restangular) {
    return {
      authenticate: function(user) {
        return Restangular.all('sessions')
          .customPOST({'user': user}, null, {}, {});
      },
      me: function() {
        return Restangular.one('me').get();
      },
    };
  });
