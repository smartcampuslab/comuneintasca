angular.module('starter.controllers', ['google-maps'])

.controller('MenuCtrl', function ($scope, $rootScope, DatiDB, Config, GeoLocate) {
  var browserLanguage = window.navigator.userLanguage || window.navigator.language;
  // alert(browserLanguage);
  var lang = browserLanguage.substring(0, 2);
  if (lang != 'it' && lang != 'en' && lang != 'de') {
    $rootScope.lang = 'en';
  } else {
    $rootScope.lang = lang;
  }
  DatiDB.sync();
  $scope.poiTypes = Config.poiTypesList();
  $scope.eventTypes = Config.eventTypesList();
})
  .controller('HomeCtrl', function ($scope, Files) {
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

.controller('FavouritesListCtrl', function ($scope, DatiDB) {
  DatiDB.getFavorites().then(function(data){
    $scope.favourites = data;
  });
})

.controller('HotelsListCtrl', function ($scope, $stateParams, Sort, DatiDB, Config) {
  if ($stateParams.hotelType) {
    if ($stateParams.hotelType=='hotel') {
      $scope.orderingTypes = ['A-Z', 'Z-A', 'Distance', 'Stars'];
    } else {
      $scope.orderingTypes = ['A-Z', 'Z-A', 'Distance'];
    }
    $scope.ordering = $scope.orderingTypes[2];
    $scope.showSortPopup = function () {
      Sort.openSortPopup($scope, $scope.orderingTypes, $scope.ordering, function (res) {
        if (res) $scope.ordering = res;
      });
    };

    $scope.cate = Config.hotelCateFromType($stateParams.hotelType);
    $scope.gotdata = DatiDB.cate('hotel', $scope.cate.it).then(function (data) {
      $scope.hotels = data;
    });

    $scope._ = _;
  } else {
    $scope.hotelcates=Config.hotelTypesList();
    /*
    $scope.gotdata = DatiDB.all('hotel').then(function (data) {
      $scope.hotels = data;
    });
    */
  }
})

.controller('HotelCtrl', function ($scope, $stateParams, DatiDB) {
  $scope.gotdata = DatiDB.get('hotel', $stateParams.hotelId).then(function (data) {
    $scope.obj = data;
  });
})

.controller('RestaurantsListCtrl', function ($scope, $stateParams, Sort, DatiDB, Config) {
  if ($stateParams.restaurantType) {
    $scope.orderingTypes = ['A-Z', 'Z-A', 'Distance'];
    $scope.ordering = $scope.orderingTypes[2];
    $scope.showSortPopup = function () {
      Sort.openSortPopup($scope, $scope.orderingTypes, $scope.ordering, function (res) {
        if (res) $scope.ordering = res;
      });
    };

    $scope.cate = Config.restaurantCateFromType($stateParams.restaurantType);
    $scope.gotdata = DatiDB.cate('restaurant', $scope.cate.it).then(function (data) {
      $scope.restaurants = data;
    });
  } else {
    $scope.restaurantcates=Config.restaurantTypesList();
    /*
    $scope.gotdata = DatiDB.all('restaurant').then(function (data) {
      $scope.restaurants = data;
    });
    */
  }
})

.controller('RestaurantCtrl', function ($rootScope, $scope, $stateParams, DatiDB) {
  $scope.gotdata = DatiDB.get('restaurant', $stateParams.restaurantId).then(function (data) {
    $scope.lang = $rootScope.lang;
    $scope.obj = data;
  });
})

.controller('PlacesListCtrl', function ($scope, $stateParams, Sort, DatiDB, Config) {
  $scope.orderingTypes = ['A-Z', 'Z-A', 'Distance'];
  $scope.ordering = $scope.orderingTypes[2];
  $scope.showSortPopup = function () {
    Sort.openSortPopup($scope, $scope.orderingTypes, $scope.ordering, function (res) {
      if (res) $scope.ordering = res;
    });
  };

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
	  $scope.obj = data;
      if (data.location) {
        GeoLocate.locate().then(function (latlon) {
          $scope.distance = GeoLocate.distance(latlon, data.location);
        });
      } else {
        console.log('no known location for place');
      }
    });
  })


