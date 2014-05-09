angular.module('starter.controllers', ['google-maps'])

.controller('MenuCtrl', function($scope, $rootScope, DatiDB) {
	var broserLanguage = window.navigator.userLanguage || window.navigator.language;
	var lang=broserLanguage.substring(0,2);
	if (lang!='it' && lang!='en' && lang!='de') {
        $rootScope.lang='en';
    } else {
        $rootScope.lang=lang;
    }
    DatiDB.sync();
})
.controller('HomeCtrl', function($scope, Files) {
/*
$scope.show = function() {

   // Show the action sheet
   $ionicActionSheet.show({
     buttons: [
       { text: '<b>Share</b> This' },
       { text: 'Move' },
     ],
     destructiveText: 'Delete',
     titleText: 'Modify your album',
     cancelText: 'Cancel',
     buttonClicked: function(index) {
       return true;
     }
   });

 };
*/
//    $state.go('contact.detail')
})

.controller('ContentCtrl', function ($scope, $state, $stateParams, DatiDB) {
  if ($stateParams.contentId) {
    contentId = $stateParams.contentId;
  } else {
    contentId = $state.current.data.contentId
  }
  $scope.gotdata = DatiDB.get('content', contentId).then(function (data) {
    $scope.content = data;
  });
})

.controller('ContentsListCtrl', function ($scope, $state, $stateParams, DatiDB) {
  if ($stateParams.contentsCate) {
    $scope.gotdata = DatiDB.cate('content', $stateParams.contentsCate).then(function (data) {
      $scope.contents = data;
    });
  } else if ($stateParams.contentsIds) {
    $scope.gotdata = DatiDB.get('content', $stateParams.contentsIds).then(function (data) {
      $scope.contents = data;
    });
  } else if ($state.current.data.contentsCate) {
    $scope.gotdata = DatiDB.cate('content', $state.current.data.contentsCate).then(function (data) {
      $scope.contents = data;
    });
  } else {
    $scope.gotdata = DatiDB.get('content', $state.current.data.contentsIds).then(function (data) {
      $scope.contents = data;
    });
  }
})

.controller('HotelsListCtrl', function ($scope, DatiDB) {
  $scope.gotdata = DatiDB.all('hotel').then(function (data) {
    $scope.hotels = data;
  });
})

.controller('HotelCtrl', function ($scope, $stateParams, DatiDB) {
  $scope.gotdata = DatiDB.get('hotel', $stateParams.hotelId).then(function (data) {
    $scope.hotel = data;
  });
})

.controller('RestaurantsListCtrl', function ($scope, DatiDB) {
  $scope.gotdata = DatiDB.all('restaurant').then(function (data) {
    $scope.restaurants = data;
  });
})

.controller('RestaurantCtrl', function ($scope, $stateParams, DatiDB) {
  $scope.gotdata = DatiDB.get('restaurant', $stateParams.restaurantId).then(function (data) {
    $scope.restaurant = data;
  });
})

.controller('PlacesListCtrl', function ($scope, $stateParams, DatiDB, Config) {
  if ($stateParams.placeType) {
    $scope.cate = Config.poiCateFromType($stateParams.placeType);
    $scope.gotdata = DatiDB.cate('poi', $scope.cate.it).then(function (data) {
      $scope.places = data;
    });
  } else {
    $scope.gotdata = DatiDB.all('poi').then(function (data) {
      $scope.places = data;
    });
  }
})
  .controller('PlaceCtrl', function ($scope, DatiDB, GeoLocate, $stateParams) {
    $scope.gotdata = DatiDB.get('poi', $stateParams.placeId).then(function (data) {
      $scope.place = data;
      if (data.location) {
        GeoLocate.locate().then(function (latlon) {
          $scope.distance = GeoLocate.distance(latlon, data.location);
        });
      } else {
        console.log('no known location for place');
      }
    });
  })


.controller('EventsListCtrl', function ($scope, $stateParams, DatiDB, Config) {
  if ($stateParams.eventType) {
    $scope.cate = Config.eventCateFromType($stateParams.eventType);
    $scope.gotdata = DatiDB.cate('event', $scope.cate.it).then(function (data) {
      $scope.events = data;
    });
  } else {
    $scope.gotdata = DatiDB.all('event').then(function (data) {
      $scope.events = data;
    });
  }
})

.controller('EventCtrl', function ($scope, DatiDB, $stateParams) {
  $scope.gotdata = DatiDB.get('event', $stateParams.eventId).then(function (data) {
    $scope.event = data;
  });
})

