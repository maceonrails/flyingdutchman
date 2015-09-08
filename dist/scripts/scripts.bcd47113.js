"use strict";String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1)};var App=angular.module("erestoApp",["ngCookies","ui.router","ngSanitize","ngTouch","LocalStorageModule","restangular","angularify.semantic","ngProgress","angularMoment","ngConfirm","autocomplete","ngFileUpload","ngImgCrop","localytics.directives","ngLodash"]);App.config(["localStorageServiceProvider","RestangularProvider","$httpProvider",function(a,b,c){var d=window.location.hostname;d="localhost"===d?"":d,a.setPrefix("eresto").setStorageType("sessionStorage").setStorageCookieDomain(d),b.setBaseUrl("http://api-bober.eresto.io/v1"),c.interceptors.push("APIInterceptor")}]).service("APIInterceptor",["$rootScope","localStorageService","$q","$injector",function(a,b,c,d){var e=this;e.request=function(d){d.params||(d.params={});var e=null;return e=null===a.token||void 0===a.token?b.get("token"):a.token,d.params.token=e,d||c.when(d)},e.responseError=function(a){return 401===a.status?(b.set("token",null),d.get("$state").transitionTo("welcome"),c.reject(a)):c.reject(a)},e.response=function(c){var d=c.headers("X-Token");d&&b.set("token",d);var e=c.data.total;return e&&(a.total=e),c}}]).run(["$rootScope","$state","$stateParams","Authenticate","Cancan","ngProgress",function(a,b,c,d,e,f){a.$on("$stateChangeStart",function(b,c,g){f.start(),a.toState=c,a.toStateParams=g,e.isIdentityResolved()&&d.authorize()}),a.$on("$stateChangeSuccess",function(){f.complete()}),a.$on("$stateChangeError",function(){f.complete()})}]),angular.module("erestoApp").controller("AuthCtrl",["$scope","$rootScope","User","localStorageService","$state","$timeout",function(a,b,c,d,e,f){var g=d.get("token");null!==g&&e.go("app.dashboard"),a.doLogin=function(){c.authenticate(a.user).then(function(a){d.set("token",a.token),f(function(){e.go("app.dashboard",{token:a.token})},200)},function(){a.user={},b.$broadcast("auth-error")})}}]),angular.module("erestoApp").controller("DashboardCtrl",["$rootScope","$scope","$stateParams","$state",function(a,b,c,d){a.token=c.token,d.go("app.restricted.outlets")}]),angular.module("erestoApp").controller("DiscountsCtrl",["$scope","$rootScope","Discount","Restangular","lodash",function(a,b,c,d,e){a.discounts={},a.selected={},a.products=[],a.outlets=[],a.formType="existing",a.selectedID=null,b.controller="discounts",b.initial=function(b){var e=b||1;c.getData(e).then(function(b){a.discounts=b.discounts,jQuery(".search").removeClass("loading"),b.discounts.length>0?(a.selected=angular.copy(b.discounts[0]),a.selectedID=0):a.formType="new"}),d.one("products","all").get().then(function(b){a.products=b.products}),d.one("outlets","all").get().then(function(b){a.outlets=b.outlets})},b.addNew=function(){a.selected={},a.formType="new",jQuery(".selection.dropdown .text").html("Select Product")},a.selectDiscount=function(b){a.selected=angular.copy(a.discounts[b]),a.selectedID=b,a.formType="existing",jQuery("label.error").remove()},a.saveData=function(){var b=jQuery(".entry-form");b.validate(),b.valid()&&("new"===a.formType?c.save(a.selected).then(function(b){a.discounts.push(b.discount),a.selected=angular.copy(b.discount),f()},function(a){422===a.status&&(c.handle422(a.data),f())}):c.update(a.selected).then(function(b){a.discounts[a.selectedID]=b.discount,a.selected=angular.copy(b.discount),f()},function(a){422===a.status&&(c.handle422(a.data),f())}))},a.deleteData=function(){c["delete"](a.selected).then(function(){a.discounts.splice(a.selectedID,1),a.discounts.length>0?(a.selectedID=0,a.selectDiscount(0)):(a.selected={},a.formType="new"),f()},function(a){422===a.status&&(c.handle422(a.data),f())})},a.$watch("selected",function(b,c){if(b.percentage!==c.percentage){var d=isNaN(parseInt(b.percentage)),f=d?0:parseInt(b.percentage);f/=100;var g=e.find(a.products,function(b){return b.id===a.selected.product_id}),h=f*g.price;a.selected.amount=h}},!0);var f=function(){jQuery(".content-workspace > .dimmer").removeClass("active")}}]),angular.module("erestoApp").controller("MainCtrl",["$rootScope","localStorageService","$state","currentUser","$timeout","$stateParams",function(a,b,c,d,e,f){a.$state=c,a.token=f.token,a.user=d,a.stateWithList=["app.restricted.users","app.restricted.outlets","app.restricted.staff","app.restricted.products","app.restricted.discounts"],a.state=c,a.page=1,a.controller="default",a.search=null,a.countPage=function(){return isNaN(Math.ceil(a.total/10))?1:Math.ceil(a.total/10)},a.nextPage=function(){a.countPage()>a.page&&(a.page+=1,a.initial(a.page))},a.prevPage=function(){a.page>1&&(a.page-=1,a.initial(a.page))};var g=b.get("token");null===g&&c.go("welcome"),a.doLogout=function(){delete a.token,b.remove("token"),e(function(){c.go("welcome")},100)}}]),angular.module("erestoApp").controller("OutletsCtrl",["$scope","$rootScope","Outlet",function(a,b,c){a.outlets={},a.selected={},a.formType="new",a.selectedID=null,b.controller="outlets",b.initial=function(b){var e=b||1;c.getData(e).then(function(b){void 0!==b.outlets&&(a.outlets=b.outlets,jQuery(".search").removeClass("loading"),b.outlets.length>0?(a.selected=angular.copy(b.outlets[0]),a.selected.taxs=d(b.outlets[0].taxs),a.formType="existing",a.selectedID=0):(a.selected={},a.formType="new"))})};var d=function(a){return(null===a||void 0===a)&&(a={}),Object.keys(a).map(function(b){return{label:b,value:a[b]}})},e=function(a){(null===a||void 0===a)&&(a=[]);for(var b={},c=a.length-1;c>=0;c--)"0"!==a[c].value&&(b[a[c].label]=a[c].value);return b};b.addNew=function(){a.selected={},a.formType="new"},a.selectOutlet=function(b){a.selected=angular.copy(a.outlets[b]),a.selected.taxs=d(a.outlets[b].taxs),a.selectedID=b,a.formType="existing",jQuery("label.error").remove(),jQuery("input.error, select.error, textarea.error").removeClass("error")},a.addTax=function(){a.selected.taxs||(a.selected.taxs=[]),a.selected.taxs.push({label:"New tax",value:0})},a.saveData=function(){var b=jQuery(".entry-form");b.validate(),b.valid()&&(a.selected.taxs=e(a.selected.taxs),"new"===a.formType?c.save(a.selected).then(function(b){a.outlets.push(b.outlet),a.selected=angular.copy(b.outlet),a.selected.taxs=d(b.outlet.taxs),f()},function(a){422===a.status&&(c.handle422(a.data),f())}):c.update(a.selected).then(function(b){a.outlets[a.selectedID]=b.outlet,a.selected=angular.copy(b.outlet),a.selected.taxs=d(b.outlet.taxs),f()},function(a){422===a.status&&(c.handle422(a.data),f())}))};var f=function(){jQuery(".content-workspace > .dimmer").removeClass("active")}}]),angular.module("erestoApp").controller("ProductsCtrl",["$scope","$rootScope","Product",function(a,b,c){a.products={},a.selected={},a.selected.result="",a.formType="new",a.selectedID=null,a.categories=null,a.imageError=!1,a.imageErrorMsg=null,b.controller="products",console.log(a.selected),b.initial=function(b){var e=b||1;c.getData(e).then(function(b){void 0!==b.products&&(a.products=b.products,jQuery(".search").removeClass("loading"),b.products.length>0?(a.selected=angular.copy(b.products[0]),a.selected.result="",a.formType="existing",a.selectedID=0):(a.selected={},a.formType="new"))}),d()};var d=function(){c.category().then(function(b){void 0!==b.categories&&(a.categories=b.categories)})},e=function(a){return a.substr(a.lastIndexOf(".")+1)};b.addNew=function(){a.selected={},a.selected.result="",a.formType="new"},a.removePicture=function(){a.selected.picture_base64=null,a.selected.picture=null},a.selectProduct=function(b){a.selected=angular.copy(a.products[b]),a.selectedID=b,a.formType="existing",a.selected.result="",a.imageError=!1,jQuery("label.error").remove(),jQuery("input.error, select.error, textarea.error").removeClass("error")},a.$watch("files",function(){var b=a.files;b&&!b.type.match(/^image\//)?(a.imageError=!0,a.imageErrorMsg="Only image allowed."):(a.imageError=!1,a.upload(a.files))});var f=function(a,b){var c=new FileReader;c.onload=b,c.readAsDataURL(a)};a.upload=function(b){if(b){var c=b;angular.extend(a.selected,{picture_extension:e(c.name),picture:c.name}),f(c,function(b){angular.extend(a.selected,{picture_base64:b.target.result}),a.$apply()})}},a.saveData=function(){a.selected.picture||(a.imageError=!0,a.imageErrorMsg="This field is required.");var b=jQuery(".entry-form");b.validate(),b.valid()&&a.selected.picture&&(a.imageError=!1,a.selected.picture_base64=a.selected.result,"new"===a.formType?c.save(a.selected).then(function(b){a.products.push(b.product),a.selected=angular.copy(b.product),a.selected.result="",a.formType="existing",d(),g()},function(a){422===a.status&&(c.handle422(a.data),g())}):c.update(a.selected).then(function(b){a.products[a.selectedID]=b.product,a.selected=angular.copy(b.product),a.selected.result="",d(),g()},function(a){422===a.status&&(c.handle422(a.data),g())}))},a.deleteData=function(){a.selected.active=!1,c.update(a.selected).then(function(){a.products.splice(a.selectedID,1),a.products.length>0?(a.selectedID=0,a.selectProduct(0)):(a.selected={},a.formType="new",a.selected.result=""),d(),g()},function(a){422===a.status&&(c.handle422(a.data),g())})};var g=function(){jQuery(".content-workspace > .dimmer").removeClass("active")}}]),angular.module("erestoApp").controller("SettingsCtrl",["$scope","$rootScope","User","Outlet","Printer",function(a,b,c,d,e){a.printers=[],a.this_user=angular.copy(b.user),a.addPrinter=!1,b.controller="settings",a.newprinter={},d.getData(1).then(function(b){a.outlet=b.outlets[0]});var f=function(){e.getData().then(function(b){a.printers=b.printers,jQuery(".dimmer.printer").removeClass("active")},function(){jQuery(".dimmer.printer").removeClass("active")})};f(),a.updateUser=function(){jQuery(".dimmer.user").addClass("active"),c.update(a.this_user).then(function(){jQuery(".dimmer.user").removeClass("active")},function(){jQuery(".dimmer.user").removeClass("active")})},a.updateOutlet=function(){jQuery(".dimmer.outlet").addClass("active"),d.update(a.outlet).then(function(){jQuery(".dimmer.outlet").removeClass("active")},function(){jQuery(".dimmer.outlet").removeClass("active")})};var g=function(){jQuery("#newprinter-name").val(""),jQuery("#newprinter-printer").val(""),jQuery("#newprinter-default").prop("checked",!1)};a.cancelAddPrinter=function(){jQuery("#addPrinter").addClass("ng-hide")},a.showAddPrinter=function(){jQuery("#addPrinter").removeClass("ng-hide")},a.savePrinter=function(){var b={name:jQuery("#newprinter-name").val(),printer:jQuery("#newprinter-printer").val(),"default":jQuery("#newprinter-default").is(":checked")};e.save(b).then(function(){jQuery(".dimmer.printer").removeClass("active"),f(),g(),a.cancelAddPrinter()},function(){jQuery(".dimmer.printer").removeClass("active")})},a.deletePrinter=function(b){e["delete"](b).then(function(){jQuery(".dimmer.printer").removeClass("active"),f(),g(),a.cancelAddPrinter()},function(){jQuery(".dimmer.printer").removeClass("active")})}}]),angular.module("erestoApp").controller("StaffCtrl",["$scope","$rootScope","User","Outlet",function(a,b,c,d){a.users={},a.outlets={},a.selected={},a.formType="existing",a.selectedID=null,b.controller="users",b.search=!1,a.roles=[{title:"Owner",value:"owner"},{title:"Superadmin",value:"superadmin"},{title:"Manager",value:"manager"},{title:"Assistant Manager",value:"assistant_manager"},{title:"Waitress",value:"waitress"},{title:"Captain",value:"captain"},{title:"Cashier",value:"cashier"},{title:"Chef",value:"chef"}],b.initial=function(b){var e=b||1;c.getData(e).then(function(b){a.users=b.users,jQuery(".search").removeClass("loading"),b.users.length>0&&(a.selected=angular.copy(b.users[0]),a.selectedID=0,h())}),d.getData(e).then(function(b){void 0!==b.outlets&&(a.outlets=b.outlets,jQuery(".search").removeClass("loading"))})},b.addNew=function(){a.selected={},a.formType="new"},a.selectUser=function(b){a.selected=angular.copy(a.users[b]),a.selectedID=b,a.formType="existing",jQuery("label.error").remove(),jQuery("input.error, select.error, textarea.error").removeClass("error"),h()},a.saveData=function(){var b=jQuery(".entry-form");b.validate(),b.valid()&&(a.selected.profile_attributes.join_at=g(a.selected.profile_attributes.join_at),a.selected.profile_attributes.contract_until=g(a.selected.profile_attributes.contract_until),"new"===a.formType?c.save(a.selected).then(function(b){a.users.push(b.user),a.selected=angular.copy(b.user),h(),e()},function(a){422===a.status&&(c.handle422(a.data),e())}):c.update(a.selected).then(function(b){a.users[a.selectedID]=b.user,a.selected=angular.copy(b.user),h(),e()},function(a){422===a.status&&(c.handle422(a.data),e())}))};var e=function(){jQuery(".content-workspace > .dimmer").removeClass("active")},f=function(a){return null!==a||void 0!==a?moment(a).format("ddd, D MMM YYYY"):" "},g=function(a){return null!==a||void 0!==a?moment(a).format("YYYY-MM-D"):" "},h=function(){a.selected.profile_attributes.join_at=f(a.selected.profile_attributes.join_at),a.selected.profile_attributes.contract_until=f(a.selected.profile_attributes.contract_until)}}]),angular.module("erestoApp").controller("UsersCtrl",["$scope","$rootScope","User",function(a,b,c){a.users={},a.selected={},a.formType="existing",a.selectedID=null,b.controller="users",b.initial=function(b){var d=b||1;c.eresto(d).then(function(b){a.users=b.users,jQuery(".search").removeClass("loading"),b.users.length>0&&(a.selected=angular.copy(b.users[0]),a.selectedID=0,g())})},b.addNew=function(){a.selected={},a.formType="new"},a.selectUser=function(b){a.selected=angular.copy(a.users[b]),a.selectedID=b,a.formType="existing",jQuery("label.error").remove(),jQuery("input.error, select.error, textarea.error").removeClass("error"),g()},a.saveData=function(){var b=jQuery(".entry-form");b.validate(),b.valid()&&(a.selected.profile_attributes.join_at=f(a.selected.profile_attributes.join_at),a.selected.profile_attributes.contract_until=f(a.selected.profile_attributes.contract_until),"new"===a.formType?(a.selected.role="eresto",c.save(a.selected).then(function(b){a.users.push(b.user),a.selected=angular.copy(b.user),g(),d()},function(a){422===a.status&&(c.handle422(a.data),d())})):c.update(a.selected).then(function(b){a.users[a.selectedID]=b.user,a.selected=angular.copy(b.user),g(),d()},function(a){422===a.status&&(c.handle422(a.data),d())}))};var d=function(){jQuery(".content-workspace > .dimmer").removeClass("active")},e=function(a){return null!==a||void 0!==a?moment(a).format("ddd, D MMM YYYY"):" "},f=function(a){return null!==a||void 0!==a?moment(a).format("YYYY-MM-D"):" "},g=function(){a.selected.profile_attributes.join_at=e(a.selected.profile_attributes.join_at),a.selected.profile_attributes.contract_until=e(a.selected.profile_attributes.contract_until)}}]);var app=angular.module("autocomplete",[]);app.directive("autocomplete",function(){var a=-1;return{restrict:"E",scope:{searchParam:"=ngModel",suggestions:"=data",onType:"=onType",onSelect:"=onSelect",autocompleteRequired:"="},controller:["$scope",function(a){a.selectedIndex=-1,a.initLock=!0,a.setIndex=function(b){a.selectedIndex=parseInt(b)},this.setIndex=function(b){a.setIndex(b),a.$apply()},a.getIndex=function(b){return a.selectedIndex};var b=!0;a.completing=!1,a.$watch("searchParam",function(c,d){d===c||!d&&a.initLock||(b&&"undefined"!=typeof a.searchParam&&null!==a.searchParam&&(a.completing=!0,a.searchFilter=a.searchParam,a.selectedIndex=-1),a.onType&&a.onType(a.searchParam))}),this.preSelect=function(c){b=!1,a.$apply(),b=!0},a.preSelect=this.preSelect,this.preSelectOff=function(){b=!0},a.preSelectOff=this.preSelectOff,a.select=function(c){c&&(a.searchParam=c,a.searchFilter=c,a.onSelect&&a.onSelect(c)),b=!1,a.completing=!1,setTimeout(function(){b=!0},1e3),a.setIndex(-1)}}],link:function(b,c,d){setTimeout(function(){b.initLock=!1,b.$apply()},250);var e="";b.attrs={placeholder:"start typing...","class":"",id:"",inputclass:"",inputid:"",name:""};for(var f in d)e=f.replace("attr","").toLowerCase(),0===f.indexOf("attr")&&(b.attrs[e]=d[f]);d.clickActivation&&(c[0].onclick=function(a){b.searchParam||setTimeout(function(){b.completing=!0,b.$apply()},200)});var g={left:37,up:38,right:39,down:40,enter:13,esc:27,tab:9};document.addEventListener("keydown",function(a){var c=a.keyCode||a.which;switch(c){case g.esc:b.select(),b.setIndex(-1),b.$apply(),a.preventDefault()}},!0),document.addEventListener("blur",function(a){setTimeout(function(){b.select(),b.setIndex(-1),b.$apply()},150)},!0),c[0].addEventListener("keydown",function(c){var d=c.keyCode||c.which,e=angular.element(this).find("li").length;if(b.completing&&0!=e)switch(d){case g.up:if(a=b.getIndex()-1,-1>a)a=e-1;else if(a>=e){a=-1,b.setIndex(a),b.preSelectOff();break}b.setIndex(a),-1!==a&&b.preSelect(angular.element(angular.element(this).find("li")[a]).text()),b.$apply();break;case g.down:if(a=b.getIndex()+1,-1>a)a=e-1;else if(a>=e){a=-1,b.setIndex(a),b.preSelectOff(),b.$apply();break}b.setIndex(a),-1!==a&&b.preSelect(angular.element(angular.element(this).find("li")[a]).text());break;case g.left:break;case g.right:case g.enter:case g.tab:a=b.getIndex(),-1!==a?(b.select(angular.element(angular.element(this).find("li")[a]).text()),d==g.enter&&c.preventDefault()):d==g.enter&&b.select(),b.setIndex(-1),b.$apply();break;case g.esc:b.select(),b.setIndex(-1),b.$apply(),c.preventDefault();break;default:return}})},template:'        <div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">          <input            type="text"            ng-model="searchParam"            placeholder="{{ attrs.placeholder }}"            class="{{ attrs.inputclass }}"            id="{{ attrs.inputid }}"            name="{{ attrs.name }}"            ng-required="{{ autocompleteRequired }}" />          <ul ng-show="completing && (suggestions | filter:searchFilter).length > 0">            <li              suggestion              ng-repeat="suggestion in suggestions | filter:searchFilter | orderBy:\'toString()\' track by $index"              index="{{ $index }}"              val="{{ suggestion }}"              ng-class="{ active: ($index === selectedIndex) }"              ng-click="select(suggestion)"              ng-bind-html="suggestion | highlight:searchParam"></li>          </ul>        </div>'}}),app.filter("highlight",["$sce",function(a){return function(b,c){if("function"==typeof b)return"";if(c){var d="("+c.split(/\ /).join(" |")+"|"+c.split(/\ /).join("|")+")",e=new RegExp(d,"gi");d.length&&(b=b.replace(e,'<span class="highlight">$1</span>'))}return a.trustAsHtml(b)}}]),app.directive("suggestion",function(){return{restrict:"A",require:"^autocomplete",link:function(a,b,c,d){b.bind("mouseenter",function(){d.preSelect(c.val),d.setIndex(c.index)}),b.bind("mouseleave",function(){d.preSelectOff()})}}}),angular.module("angularify.semantic.dropdown",[]).controller("DropDownController",["$scope",function(a){a.options=[],this.add_option=function(b,c){a.options.push({title:b,value:c}),c==a.model&&this.update_title(c)},this.remove_option=function(b,c){for(var d in a.options)if(a.options[d].value==c&&a.options[d].title==b){a.options.splice(d,1);break}},this.update_model=function(b,c){a.model!==c&&(a.model=c)},this.update_title=function(b){var c=!1;for(var d in a.options)a.options[d].value==b&&(a.title=a.options[d].title,c=!0);c?a.text_class="text":(a.title=b,a.text_class="text")}}]).directive("dropdown",function(){return{restrict:"E",replace:!0,transclude:!0,controller:"DropDownController",scope:{title:"@",open:"@",model:"=ngModel"},template:'<div class="{{ dropdown_class }}"><div class="{{text_class}}">{{ title }}</div><i class="dropdown icon"></i><div class="{{ menu_class }}"  ng-transclude></div></div>',link:function(a,b,c,d){a.dropdown_class="ui selection dropdown",a.menu_class="menu transition hidden",a.text_class="default text",a.original_title=a.title,"true"===a.open?(a.is_open=!0,a.dropdown_class=a.dropdown_class+" active visible",a.menu_class=a.menu_class+" visible"):a.is_open=!1,a.toTitleCase=function(a){return a.replace("_"," ").replace(/\w\S*/g,function(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()})},a.element=b,a.$watch("model",function(a){if(void 0!==a&&void 0!==$(".item."+a).children()[0]){var b=$(".item."+a).children()[0].innerHTML;d.update_title(b)}}),b.bind("click",function(){a.is_open===!1?a.$apply(function(){a.dropdown_class="ui selection dropdown active visible",a.menu_class="menu transition visible"}):a.$apply(function(){a.dropdown_class="ui selection dropdown",a.menu_class="menu transition hidden"}),a.is_open=!a.is_open})}}}).directive("dropdownGroup",function(){return{restrict:"AE",replace:!0,transclude:!0,require:"^dropdown",scope:{title:"=title",value:"=value"},template:'<div class="item {{item_value}}" ng-transclude>{{ item_title }}</div>',link:function(a,b,c,d){void 0===a.title?a.item_title=b.children()[0].innerHTML:a.item_title=a.title,void 0===a.value?a.item_value=c.value||a.item_title:a.item_value=a.value,d.add_option(a.item_title,a.item_value),b.bind("click",function(){d.update_model(a.item_title,a.item_value),d.update_title($(this).children()[0].innerHTML)}),a.$on("$destroy",function(){d.remove_option(a.item_title,a.item_value)})}}});var validateEmail=function(a){var b=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;return b.test(a)},loginInputSubmit=function(a,b,c){if("one"===b){var d=a.val();if(validateEmail(d)){jQuery(a).parent().children(":not(.icons)").toggleClass("hide");var e=jQuery(a).siblings(".icons"),f=jQuery(a).parent().parent(),g=parseInt(f.css("width"));e.css("left",g+50+"px"),setTimeout(function(){jQuery(".one").toggleClass("hide"),jQuery(".one").parent().css("width","250px"),jQuery(".two").toggleClass("hide"),jQuery(".two").find("input").focus(),jQuery(a).parent().children(":not(.icons)").toggleClass("hide"),e.css("left","0px")},500)}else{var h=a.parent().parent();h.addClass("animated shake"),setTimeout(function(){h.removeClass("animated shake")},1e3)}}else{jQuery(a).parent().children(":not(.icons)").toggleClass("hide");var i=jQuery(a).siblings(".icons"),j=jQuery(a).parent().parent(),k=parseInt(j.css("width"));i.css("left",k+50+"px"),setTimeout(function(){jQuery(".two").toggleClass("hide"),jQuery(".two").parent().css("width","250px"),jQuery(a).parent().parent().toggleClass("hide"),jQuery(".three").removeClass("hide"),jQuery(a).parent().children(":not(.icons)").toggleClass("hide"),i.css("left","0px")},10),c.doLogin()}};App.directive("autogrow",function(){return{restrict:"A",link:function(a,b){b.bind("change keyup paste",function(){var a=b.parent().parent(),c=b.val();if(c.length>9){var d=12.2*c.length,e=d+140;a.css("width",e+"px"),b.css("width",d+"px")}else a.css("width","250px"),b.css("width","108px")})}}}).directive("step",function(){return{restrict:"A",link:function(a,b,c){b.bind("keypress",function(d){(13===d.keyCode||9===d.keyCode)&&loginInputSubmit(b,c.step,a)})}}}).directive("continue",function(){return{restrict:"A",link:function(a,b){b.bind("click",function(){b.addClass("hide").next().removeClass("hide"),jQuery(".one").find("input").focus()})}}}).directive("btnStep",function(){return{restrict:"A",link:function(a,b,c){b.bind("click",function(){var d=b.before();loginInputSubmit(d,c.btnStep,a)})}}}).directive("loginBtn",function(){return{restrict:"A",link:function(a,b){a.$on("auth-error",function(){jQuery(b).addClass("hide");var a=jQuery(".one");a.parent().removeClass("hide"),a.removeClass("hide"),a.find("input").focus(),setTimeout(function(){a.parent().addClass("animated shake")},100),setTimeout(function(){a.parent().removeClass("animated shake")},1100)})}}}).directive("contentWorkspace",["$window",function(a){return{restrict:"C",link:function(b,c){var d=a.innerHeight-100;jQuery(c).css("min-height",d+"px")}}}]).directive("pickaday",function(){return{restrict:"C",link:function(a,b){new Pikaday({field:jQuery(b)[0],format:"ddd, D MMM YYYY"})}}}).directive("ngSearch",["$rootScope",function(a){return{restrict:"A",link:function(b,c){var d=c.find(".search");d.bind("click",function(){d.addClass("loading"),jQuery("#search").focus(),(null===a.search||void 0===a.search.field)&&(a.search=null),a.initial(a.page)})}}}]).directive("sidebar",function(){return{restrict:"C",link:function(a,b){jQuery(b).enscroll({showOnHover:!0,verticalTrackClass:"track3",verticalHandleClass:"handle3"})}}}).filter("range",function(){return function(a,b){b=parseInt(b);for(var c=0;b>c;c++)a.push(c);return a}}),App.config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/dashboard"),b.when("","/dashboard"),a.state("app",{url:"","abstract":!0,templateUrl:"views/layouts/application.html",controller:"MainCtrl",params:{token:null},resolve:{currentUser:["Cancan",function(a){return a.identity(!0)}]}}).state("app.dashboard",{url:"/dashboard",templateUrl:"views/dashboard/index.html",controller:"DashboardCtrl"}).state("app.restricted",{url:"/","abstract":!0,resolve:{authorize:["Authenticate",function(a){return a.authorize()}]},template:"<div ui-view> </div>"}).state("app.restricted.users",{url:"users",data:{roles:["eresto"]},templateUrl:"views/users/index.html",controller:"UsersCtrl"}).state("app.restricted.outlets",{url:"outlets",data:{roles:["superadmin","owner"]},templateUrl:"views/outlets/index.html",controller:"OutletsCtrl"}).state("app.restricted.staff",{url:"staff",data:{roles:["superadmin","owner"]},templateUrl:"views/staffs/index.html",controller:"StaffCtrl"}).state("app.restricted.products",{url:"products",data:{roles:["superadmin","owner"]},templateUrl:"views/products/index.html",controller:"ProductsCtrl"}).state("app.restricted.discounts",{url:"discounts",data:{roles:["superadmin","owner"]},templateUrl:"views/discounts/index.html",controller:"DiscountsCtrl"}).state("app.restricted.settings",{url:"settings",data:{roles:["superadmin","owner"]},templateUrl:"views/settings/index.html",controller:"SettingsCtrl"}).state("welcome",{url:"/welcome",templateUrl:"views/auth/index.html",controller:"AuthCtrl"})}]),angular.module("erestoApp").factory("Authenticate",["$rootScope","$state","Cancan",function(a,b,c){return{authorize:function(){return c.identity().then(function(){var d=c.isAuthenticated();void 0!==a.toState.data&&"app.dashboard"!==a.toState.name&&a.toState.data.roles&&a.toState.data.roles.length>0&&!c.isInAnyRole(a.toState.data.roles)&&(d?b.go("app.dashboard"):(a.returnToState=a.toState,a.returnToStateParams=a.toStateParams,b.go("welcome")))})}}}]),angular.module("erestoApp").factory("Cancan",["$q","$http","User",function(a,b,c){var d=void 0,e=!1;return{isIdentityResolved:function(){return angular.isDefined(d)},isAuthenticated:function(){return e},isInRole:function(a){return e&&d.role?-1!==d.role.indexOf(a):!1},isInAnyRole:function(a){if(!e||!d.role)return!1;console.log(a);for(var b=0;b<a.length;b++)if(this.isInRole(a[b]))return!0;return!1},authenticate:function(a){d=a,e=null!==a},identity:function(b){var f=a.defer();return b===!0&&(d=void 0),angular.isDefined(d)?(f.resolve(d),f.promise):(c.me().then(function(a){d=a.user,e=!0,f.resolve(d)},function(){d=null,e=!1,f.resolve(d)}),f.promise)}}}]),angular.module("erestoApp").factory("Discount",["Restangular","$rootScope",function(a,b){return{getData:function(c){if(b.search){var d={};return angular.extend(d,{page:c},b.search),a.one("discounts","search").customGET("",d)}return a.all("discounts").customGET("",{page:c})},save:function(b){return jQuery(".content-workspace > .dimmer").addClass("active"),a.all("discounts").customPOST({discount:b},null,{},{})},update:function(b){return jQuery(".content-workspace > .dimmer").addClass("active"),a.one("discounts",b.id).customPUT({discount:b},null,{},{})},"delete":function(b){return jQuery(".content-workspace > .dimmer").addClass("active"),a.one("discounts",b.id).remove()},handle422:function(a){for(var b in a){var c=b.charAt(0).toUpperCase()+b.slice(1);jQuery("#"+b).after('<label class="error">'+c+" "+a[b][0]+"</label>")}return!0}}}]),angular.module("erestoApp").factory("Order",["Restangular",function(a){return{getData:function(b){return a.one("orders","search").customGET("",b)}}}]),angular.module("erestoApp").factory("Outlet",["Restangular","$rootScope",function(a,b){return{authenticate:function(b){return a.all("sessions").customPOST({outlet:b},null,{},{})},me:function(){return a.one("me").get()},getData:function(c){if(b.search){var d={};return angular.extend(d,{page:c},b.search),a.one("outlets","search").customGET("",d)}return a.all("outlets").customGET("",{page:c})},save:function(b){return jQuery(".content-workspace > .dimmer").addClass("active"),a.all("outlets").customPOST({outlet:b},null,{},{})},update:function(b){return jQuery(".content-workspace > .dimmer").addClass("active"),a.one("outlets",b.id).customPUT({outlet:b},null,{},{})},handle422:function(a){for(var b in a){var c=b.charAt(0).toUpperCase()+b.slice(1);jQuery("#"+b).after('<label class="error">'+c+" "+a[b][0]+"</label>")}return!0}}}]),angular.module("erestoApp").factory("Printer",["Restangular",function(a){return{getData:function(){return a.one("printers","all").get()},save:function(b){return jQuery(".dimmer.printer").addClass("active"),a.all("printers").customPOST({printer:b},null,{},{})},update:function(b){return jQuery(".dimmer.printer").addClass("active"),a.one("printers",b.id).customPUT({printer:b},null,{},{})},"delete":function(b){return jQuery(".dimmer.printer").addClass("active"),a.one("printers",b.id).remove()}}}]),angular.module("erestoApp").factory("Product",["Restangular","$rootScope",function(a,b){return{getData:function(c){if(b.search){var d={};return angular.extend(d,{page:c},b.search),a.one("products","search").customGET("",d)}return a.all("products").customGET("",{page:c})},category:function(){return a.one("products","category").get()},save:function(b){return jQuery(".content-workspace > .dimmer").addClass("active"),a.all("products").customPOST({product:b},null,{},{})},update:function(b){return jQuery(".content-workspace > .dimmer").addClass("active"),a.one("products",b.id).customPUT({product:b},null,{},{})},handle422:function(a){for(var b in a){var c=b.charAt(0).toUpperCase()+b.slice(1);jQuery("#"+b).after('<label class="error">'+c+" "+a[b][0]+"</label>")}return!0}}}]),angular.module("erestoApp").factory("Random",function(){return{generate:function(a){for(var b=a||20,c="",d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=0;b>e;e++)c+=d.charAt(Math.floor(Math.random()*d.length));return c}}}),angular.module("erestoApp").factory("User",["Restangular","$rootScope",function(a,b){return{authenticate:function(b){return a.all("sessions").customPOST({user:b},null,{},{})},me:function(){return a.one("me").get()},eresto:function(c){if(b.search){var d={};return angular.extend(d,{"filter[role]":"eresto",page:c},b.search),a.one("users","search").customGET("",d)}return a.all("users").customGET("",{"filter[role]":"eresto",page:c})},getData:function(c){if(b.search){var d={};return angular.extend(d,{page:c},b.search),a.one("users","search").customGET("",d)}return a.all("users").customGET("",{page:c})},save:function(b){return jQuery(".content-workspace > .dimmer").addClass("active"),a.all("users").customPOST({user:b},null,{},{})},update:function(b){return jQuery(".content-workspace > .dimmer").addClass("active"),a.one("users",b.id).customPUT({user:b},null,{},{})},handle422:function(a){for(var b in a){var c=b.charAt(0).toUpperCase()+b.slice(1);jQuery("#"+b).after('<label class="error">'+c+" "+a[b][0]+"</label>")}return!0}}}]);