.controller('EventsListCtrl', function ($scope, $stateParams, DatiDB, Config, Sort) {
  $scope.dateFormat = 'EEEE d MMMM yyyy';
  $scope.orderingTypes = ['A-Z', 'Z-A', 'Date'];
  $scope.ordering = $scope.orderingTypes[2];
  $scope.showSortPopup = function () {
    Sort.openSortPopup($scope, $scope.orderingTypes, $scope.ordering, function (res) {
      if (res) $scope.ordering = res;
    });
  }
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
  $scope.dateFormat = 'EEEE d MMMM yyyy';

  $scope.gotdata = DatiDB.get('event', $stateParams.eventId).then(function (data) {
    $scope.obj = data;
  });
})

.controller('MainEventsListCtrl', function ($scope, Sort, DatiDB) {
  $scope.orderingTypes = ['A-Z', 'Z-A', 'Date'];
  $scope.ordering = $scope.orderingTypes[0];
  $scope.showSortPopup = function () {
    Sort.openSortPopup($scope, $scope.orderingTypes, $scope.ordering, function (res) {
      if (res) $scope.ordering = res;
    });
  };

  $scope.gotdata = DatiDB.all('mainevent').then(function (data) {
    $scope.mainevents = data;
  });
})
  .controller('MainEventCtrl', function ($scope, DatiDB, $stateParams) {
    $scope.gotdata = DatiDB.get('mainevent', $stateParams.maineventId).then(function (data) {
      $scope.obj = data;
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
    $scope.markers.models = [];
    angular.forEach(data, function (luogo, idx) {
      if (luogo.location) {
        /*m = new mxn.Marker(new mxn.LatLonPoint(luogo.location[0], luogo.location[1]));
        m.setIcon('img/mapmarker.png', [25, 40], [25 / 2, 40 / 2]);
        m.setInfoBubble(luogo.title.it);
        map1.addMarker(m);*/
        luogo.latitude = luogo.location[0];
        luogo.longitude = luogo.location[1];
        $scope.markers.models.push()
      }
    });
    // map1.autoCenterAndZoom();
  });
})

.controller('ItinerariCtrl', function ($scope, DatiDB, Sort) {
  $scope.orderingTypes = ['A-Z', 'Z-A'];
  $scope.ordering = $scope.orderingTypes[0];
  $scope.showSortPopup = function () {
    Sort.openSortPopup($scope, $scope.orderingTypes, $scope.ordering, function (res) {
      if (res) $scope.ordering = res;
    });
  };
  $scope.gotdata = DatiDB.all('itinerary').then(function (data) {
    $scope.itinerari = data;
  });
})

.controller('ItinerarioCtrl', function ($scope, DatiDB, $stateParams) {
  $scope.itinerarioId = $stateParams.itinerarioId;
  $scope.gotdata = DatiDB.get('itinerary', $stateParams.itinerarioId).then(function (data) {
    $scope.itinerario = data;
    DatiDB.get('poi', data.steps.join()).then(function (luoghi) {
      $scope.tappe = luoghi;
	  $scope.location = luoghi[0].location;
    });
  });
})

.controller('ItinerarioInfoCtrl', function ($scope, DatiDB, $stateParams) {})

.controller('ItinerarioTappeCtrl', function ($scope, DatiDB, $stateParams) {})

