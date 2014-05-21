angular.module('starter.controllers', ['google-maps'])

.controller('MenuCtrl', function ($scope) {
  $scope.shownGroup = null;

  $scope.showGroup = function (groupId) {
    if (groupId != $scope.shownGroup) {
      $scope.shownGroup = groupId;
    } else {
      $scope.shownGroup = null;
    }
  };

  $scope.isGroupShown = function (groupId) {
    return $scope.shownGroup == groupId;
  };
})

.controller('HomeCtrl', function ($scope, DatiDB, $filter,$ionicSlideBoxDelegate, $location) {
  $scope.slides = null;
  $scope.goToItem = function(link) {
    var p = link.substring(1);
    $location.path(p);
  }
  DatiDB.sync().then(function(data) {
    var homeObject = JSON.parse(localStorage.homeObject);
    var homeObjects = homeObject.contentIds;
    DatiDB.getAny(homeObjects).then(function(data){
      var slides = [];
      for (var i = 0; i < data.length; i++) {
        slides.push({title:$filter('translate')(data[i].title),img:data[i].image,id:data[i].id, ref:data[i].abslink});
      }
      if (slides.length > 0) {
        $scope.slides = slides;
        //$ionicSlideBoxDelegate.update();
      }  
    });
  });

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

.controller('CategoriesListCtrl', function ($scope, $stateParams, Config) {
  if ($stateParams.cateId == 'info') {
    $scope.title = 'sidemenu_div_Conoscere';
    $scope.categories = [
      {
        key: 'sidemenu_Info',
        link: 'contents/text.3001,text.3004'
      }, {
        key: 'sidemenu_Storia',
        link: 'content/text.3002'
      }, {
        key: 'sidemenu_Concilio',
        link: 'content/text.3003'
      }, {
        key: 'sidemenu_Eventi-Principali',
        link: 'mainevents'
      }, {
        key: 'sidemenu_Bondone',
        link: 'bondone'
      }
    ];

  } else if ($stateParams.cateId == 'events') {
    $scope.basecate = $stateParams.cateId;
    $scope.title = 'sidemenu_div_Vivere';
    $scope.categories2 = Config.eventTypesList();
  } else if ($stateParams.cateId == 'places') {
    $scope.basecate = $stateParams.cateId;
    $scope.title = 'sidemenu_div_Scoprire';
    $scope.categories2 = Config.poiTypesList();

  } else if ($stateParams.cateId == 'hospitality') {
    $scope.title = 'sidemenu_div_Mangiare-dormire';
    $scope.categories = [
      {
        key: 'sidemenu_Hotel',
        link: 'hotels'
      }, {
        key: 'sidemenu_Ristoranti',
        link: 'restaurants'
      }
    ];
  } else if ($stateParams.cateId == 'useful') {
    $scope.title = 'sidemenu_div_Info-utili';
    $scope.categories = [
      {
        key: 'sidemenu_Servizi',
        link: 'services'
      }, {
        key: 'sidemenu_Uffici-comunali',
        link: 'offices'
      }
    ];
  }
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
  $scope.gotdata = DatiDB.getFavorites().then(function (data) {
    $scope.favourites = data;
  });
})

.controller('HotelsListCtrl', function ($scope, $filter, DatiDB, Config, ListToolbox) {
  $scope._ = _;

  ListToolbox.prepare($scope, {
    load: function (cache) {
      if (cache) {
        $scope.hotels = cache;
      } else {
        $scope.gotdata = DatiDB.all('hotel').then(function (data) {
          $scope.hotels = data;
        });
      }
    },
    orderingTypes: ['A-Z', 'Z-A', 'Distance', 'Stars'],
    defaultOrdering: 'Distance',
    hasMap: true,
    getData: function () {
      return $scope.hotels;
    },
    getTitle: function () {
      return $filter('i18n')('sidemenu_Hotel');
    },
    filterOptions: Config.hotelTypesList(),
    doFilter: function (filter) {
      DatiDB.cate('hotel', filter).then(function (data) {
        $scope.hotels = data;
      });
    },
    hasSearch: true
  });
})

.controller('HotelCtrl', function ($scope, $stateParams, DatiDB) {
  $scope.gotdata = DatiDB.get('hotel', $stateParams.hotelId).then(function (data) {
    $scope.obj = data;
  });
})

.controller('RestaurantsListCtrl', function ($scope, $filter, DatiDB, Config, ListToolbox) {
  ListToolbox.prepare($scope, {
    load: function (cache) {
      if (cache) {
        $scope.restaurants = cache;
      } else {
        $scope.gotdata = DatiDB.all('restaurant').then(function (data) {
          $scope.restaurants = data;
        });
      }
    },
    orderingTypes: ['A-Z', 'Z-A', 'Distance'],
    defaultOrdering: 'Distance',
    hasMap: true,
    getData: function () {
      return $scope.restaurants;
    },
    getTitle: function () {
      return $filter('i18n')('sidemenu_Ristoranti');
    },
    filterOptions: Config.restaurantTypesList(),
    doFilter: function (filter) {
      DatiDB.cate('restaurant', filter).then(function (data) {
        $scope.restaurants = data;
      });
    },
    hasSearch: true
  });
})

.controller('RestaurantCtrl', function ($rootScope, $scope, $stateParams, DatiDB) {
  $scope.gotdata = DatiDB.get('restaurant', $stateParams.restaurantId).then(function (data) {
    $scope.lang = $rootScope.lang;
    $scope.obj = data;
  });
})

.controller('PlacesListCtrl', function ($scope, $stateParams, $filter, DatiDB, Config, ListToolbox) {
  ListToolbox.prepare($scope, {
    load: function (cache) {
      if (cache) {
        $scope.places = cache;
      } else {
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
      }
    },
    orderingTypes: ['A-Z', 'Z-A', 'Distance'],
    defaultOrdering: 'Distance',
    hasMap: true,
    getData: function () {
      return $scope.places;
    },
    getTitle: function () {
      return $filter('translate')($scope.cate);
    },
    hasSearch: true
  });
})

.controller('MapCtrl', function ($scope, MapHelper) {
  $scope._ = _;
  MapHelper.start($scope);
})

.controller('PlaceCtrl', function ($scope, DatiDB, GeoLocate, $stateParams) {
  $scope.gotdata = DatiDB.get('poi', $stateParams.placeId).then(function (data) {
    $scope.place = data;
    $scope.obj = data;
    $scope.showToolbar = true;
    if (data.location) {
      GeoLocate.locate().then(function (latlon) {
        $scope.distance = GeoLocate.distance(latlon, data.location);
      });
    } else {
      console.log('no known location for place');
    }
  });
})


.controller('EventsListCtrl', function ($scope, $stateParams, DatiDB, Config, ListToolbox, Profiling) {
  $scope.dateFormat = 'EEEE d MMMM yyyy';
  ListToolbox.prepare($scope, {
    load: function (cache) {
      if (cache) {
        $scope.events = cache;
      } else {
        if ($stateParams.eventType) {
          $scope.cate = Config.eventCateFromType($stateParams.eventType);
          Profiling.start('eventslist');
          $scope.gotdata = DatiDB.cate('event', $scope.cate.it).then(function (data) {
            $scope.events = data;
            Profiling.do('eventslist');
          });
        } else {
          $scope.gotdata = DatiDB.all('event').then(function (data) {
            $scope.events = data;
          });
        }
      }
    },
    getData: function () {
      return $scope.events;
    },
    orderingTypes: ['A-Z', 'Z-A', 'Date'],
    defaultOrdering: 'Date',
    hasSearch: true
  });
})

.controller('EventCtrl', function ($scope, DatiDB, $stateParams) {
  $scope.dateFormat = 'EEEE d MMMM yyyy';

  $scope.gotdata = DatiDB.get('event', $stateParams.eventId).then(function (data) {
    $scope.obj = data;
  });
})

.controller('MainEventsListCtrl', function ($scope, DatiDB, ListToolbox) {
  ListToolbox.prepare($scope, {
    load: function (cache) {
      if (cache) {
        $scope.mainevents = cache;
      } else {
        $scope.gotdata = DatiDB.all('mainevent').then(function (data) {
          $scope.mainevents = data;
        });
      }
    },
    getData: function () {
      return $scope.mainevents;
    },
    orderingTypes: ['A-Z', 'Z-A', 'Date'],
    defaultOrdering: 'Date',
    hasSearch: true
  });
})

.controller('MainEventCtrl', function ($scope, DatiDB, $stateParams) {
  $scope.gotdata = DatiDB.get('mainevent', $stateParams.maineventId).then(function (data) {
    $scope.obj = data;
  });
})

.controller('ItinerariCtrl', function ($scope, DatiDB, ListToolbox) {
  ListToolbox.prepare($scope, {
    load: function (cache) {
      if (cache) {
        $scope.itinerari = cache;
      } else {
        $scope.gotdata = DatiDB.all('itinerary').then(function (data) {
          $scope.itinerari = data;
        });
      }
    },
    getData: function () {
      return $scope.itinerari;
    },
    orderingTypes: ['A-Z', 'Z-A'],
    defaultOrdering: 'A-Z',
    hasSearch: true
  });
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
    zoom: 8,
    pan: false
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
    icon: 'icon',
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
        $scope.markers.poly.push({
          latitude: p.lat(),
          longitude: p.lng()
        });
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
          luogo.icon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=' + (data.steps.indexOf(luogo.id) + 1) + '|2975A7|FFFFFF';
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
