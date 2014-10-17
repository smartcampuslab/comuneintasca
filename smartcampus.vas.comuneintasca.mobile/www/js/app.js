// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ilcomuneintasca' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ilcomuneintasca', [
  'ionic', 
  'ilcomuneintasca.controllers.common',
  'ilcomuneintasca.controllers.home',
  'ilcomuneintasca.controllers.itineraries',
  'ilcomuneintasca.services.conf',
  'ilcomuneintasca.services.date',
  'ilcomuneintasca.services.list',
  'ilcomuneintasca.services.geo',
  'ilcomuneintasca.services.map',
  'ilcomuneintasca.services.db',
  'ilcomuneintasca.services.fs',
  'ilcomuneintasca.filters',
  'ilcomuneintasca.directives',
  'ngQueue',
  'google-maps'
])

.run(function ($ionicPlatform, $rootScope, $state, $filter, $location, Config, DatiDB, GeoLocate) {
  $rootScope.locationWatchID = undefined;
  //  ionic.Platform.fullScreen(false,true);
  if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
      return this * Math.PI / 180;
    }
  }
  document.addEventListener("pause", function () {
    console.log('app paused');
    if (typeof $rootScope.locationWatchID != 'undefined') {
      navigator.geolocation.clearWatch($rootScope.locationWatchID);
      $rootScope.locationWatchID = undefined;
      GeoLocate.reset();
      console.log('geolocation reset');
    }
  }, false);
  document.addEventListener("resume", function () {
    console.log('app resumed');
    GeoLocate.locate();
  }, false);
  $ionicPlatform.ready(function () {
    //console.log('IONIC READY!');
    // Disable BACK button on home
    $ionicPlatform.registerBackButtonAction(function (event) {
      if($state.current.name=="app.home"){
        console.log('not going back anymore!');
      } else {
        navigator.app.backHistory();
      }
    }, 100);
   /*
    if (window.cordova && cordova.plugins && cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      window.addEventListener('native.showkeyboard', function(e){
        console.log('Keyboard height is: ' + e.keyboardHeight);
        angular.element(document.querySelector('#ion-footer-bar'))
        footer.addClass('keyboard').css('bottom',e.keyboardHeight+'px');
      });
      window.addEventListener('native.hidekeyboard', function(e){
        console.log('Keyboard closed');
        angular.element(document.querySelector('#ion-footer-bar')).css('bottom','0').removeClass('keyboard');
      });
    } 
    */
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //      StatusBar.overlaysWebView(false);
      //      StatusBar.styleBlackOpaque();
      //      StatusBar.show();
      if (device.model.indexOf('iPhone6,2') == 0) StatusBar.hide();
    }
    //ionic.Platform.showStatusBar(false);

    document.addEventListener("deviceready", function () { 
      //console.log('removing splashscreen...');
      //giving another couple of seconds to ui to complete css&font elements redraw (on android)
      setTimeout(function(){ navigator.splashscreen.hide(); },1500);
    });
  });
  GeoLocate.locate().then(function (position) {
    $rootScope.myPosition = position;
    //console.log('first geolocation: ' + position);
  }, function () {
    console.log('CANNOT LOCATE!');
  });

  var lang = Config.getLang();
  if (localStorage.lang && localStorage.lang!=lang) {
    lang=localStorage.lang;
    //console.log('language configured: '+lang);
  } else {
    //console.log('language detected: '+lang);
  }
  $rootScope.lang=localStorage.lang=lang;

  $rootScope.goto = function (link) {
    if (link) {
      if (link.indexOf('#/app/')==0) link=link.substring(1);
      if (link.indexOf('/app/')!=0) link='/app/'+link;
      $location.path(link);
    } else {
      console.log('goto() link is null!');
    }
  };
  $rootScope.getMenuPath = function (group,menu) {
    var group_id=group.id;
    var menu_id=menu.id;
    //group_id=$filter('cleanMenuID')(group.id);
    //menu_id=$filter('cleanMenuID')(menu.id);
    if (group_id=='percorsi'&& menu_id=='itineraries' || 
        (group.items.length == 1 && (menu.type == 'itineraries' || (menu.query != null && menu.query.type=='itineraries')))) {
      $rootScope.itineraryGroup = group;  
      return 'itineraries';
    } else {
      return 'page/'+group_id+'/'+menu_id+'/';
    }
  }
  $rootScope.gotoSubpath = function (subpath) {
    //console.log('full subpath: '+$location.path()+subpath)
    $location.path($location.path()+subpath);
  }

  $rootScope.getListItemHeight = function (item, index) {
    //console.log('height for item #'+index);
    //console.log('height for item id: '+item.id);
    return 100;
  };

  // global functions for toolbox
  $rootScope.extLink = function (url) {
    if (url.indexOf('http') != 0 && url.indexOf('tel') != 0 && url.indexOf('mailto') != 0 && url.indexOf('sms') != 0) {
      url = 'http://' + url;
    }
    if (ionic.Platform.isWebView()) {
      win_target = '_system';
    } else {
      win_target = '_blank';
    }
    window.open(url, win_target);
  }
  $rootScope.email = function (to) {
    if (ionic.Platform.isWebView()) {
      window.plugin.email.open({
        to: [to]
      });
    } else {
      window.location = "mailto:" + to;
    }
  }
  $rootScope.hasNav = function (loc) {
    return loc != null;
  }
  $rootScope.bringmethere = function (loc) {
    if (device.platform == "Android") {
      window.open("http://maps.google.com/maps?daddr=" + loc[0] + "," + loc[1], "_system");
    } else if (device.platform == "iOS") {
      var url = "maps:daddr=" + loc[0] + "," + loc[1];
      successFn();
      window.location = url;
    } else {
      console.error("Unknown platform");
    }
  }
  $rootScope.share = function (text, webUrl, imgUrl) {
    setTimeout(function(){
      window.plugins.socialsharing.share(text, text, imgUrl, webUrl);
    },0);
  }
  $rootScope.toggleFavorite = function (obj) {
    DatiDB.setFavorite(obj.id, obj.favorite < 0).then(function (res) {
      obj['favorite'] = res ? 1 : -1;
    });
  }

  $rootScope.isFavorite = function (obj) {
    if (!obj) return false;
    if (obj['favorite'] == null || obj['favorite'] == 0) {
      DatiDB.isFavorite(obj.id).then(function (res) {
        obj['favorite'] = res ? 1 : -1;
      });
      return false;
    } else {
      return obj['favorite'] > 0 ? true : false;
    }
  }
  
  $rootScope.extOrderBySorter=function(input, params){
    if (!input || !params || !params.order) return input;
    //console.log('input.length: '+input.length);

    var order = params.order;
    //console.log('$rootScope.extOrderBySorter.order: '+order);
    var filter = params.searchText;

    var arr = [];
    if (filter && filter.length > 0) {
      //console.log('ordering.1: '+filter);
      var f = filter.toLowerCase();
      for (var i = 0; i < input.length; i++) {
        if ($filter('translate')(input[i].title).toLowerCase().indexOf(f) >= 0) {
          arr.push(input[i]);
        }
      }
    } else {
      //console.log('ordering.2');
      arr = input.slice(0);
    }

    arr.sort(function (a, b) {
      if ('A-Z' == order) {
        var a1 = $filter('translate')(a.title);
        var b1 = $filter('translate')(b.title);
        var dif = a1.localeCompare(b1);
        return dif;
      } else if ('Z-A' == order) {
        var a1 = $filter('translate')(a.title);
        var b1 = $filter('translate')(b.title);
        var dif = b1.localeCompare(a1);
        return dif;
      } else if ('Date' == order) {
        var a1 = a.fromTime ? a.fromTime : a.fromDate;
        var b1 = b.fromTime ? b.fromTime : b.fromDate;
        var dif = b1 - a1;
        return dif;
      } else if ('DateFrom' == order) {
        var a1 = a.fromTime ? a.fromTime : a.fromDate;
        var b1 = b.fromTime ? b.fromTime : b.fromDate;
        var dif = a1 - b1;
        return dif;
      } else if ('DateTo' == order) {
        var a1 = a.toTime ? a.toTime : a.toDate;
        var b1 = b.toTime ? b.toTime : b.toDate;
        var dif = a1 - b1;
        return dif;
      } else if ('Distance' == order) {
        var a1 = a.distance;
        var b1 = b.distance;
        return a1 - b1;
      } else if ('Stars' == order) {
        var a1 = a.stars || 0;
        var b1 = b.stars || 0;
        return b1 - a1;
      }
      return 0;
    });

    return arr;
  }
})
/*
/mainevents
/itineraries
/offices
*/
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'MenuCtrl'

    })
    .state('app.test', {
      url: "/test",
      views: {
        'menuContent': {
          templateUrl: "templates/test.html",
          controller: "TestCtrl"
        }
      }
    })
    .state('app.menulist', {
      url: "/menu/:groupId/",
      views: {
        'menuContent': {
          templateUrl: "templates/menu_list.html",
          controller: "MenuListCtrl"
        }
      }
    })
    .state('app.page', {
      url: "/page/:groupId/:menuId/:itemId",
      views: {
        'menuContent': {
          templateUrl: "templates/page.html",
          controller: "PageCtrl"
        }
      }
    })
    .state('app.itempage', {
      url: "/page/:groupId/:itemId",
      views: {
        'menuContent': {
          templateUrl: "templates/page.html",
          controller: "PageCtrl"
        }
      }
    })
    .state('app.sons', {
      url: "/page/:groupId/:menuId/:itemId/sons",
      views: {
        'menuContent': {
          templateUrl: "templates/page.html",
          controller: "PageCtrl"
        }
      },
      data: {
        sons: true
      }
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: "templates/home.html",
          controller: "HomeCtrl"
        }
      }
    })
    .state('app.favorites', {
      url: "/favorites",
      views: {
        'menuContent': {
          templateUrl: "templates/favorites_list.html",
          controller: "FavouritesListCtrl"
        }
      }
    })

  .state('app.mappa', {
    url: "/mappa",
    views: {
      'menuContent': {
        templateUrl: "templates/mappa.html",
        controller: 'MapCtrl'
      }
    }
  })

  .state('app.itineraries', {
    url: "/itineraries",
    views: {
      'menuContent': {
        templateUrl: "templates/itinerari.html",
        controller: 'ItinerariCtrl'
      }
    }
  })
  .state('app.itinerary', {
    url: "/itinerary/:itinerarioId",
    views: {
      'menuContent': {
        templateUrl: "templates/itinerario.html",
        controller: 'ItinerarioCtrl'
      }
    }
  })
  .state('app.itinerary.info', {
    url: "/info",
    views: {
      'itinerary-info': {
        templateUrl: "templates/itinerario-info.html",
        controller: 'ItinerarioInfoCtrl'
      }
    }
    ,data: { explicitBack: true }
  })
  .state('app.itinerary.steps', {
    url: "/steps/:poiId",
    views: {
      'itinerary-steps': {
        templateUrl: "templates/itinerario-tappe.html",
        controller: 'ItinerarioTappeCtrl'
      }
    }
    ,data: { explicitBack: true }
  })
  .state('app.itinerary.map', {
    url: "/map",
    views: {
      'itinerary-map': {
        templateUrl: "templates/itinerario-mappa.html",
        controller: 'ItinerarioMappaCtrl'
      }
    }
  })
  .state('app.itinstep', {
    url: "/itinstep/:itinerarioId/step/:poiId",
    views: {
      'menuContent': {
        templateUrl: "templates/itinerario-poi.html",
        controller: 'ItinerarioPoiCtrl'
      }
    }
    ,data: { explicitBack: true }
  });
  $urlRouterProvider.otherwise('/app/home'); // if none of the above states are matched, use this as the fallback
});
