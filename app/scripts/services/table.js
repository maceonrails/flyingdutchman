'use strict';

angular.module('erestoApp')
  .factory('Table', function (Restangular, $rootScope) {
    return {
      getData: function() {
        if ($rootScope.search){
          var query = {};
          angular.extend(query, $rootScope.search);
          return Restangular.one('tables', 'search').customGET('', query);
        }else{
          return Restangular.one('tables', '').get();
        }
      },

      save: function(table) {
        jQuery('.content-workspace > .dimmer').addClass('active');
        return Restangular.all('tables')
          .customPOST({'table': table}, null, {}, {});
      },

      update: function(table) {
        jQuery('.content-workspace > .dimmer').addClass('active');
        return Restangular.one('tables', table.location)
          .customPUT({'table': table}, null, {}, {});
      },

      handle422: function(errors){
        for (var error in errors){
          var title = error.charAt(0).toUpperCase() + error.slice(1);
          jQuery('#'+error)
            .after('<label class="error">' + title + ' ' + errors[error][0] + '</label>');
        }
        return true;
      }
    };
  });
