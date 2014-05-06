// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

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

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html", controller: 'AppCtrl'
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html", controller: "HomeCtrl"
        }
      }
    })

    .state('app.info', {
      url: "/info",
      views: {
        'menuContent' :{
          templateUrl: "templates/info.html", controller: "InfoCtrl"
        }
      }
    })
    .state('app.storia', {
      url: "/storia",
      views: {
        'menuContent' :{
          templateUrl: "templates/storia.html", controller: "StoriaCtrl"
        }
      }
    })
    .state('app.bondone', {
      url: "/bondone",
      views: {
        'menuContent' :{
          templateUrl: "templates/bondone.html", controller: "BondoneCtrl"
        }
      }
    })

    .state('app.luoghi', {
      url: "/luoghi",
      views: {
        'menuContent' :{
          templateUrl: "templates/luoghi.html", controller: "LuoghiCtrl"
        }
      }
    })
    .state('app.luogo', {
      url: "/luoghi/:luogoId",
      views: {
        'menuContent' :{
          templateUrl: "templates/luogo.html", controller: 'LuogoCtrl'
        }
      }
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
    })
    .state('app.eventi', {
      url: "/eventi",
      views: {
        'menuContent' :{
          templateUrl: "templates/eventi.html", controller: 'EventiCtrl'
        }
      }
    })
    .state('app.evento', {
      url: "/eventi/:eventoId",
      views: {
        'menuContent' :{
          templateUrl: "templates/evento.html", controller: 'EventoCtrl'
        }
      }
    })
    .state('app.dormire', {
      url: "/dormire",
      views: {
        'menuContent' :{
          templateUrl: "templates/dormire.html", controller: 'DormireCtrl'
        }
      }
    })
    .state('app.dormo', {
      url: "/dormire/:dormoId",
      views: {
        'menuContent' :{
          templateUrl: "templates/dormo.html", controller: 'DormoCtrl'
        }
      }
    })
    .state('app.mangiare', {
      url: "/mangiare",
      views: {
        'menuContent' :{
          templateUrl: "templates/mangiare.html", controller: 'MangiareCtrl'
        }
      }
    })
    .state('app.mangio', {
      url: "/mangiare/:mangioId",
      views: {
        'menuContent' :{
          templateUrl: "templates/mangio.html", controller: 'MangioCtrl'
        }
      }
    })
    .state('app.servizi', {
      url: "/servizi",
      views: {
        'menuContent' :{
          templateUrl: "templates/servizi.html", controller: 'ServiziCtrl'
        }
      }
    })
    .state('app.servizio', {
      url: "/servizi/:servizioId",
      views: {
        'menuContent' :{
          templateUrl: "templates/servizio.html", controller: 'ServizioCtrl'
        }
      }
    })
    .state('app.foto', {
      url: "/foto",
      views: {
        'menuContent' :{
          templateUrl: "templates/foto.html"
        }
      }
    })
    .state('app.video', {
      url: "/video",
      views: {
        'menuContent' :{
          templateUrl: "templates/video.html"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

