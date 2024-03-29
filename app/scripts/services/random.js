'use strict';

angular.module('erestoApp')
  .factory('Random', function () {
    return {
      generate: function(length) {
        var len  = length || 20;
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for( var i=0; i < len; i++ ){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }
    };
  });


