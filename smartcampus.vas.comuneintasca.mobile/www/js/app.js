// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ilcomuneintasca' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ilcomuneintasca', [
  'ionic', 
  'ilcomuneintasca.controllers.common',
  'ilcomuneintasca.controllers.home',
  'ilcomuneintasca.controllers.events',
  'ilcomuneintasca.controllers.places',
  'ilcomuneintasca.controllers.itineraries',
  'ilcomuneintasca.controllers.hospitality',
  'ilcomuneintasca.services.conf',
  'ilcomuneintasca.services.date',
  'ilcomuneintasca.services.list',
  'ilcomuneintasca.services.geo',
  'ilcomuneintasca.services.map',
  'ilcomuneintasca.services.db',
  'ilcomuneintasca.services.fs',
  'ilcomuneintasca.filters',
  'ilcomuneintasca.directives',
  'localization',
  'google-maps',
  'ngQueue'
])

.run(function ($ionicPlatform, $rootScope, $window, DatiDB, GeoLocate, Config, $location) {
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

  var browserLanguage = '';
  // works for earlier version of Android (2.3.x)
  var androidLang;
  if ($window.navigator && $window.navigator.userAgent && (androidLang = $window.navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
    browserLanguage = androidLang[1];
  } else {
    // works for iOS, Android 4.x and other devices
    browserLanguage = $window.navigator.userLanguage || $window.navigator.language;
  }

  var lang = browserLanguage.substring(0, 2);
  if (lang != 'it' && lang != 'en' && lang != 'de') {
    $rootScope.lang = 'en';
  } else {
    $rootScope.lang = lang;
  }

  $rootScope.goto = function (link) {
    if (link.indexOf('/app/')!=0) link='/app/'+link;
    $location.path(link);
  };

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
    .state('app.cate', {
      url: "/cate/:cateId",
      views: {
        'menuContent': {
          templateUrl: "templates/contentcates_list.html",
          controller: "CategoriesListCtrl"
        }
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
    .state('app.favourites', {
      url: "/favourites",
      views: {
        'menuContent': {
          templateUrl: "templates/favourites_list.html",
          controller: "FavouritesListCtrl"
        }
      }
    })
    .state('app.contentscatelist', {
      url: "/contentscatelist/:contentsCate",
      views: {
        'menuContent': {
          templateUrl: "templates/contents_list.html",
          controller: "ContentsListCtrl"
        }
      }
    })
    .state('app.contentscate', {
      url: "/contentscate/:contentsCate",
      views: {
        'menuContent': {
          templateUrl: "templates/contents_page.html",
          controller: "ContentsListCtrl"
        }
      }
    })
    .state('app.contents', {
      url: "/contents/:contentsIds",
      views: {
        'menuContent': {
          templateUrl: "templates/contents_page.html",
          controller: "ContentsListCtrl"
        }
      }
    })
    .state('app.content', {
      url: "/content/:contentId",
      views: {
        'menuContent': {
          templateUrl: "templates/content.html",
          controller: "ContentCtrl"
        }
      }
    })

  .state('app.hotels', {
    url: "/hotels",
    views: {
      'menuContent': {
        templateUrl: "templates/hotels_list.html",
        controller: "HotelsListCtrl"
      }
    }
  })
    .state('app.hotel', {
      url: "/hotel/:hotelId",
      views: {
        'menuContent': {
          templateUrl: "templates/hotel.html",
          controller: "HotelCtrl"
        }
      }
    })
    .state('app.restaurants', {
      url: "/restaurants",
      views: {
        'menuContent': {
          templateUrl: "templates/restaurants_list.html",
          controller: "RestaurantsListCtrl"
        }
      }
    })
    .state('app.restaurant', {
      url: "/restaurant/:restaurantId",
      views: {
        'menuContent': {
          templateUrl: "templates/restaurant.html",
          controller: "RestaurantCtrl"
        }
      }
    })

  .state('app.mainevents', {
    url: "/mainevents",
    views: {
      'menuContent': {
        templateUrl: "templates/mainevents_list.html",
        controller: "MainEventsListCtrl"
      }
    }
  })
    .state('app.mainevent', {
      url: "/mainevent/:maineventId",
      views: {
        'menuContent': {
          templateUrl: "templates/mainevent.html",
          controller: "MainEventCtrl"
        }
      }
    })

  .state('app.places', {
    url: "/places/:placeType",
    views: {
      'menuContent': {
        templateUrl: "templates/places_list.html",
        controller: "PlacesListCtrl"
      }
    }
  })
    .state('app.place', {
      url: "/place/:placeId",
      views: {
        'menuContent': {
          templateUrl: "templates/place.html",
          controller: "PlaceCtrl"
        }
      }
    })
    .state('app.events', {
      url: "/events/:eventType",
      views: {
        'menuContent': {
          templateUrl: "templates/events_list2.html",
          controller: 'EventsListCtrl'
        }
      }
    })
    .state('app.event', {
      url: "/event/:eventId",
      views: {
        'menuContent': {
          templateUrl: "templates/event.html",
          controller: 'EventCtrl'
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
  $urlRouterProvider
    .when("/menu/:gid/:cid", function ($match, Config, $location) {
      Config.menu().then(function(menu) {
        var group=menu[$match.gid];
        var item=group.items[$match.cid];
        var newstate=item.path;
        $location.path(item.path);
      });
      return true;
    })
    .otherwise('/app/home'); // if none of the above states are matched, use this as the fallback
});
