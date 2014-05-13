// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters', 'starter.directives', 'localization'])

.run(function($ionicPlatform, $rootScope) {
    if (typeof(Number.prototype.toRad) === "undefined") {
      Number.prototype.toRad = function() {
        return this * Math.PI / 180;
      }
    }
    $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.hide();
    }
  });
  // global functions for toolbox
  $rootScope.extLink = function(url) {
	window.open(url,'_system');
  } 
  $rootScope.email = function(to) {
	window.plugin.email.open({to: [to]});
  }
  $rootScope.hasNav = function(loc) {
	return loc != null;
  }
  $rootScope.bringmethere = function(loc) {
    if(device.platform == "Android"){
		window.open("http://maps.google.com/maps?daddr="+loc[0]+","+loc[1],"_system");	
    }else if(device.platform == "iOS"){
        var url = "maps:daddr="+loc[0]+","+loc[1];                
        successFn();
        window.location = url;
    }else{
		console.error("Unknown platform");
    }			
  }
  $rootScope.share = function(text, webUrl, imgUrl) {
	window.plugins.socialsharing.share(text, null, imgUrl, webUrl);
  }

})
/*
/mainevents
/itineraries
/offices
*/
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
        url:"/app", abstract:true, templateUrl:"templates/menu.html", controller:'MenuCtrl'

    })
    .state('app.home', {
        url:"/home", views:{ 'menuContent':{
            templateUrl:"templates/home.html", controller:"HomeCtrl"
        } }
    })
    .state('app.contentscate', {
        url:"/contentscate/:contentsCate", views:{ 'menuContent':{
            templateUrl:"templates/contents_page.html",  controller:"ContentsListCtrl"
        } }
    })
    .state('app.contents', {
        url:"/contents/:contentsIds", views:{ 'menuContent':{
            templateUrl:"templates/contents_page.html", controller:"ContentsListCtrl"
        } }
    })
    .state('app.content', {
        url:"/content/:contentId", views:{ 'menuContent':{
            templateUrl:"templates/content.html",  controller:"ContentCtrl"
        } }
    })

    .state('app.services', {
        url:"/services", views:{ 'menuContent':{
            templateUrl:"templates/contents_list.html", controller:"ContentsListCtrl"
        } }, data:{ contentsCate:'Servizi' }
    })

    .state('app.hotelcates', {
        url:"/hotels", views:{ 'menuContent':{
            templateUrl:"templates/hotels.html", controller:"HotelsListCtrl"
        } }
    })
    .state('app.hotels', {
        url:"/hotels/:hotelType", views:{ 'menuContent':{
            templateUrl:"templates/hotels_list.html", controller:"HotelsListCtrl"
        } }
    })
    .state('app.hotel', {
        url:"/hotel/:hotelId", views:{ 'menuContent':{
            templateUrl:"templates/hotel.html", controller:"HotelCtrl"
        } }
    })
    .state('app.restaurantcates', {
        url:"/restaurants", views:{ 'menuContent':{
            templateUrl:"templates/restaurants.html", controller:"RestaurantsListCtrl"
        } }
    })
    .state('app.restaurants', {
        url:"/restaurants/:restaurantType", views:{ 'menuContent':{
            templateUrl:"templates/restaurants_list.html", controller:"RestaurantsListCtrl"
        } }
    })
    .state('app.restaurant', {
        url:"/restaurant/:restaurantId", views:{ 'menuContent':{
            templateUrl:"templates/restaurant.html", controller:"RestaurantCtrl"
        } }
    })

    .state('app.mainevents', {
        url:"/mainevents", views:{ 'menuContent':{
            templateUrl:"templates/mainevents_list.html", controller:"MainEventsListCtrl"
        } }
    })
    .state('app.mainevent', {
        url:"/mainevent/:maineventId", views:{ 'menuContent':{
            templateUrl:"templates/mainevent.html", controller:"MainEventCtrl"
        } }
    })

    .state('app.places', {
        url:"/places/:placeType", views:{ 'menuContent':{
            templateUrl:"templates/places_list.html", controller:"PlacesListCtrl"
        } }
    })
    .state('app.place', {
        url:"/place/:placeId", views:{ 'menuContent':{
            templateUrl:"templates/place.html", controller:"PlaceCtrl"
        } }
    })
    .state('app.events', {
        url: "/events/:eventType", views: { 'menuContent' :{
          templateUrl: "templates/events_list.html", controller: 'EventsListCtrl'
        } }
    })
    .state('app.event', {
        url: "/event/:eventId", views: { 'menuContent' :{
          templateUrl: "templates/event.html", controller: 'EventCtrl'
        } }
    })


    .state('app.mappa', {
      url: "/mappa",
      views: {
        'menuContent' :{
          templateUrl: "templates/mappa.html", controller: 'MappaCtrl'
        }
      }
    })
    .state('app.itineraries', {
      url: "/itineraries",
      views: {
        'menuContent' :{
          templateUrl: "templates/itinerari.html", controller: 'ItinerariCtrl'
        }
      }
    })
    .state('app.itinerary', {
      url: "/itinerary/:itinerarioId",
      views: {
        'menuContent' :{
          templateUrl: "templates/itinerario.html", controller: 'ItinerarioCtrl'
        }
      }
    })
    .state('app.itinerary.info', {
      url: "/info",
      views: {
        'itinerary-info' :{
          templateUrl: "templates/itinerario-info.html", controller: 'ItinerarioInfoCtrl'
        }
      }
    })
    .state('app.itinerary.steps', {
      url: "/steps",
      views: {
        'itinerary-steps' :{
          templateUrl: "templates/itinerario-tappe.html", controller: 'ItinerarioTappeCtrl'
        }
      }
    })
    .state('app.itinerary.step', {
      url: "/step/:placeId",
      views: {
        'itinerary-steps' :{
          templateUrl: "templates/place.html", controller: 'PlaceCtrl'
        }
      }
    })
    .state('app.itinerary.map', {
      url: "/map",
      views: {
        'itinerary-map' :{
          templateUrl: "templates/itinerario-mappa.html", controller: 'ItinerarioMappaCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

