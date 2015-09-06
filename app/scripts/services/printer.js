'use strict';

angular.module('erestoApp')
  .factory('Printer', function () {
    return {
      authorize: function() {
        return true
      }
    };
  });