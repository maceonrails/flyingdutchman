"use strict";var App=angular.module("erestoApp",["ngAnimate","ngCookies","ngResource","ui.router","ngSanitize","ngTouch","LocalStorageModule"]);App.config(["localStorageServiceProvider",function(a){var b=window.location.hostname;b="localhost"===b?"":b,a.setPrefix("eresto").setStorageType("sessionStorage").setStorageCookieDomain(b)}]),angular.module("erestoApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]);var validateEmail=function(a){var b=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;return b.test(a)},loginInputSubmit=function(a,b){if("one"===b){var c=a.val();if(validateEmail(c)){jQuery(a).parent().children(":not(.icons)").toggleClass("hide");var d=jQuery(a).siblings(".icons"),e=jQuery(a).parent().parent(),f=parseInt(e.css("width"));d.css("left",f+50+"px"),setTimeout(function(){jQuery(".one").toggleClass("hide"),jQuery(".one").parent().css("width","250px"),jQuery(".two").toggleClass("hide"),jQuery(".two").find("input").focus(),jQuery(a).parent().children(":not(.icons)").toggleClass("hide"),d.css("left","0px")},500)}else{var e=a.parent().parent();e.addClass("animated shake"),setTimeout(function(){e.removeClass("animated shake")},1e3)}}};App.directive("autogrow",function(){return{restrict:"A",link:function(a,b){b.bind("change keyup paste",function(){var a=b.parent().parent(),c=b.val();if(c.length>9){var d=12.2*c.length,e=d+140;a.css("width",e+"px"),b.css("width",d+"px")}else a.css("width","250px"),b.css("width","108px")})}}}).directive("step",function(){return{restrict:"A",link:function(a,b,c){b.bind("keypress",function(a){13===a.charCode&&loginInputSubmit(b,c.step)})}}}).directive("continue",function(){return{restrict:"A",link:function(a,b){b.bind("click",function(a){b.addClass("hide").next().removeClass("hide"),jQuery(".one").find("input").focus()})}}}).directive("btnStep",function(){return{restrict:"A",link:function(a,b,c){b.bind("click",function(a){var d=b.before();loginInputSubmit(d,c.btnStep)})}}}),App.config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/dashboard"),b.when("","/dashboard"),a.state("app",{url:"","abstract":!0,template:"<div ui-view></div>",controller:["localStorageService","$state",function(a,b){var c=a.get("token");null===c&&b.go("welcome")}]}).state("app.dashboard",{url:"/dashboard",templateUrl:"views/dashboard/index.html"}).state("welcome",{url:"/welcome",templateUrl:"views/auth/index.html"})}]);