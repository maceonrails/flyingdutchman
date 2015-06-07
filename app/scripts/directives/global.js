'use strict';
var validateEmail = function(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
};

var loginInputSubmit = function(element, step){
  if (step === 'one'){
    // this is email
    var data = element.val();
    if (validateEmail(data)){
      jQuery(element).parent().children(':not(.icons)').toggleClass('hide');
      var icons  = jQuery(element).siblings('.icons');
      var parent = jQuery(element).parent().parent();
      var pwidth = parseInt(parent.css('width'));
      icons.css('left', pwidth + 50 + 'px');

      setTimeout(function() {
        jQuery('.one').toggleClass('hide');
        jQuery('.one').parent().css('width', '250px');
        jQuery('.two').toggleClass('hide');
        jQuery('.two').find('input').focus();
        jQuery(element).parent().children(':not(.icons)').toggleClass('hide');
        icons.css('left', '0px');
      }, 500);
    }else{
      var parent = element.parent().parent();
      parent.addClass('animated shake');
      setTimeout(function() { parent.removeClass('animated shake'); }, 1000);
    }
  }else{
    //TODO submit the form
  }
};

App
  .directive('autogrow', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.bind('change keyup paste', function () {
          var parent = element.parent().parent();
          var val    = element.val();

          if (val.length > 9){
            var inputLength  = val.length * 12.2;
            var parentLength = inputLength + 140;
            parent.css('width', parentLength + 'px');
            element.css('width', inputLength + 'px');
          }else {
            parent.css('width',  '250px');
            element.css('width', '108px');
          }
        });
      }
    };
  })
  .directive('step', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind('keypress', function (key) {
          if (key.charCode === 13){
            loginInputSubmit(element, attr.step);
          }
        });
      }
    };
  })
  .directive('continue', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.bind('click', function (key) {
          element.addClass('hide').next().removeClass('hide');
          jQuery('.one').find('input').focus();
        });
      }
    };
  })
  .directive('btnStep', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind('click', function (key) {
          var input = element.before();
          loginInputSubmit(input, attr.btnStep);
        });
      }
    };
  });