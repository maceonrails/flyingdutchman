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
      eresto: function() {
        return Restangular.all('users', {filter: { role: 'eresto' }}).one('').get();
      },
      save: function(user) {
        return Restangular.all('users')
          .customPOST({'user': user}, null, {}, {});
      },
      update: function(user) {
        return Restangular.one('users', user.id)
          .customPUT({'user': user}, null, {}, {});
      }
    };
  });