.controller('ItinerarioMappaCtrl', function ($scope, DatiDB, $stateParams) {
  $scope.map = {
    control: {},
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
    poly: [{
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

  $scope.polylineOptions = {
    strokeColor: '#ff0000',
    strokeWeight: 3,
    strokeOpacity: 1.0,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: true,
    visible: true
  };

  $scope.polyline = {
    stroke: {
      color: $scope.polylineOptions.strokeColor,
      weight: $scope.polylineOptions.strokeWeight,
      opacity: $scope.polylineOptions.strokeOpacity
    },
    clickable: $scope.polylineOptions.clickable,
    draggable: $scope.polylineOptions.draggable,
    editable: $scope.polylineOptions.editable,
    geodesic: $scope.polylineOptions.geodesic,
    visible: $scope.polylineOptions.visible
  };

  /*
   * google.maps.TravelMode.DRIVING (Default)
   * google.maps.TravelMode.BICYCLING
   * google.maps.TravelMode.TRANSIT
   * google.maps.TravelMode.WALKING
  $scope.directionsOptions = {
    directionsServiceOptions: {
      travelMode: google.maps.TravelMode.WALKING
    },
    directionsRendererOptions: {
      suppressMarkers: true,
      polylineOptions: $scope.polylineOptions
    }
  };
   */

  $scope.showInfoWindow = false;

/*
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer($scope.directionsOptions.directionsRendererOptions);

  var drawDirections = function (control, models, caller) {
    if (!!control && !!models && models.length >= 2) {
      var max = 10;
      var splittedModels = [];
      var array = new Array();
      for (var i = 0; i < models.length; i++) {
        if (array.length == 0 && i > 0) {
          i--;
        }
        array.push(models[i]);
        if (array.length == max || (i + 1) == models.length) {
          splittedModels.push(array);
          array = new Array();
        }
      }

      for (var i = 0; i < splittedModels.length; i++) {
        var partialModels = splittedModels[i];

        var origin = new google.maps.LatLng(partialModels[0].latitude, partialModels[0].longitude);
        var destination = new google.maps.LatLng(partialModels[partialModels.length - 1].latitude, partialModels[partialModels.length - 1].longitude);
        var waypoints = [];

        if (partialModels.length > 2) {
          for (var j = 1; j < (partialModels.length - 1); j++) {
            var waypoint = {
              location: new google.maps.LatLng(partialModels[j].latitude, partialModels[j].longitude)
            };
            waypoints.push(waypoint);
          }
        }

        var request = {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: $scope.directionsOptions.directionsServiceOptions.travelMode
        };
        directionsService.route(request, function (result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay = new google.maps.DirectionsRenderer($scope.directionsOptions.directionsRendererOptions);
            directionsDisplay.setMap(control.getGMap());
            directionsDisplay.setDirections(result);

            if (!!caller) alert(caller);
          }
        });
      }
    }
  }
*/
  // map2 = new mxn.Mapstraction('map2', 'openlayers');
  DatiDB.get('itinerary', $stateParams.itinerarioId).then(function (data) {
    $scope.markers.poly = [];
    angular.forEach(data.stepLines, function (line) {
		var points = google.maps.geometry.encoding.decodePath(line);
		angular.forEach(points, function (p) {
		  $scope.markers.poly.push({latitude:p.lat(),longitude:p.lng()});
		});
	});
  
    DatiDB.get('poi', data.steps.join()).then(function (luoghi) {
      $scope.markers.models = [];

      angular.forEach(luoghi, function (luogo, idx) {
        // for (var i = 0; i < luoghi.length; i++) {
        console.log(luogo.title.it);
        if (!!luogo.location) {
          /*m = new mxn.Marker(new mxn.LatLonPoint(luogo.location[0], luogo.location[1]));
          m.setIcon('img/mapmarker.png', [25, 40], [25 / 2, 40 / 2]);
          m.setInfoBubble(luogo.title.it);
          map2.addMarker(m);*/

          luogo.latitude = luogo.location[0];
          luogo.longitude = luogo.location[1];
        } else {
          console.log('WARNING: no location for "' + luogo.title.it + '"');
          luogo.latitude = 0;
          luogo.longitude = 0;
        }
        $scope.markers.models[data.steps.indexOf(luogo.id)] = luogo;
      });

      // drawDirections($scope.map.control, $scope.markers.models);

      /*setTimeout(function () {
      map2.autoCenterAndZoom();
    }, 500);*/
    });
  });
})
