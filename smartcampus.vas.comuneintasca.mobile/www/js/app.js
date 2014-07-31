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
  'google-maps',
  'ngQueue'
])

.run(function ($ionicPlatform, $rootScope, DatiDB, GeoLocate, Config, $location) {
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
    //setTimeout(function(){ navigator.splashscreen.hide(); },10000);
  });
  GeoLocate.locate().then(function (position) {
    $rootScope.myPosition = position;
    //console.log('first geolocation: ' + $rootScope.myPosition);
  }, function () {
    console.log('CANNOT LOCATE!');
  });

  var lang = Config.getLang();
  if (localStorage.lang && localStorage.lang!=lang) {
    lang=localStorage.lang;
    console.log('language configured: '+lang);
  } else {
    console.log('language detected: '+lang);
  }
  $rootScope.lang=localStorage.lang=lang;

  $rootScope.goto = function (link) {
    if (link.indexOf('/app/')!=0) link='/app/'+link;
    $location.path(link);
  };
  $rootScope.getMenuPath = function (group,menu) {
    if (group.id=='itins' && menu.id=='itineraries') {
      return 'itineraries';
    } else {
      return 'page/'+group.id+'/'+menu.id+'/';
    }
  }
  $rootScope.gotoSubpath = function (subpath) {
    $location.path($location.path()+subpath);
  }

  $rootScope.getListItemHeight = function (item, index) {
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
    window.plugins.socialsharing.share(text, null, imgUrl, webUrl);
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
    })
    .state('app.itinerary.steps', {
      url: "/steps",
      views: {
        'itinerary-steps': {
          templateUrl: "templates/itinerario-tappe.html",
          controller: 'ItinerarioTappeCtrl'
        }
      }
    })
    .state('app.itinerary_step', {
      url: "/itineraryplace/:placeId",
      views: {
        'menuContent': {
          templateUrl: "templates/place.html",
          controller: 'PlaceCtrl'
        }
      },
      data: {
        explicitBack: true
      }
    })
    .state('app.itinerary.map', {
      url: "/map",
      views: {
        'itinerary-map': {
          templateUrl: "templates/itinerario-mappa.html",
          controller: 'ItinerarioMappaCtrl'
        }
      }
    });
  $urlRouterProvider.otherwise('/app/home'); // if none of the above states are matched, use this as the fallback
});