.controller('MappaCtrl', function ($scope, DatiDB) {
  $scope.map = {
    draggable: 'true',
    center: {
      latitude: 0,
      longitude: 0
    },
    zoom: 8
  };

  $scope.markers = {
    models: [],
    coords: 'self',
    fit: true,
    // icon: 'img/mapmarker.png',
    // click: 'openInfoWindow($markerModel)',
    doCluster: true
  };

  $scope.showInfoWindow = false;

  /* Components used only for the single infowindow, not working now :( */
  $scope.infoWindow = {
    show: false,
    coords: null,
    content: '',
    isIconVisibleOnClick: true,
    options: null,
  };

  $scope.openInfoWindow = function ($markerModel) {
    $scope.infoWindow.coords = {
      latitude: $markerModel.latitude,
      longitude: $markerModel.longitude
    };
    $scope.infoWindow.content = $markerModel.latitude + ',' + $markerModel.longitude + '\n' + $markerModel.title.it;
    $scope.infoWindow.options = {
      content: $scope.infoWindow.content
    };
    $scope.infoWindow.show = true;
    alert($scope.infoWindow.content);
  };

  $scope.closeInfoWindow = function () {
    $scope.infoWindow.show = false;
    $scope.infoWindow.coords = null;
    $scope.infoWindow.options = null;
  };
  /* [END] Components used only for the single infowindow, not working now :( */

  // map1 = new mxn.Mapstraction('map1', 'openlayers');
  DatiDB.all('poi').then(function (data) {
    angular.forEach(data, function (luogo, idx) {
      if (luogo.location) {
        /*m = new mxn.Marker(new mxn.LatLonPoint(luogo.location[0], luogo.location[1]));
        m.setIcon('img/mapmarker.png', [25, 40], [25 / 2, 40 / 2]);
        m.setInfoBubble(luogo.title.it);
        map1.addMarker(m);*/
        luogo.latitude = luogo.location[0];
        luogo.longitude = luogo.location[1];
      }
    });
    // map1.autoCenterAndZoom();
    $scope.markers.models = data;
  });
})

.controller('ItinerariCtrl', function ($scope, DatiDB) {
  DatiDB.all('itinerary').then(function (data) {
    $scope.itinerari = data;
  });
})

.controller('ItinerarioCtrl', function ($scope, DatiDB, $stateParams) {
  $scope.itinerarioId = $stateParams.itinerarioId;
  DatiDB.get('itinerary', $stateParams.itinerarioId).then(function (data) {
    $scope.itinerario = data;
    DatiDB.get('poi', data.steps.join()).then(function (luoghi) {
      $scope.tappe = luoghi;
    });
  });
})

.controller('ItinerarioInfoCtrl', function ($scope, DatiDB, $stateParams) {})

.controller('ItinerarioTappeCtrl', function ($scope, DatiDB, $stateParams) {})

.controller('ItinerarioMappaCtrl', function ($scope, DatiDB, $stateParams) {
  $scope.map = {
    draggable: 'true',
    center: {
      latitude: 0,
      longitude: 0
    },
    zoom: 8
  };

  /* Very dirty workaround!!! */
  $scope.markers = {
    models: [{
      latitude: 0,
      longitude: 0
    }, {
      latitude: 0,
      longitude: 0
    }],
    coords: 'self',
    fit: true,
    // icon: 'img/mapmarker.png',
    // click: 'openInfoWindow($markerModel)',
    doCluster: false
  };

  $scope.polyline = {
    stroke: {
      color: '#ff0000',
      weight: 3,
      opacity: 1.0
    },
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: true,
    visible: true
  };

  $scope.showInfoWindow = false;

  // map2 = new mxn.Mapstraction('map2', 'openlayers');
  DatiDB.get('itinerary', $stateParams.itinerarioId).then(function (data) {
    DatiDB.get('poi', data.steps.join()).then(function (luoghi) {
      angular.forEach(luoghi, function (luogo, idx) {
        console.log(luogo.title.it);
        if (luogo.location) {
          /*m = new mxn.Marker(new mxn.LatLonPoint(luogo.location[0], luogo.location[1]));
          m.setIcon('img/mapmarker.png', [25, 40], [25 / 2, 40 / 2]);
          m.setInfoBubble(luogo.title.it);
          map2.addMarker(m);*/

          luogo.latitude = luogo.location[0];
          luogo.longitude = luogo.location[1];
        } else {
          console.log('no location');
        }
      });
      $scope.markers.models = luoghi;
    });
    /*setTimeout(function () {
      map2.autoCenterAndZoom();
    }, 500);*/
  });
})
