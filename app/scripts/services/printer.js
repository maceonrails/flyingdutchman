'use strict';

angular.module('erestoApp')
  .factory('Printer', function (Restangular) {
    return {
      getData: function() {
        return Restangular.one('printers', 'all').get();
      },
      save: function(printer) {
        jQuery('.dimmer.printer').addClass('active');
        return Restangular.all('printers')
          .customPOST({'printer': printer}, null, {}, {});
      },
      update: function(printer) {
        jQuery('.dimmer.printer').addClass('active');
        return Restangular.one('printers', printer.id)
          .customPUT({'printer': printer}, null, {}, {});
      },
      delete: function(printer) {
        jQuery('.dimmer.printer').addClass('active');
        return Restangular.one('printers', printer.id).remove();
      }
    };
  });