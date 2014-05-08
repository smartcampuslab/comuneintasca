// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters', 'starter.directives'])

.run(function($ionicPlatform) {
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
})
/*
/mainevents
/places/museums
/places/buildings
/places/churches
/places/acheo
/places/parks
/places/misc
/itineraries
/events/fairs
/events/conferences
/events/shows
/events/exhibitions
/events/misc
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
    .state('app.hotels', {
        url:"/hotels", views:{ 'menuContent':{
            templateUrl:"templates/hotels_list.html", controller:"HotelsListCtrl"
        } }
    })
    .state('app.hotel', {
        url:"/hotel/:hotelId", views:{ 'menuContent':{
            templateUrl:"templates/hotel.html", controller:"HotelCtrl"
        } }
    })
    .state('app.restaurants', {
        url:"/restaurants", views:{ 'menuContent':{
            templateUrl:"templates/restaurants_list.html", controller:"RestaurantsListCtrl"
        } }
    })
    .state('app.restaurant', {
        url:"/restaurant/:restaurantId", views:{ 'menuContent':{
            templateUrl:"templates/restaurant.html", controller:"RestaurantCtrl"
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
    .state('app.itinerari', {
      url: "/itinerari",
      views: {
        'menuContent' :{
          templateUrl: "templates/itinerari.html", controller: 'ItinerariCtrl'
        }
      }
    })
    .state('app.itinerario', {
      url: "/itinerari/:itinerarioId",
      views: {
        'menuContent' :{
          templateUrl: "templates/itinerario.html", controller: 'ItinerarioCtrl'
        }
      }
    })
    .state('app.itinerario.info', {
      url: "/info",
      views: {
        'itinerario-info' :{
          templateUrl: "templates/itinerario-info.html", controller: 'ItinerarioInfoCtrl'
        }
      }
    })
    .state('app.itinerario.tappe', {
      url: "/tappe",
      views: {
        'itinerario-tappe' :{
          templateUrl: "templates/itinerario-tappe.html", controller: 'ItinerarioTappeCtrl'
        }
      }
    })
    .state('app.itinerario.tappa', {
      url: "/tappe/:luogoId",
      views: {
        'itinerario-tappe' :{
          templateUrl: "templates/luogo.html", controller: 'LuogoCtrl'
        }
      }
    })
    .state('app.itinerario.mappa', {
      url: "/mappa",
      views: {
        'itinerario-mappa' :{
          templateUrl: "templates/itinerario-mappa.html", controller: 'ItinerarioMappaCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

