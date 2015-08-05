'use strict';

angular.module('erestoApp')
  .factory('Outlet', function (Restangular, $rootScope) {
    return {
      authenticate: function(outlet) {
        return Restangular.all('sessions')
          .customPOST({'outlet': outlet}, null, {}, {});
      },
      me: function() {
        return Restangular.one('me').get();
      },
      getData: function(page) {
        if ($rootScope.search){
          var query = {};
          angular.extend(query, {page: page }, $rootScope.search);
          return Restangular.one('outlets', 'search')
            .customGET('', query);
        }else{
          return Restangular.all('outlets')
            .customGET('', { page: page });
        }
      },
      save: function(outlet) {
        jQuery('.content-workspace > .dimmer').addClass('active');
        return Restangular.all('outlets')
          .customPOST({'outlet': outlet}, null, {}, {});
      },
      update: function(outlet) {
        jQuery('.content-workspace > .dimmer').addClass('active');
        return Restangular.one('outlets', outlet.id)
          .customPUT({'outlet': outlet}, null, {}, {});
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
  })

  .factory('Cloud', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('http://localhost:4000/v1');
    });
  });
