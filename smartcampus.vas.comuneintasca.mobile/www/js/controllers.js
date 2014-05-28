angular.module('starter.controllers', ['google-maps'])

.controller('MenuCtrl', function ($scope, $ionicModal) {
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

  $ionicModal.fromTemplateUrl('templates/credits.html', {
    scope: $scope,
    animation: 'slide-in-up'
  })
    .then(function (modal) {
      $scope.credits = modal;
    });
  $scope.showCredits = function () {
    console.log($scope);
    $scope.credits.show();
  };
  $scope.$on('$destroy', function () {
    $scope.credits.remove();
  });
})

.controller('HomeCtrl', function ($scope, $rootScope, DatiDB, $filter, $ionicSlideBoxDelegate, $ionicPopup, $location, Config) {
  $rootScope.inHome = true;
  var navbarElement = angular.element(document.getElementById('navbar'));
  navbarElement.addClass('bar-comuni-home');
  $scope.$on('$destroy', function () {
    navbarElement.removeClass('bar-comuni-home');
  });

  var defaultSlide = {
          title: 'Trento',
          img: 'img/hp-box/trento.png',
          id: null,
          ref: '#/app/contents/text.3001,text.3004'
        };
  
  $scope.slides = null;
  $scope.goToItem = function (link) {
    $location.path(link.substring(1));
  }
  DatiDB.sync().then(function (data) {
    var homeObject = JSON.parse(localStorage.homeObject);
    var homeObjects = homeObject.contentIds;
    DatiDB.getAny(homeObjects).then(function (data) {
      var slides = [defaultSlide];
      for (var i = 0; i < data.length; i++) {
        slides.push({
          title: $filter('translate')(data[i].title),
          img: data[i].image,
          id: data[i].id,
          ref: data[i].abslink
        });
      }
      if (slides.length > 0) {
        $scope.slides = slides;
        //$ionicSlideBoxDelegate.update();
      }
    });
  });

  $scope.openViaggiaTrento = function () {
    if (ionic.Platform.isWebView() && device.platform=='Android') {
      cordova.plugins.startapp.start({
        android: 'eu.trentorise.smartcampus.viaggiatrento'
      }, function () {
        console.log('VIAGGIA TRENTO: success.');
      }, function () {
        console.log('VIAGGIA TRENTO: failed!');
        window.open('https://play.google.com/store/apps/details?id=eu.trentorise.smartcampus.viaggiatrento', '_system');
      });
    } else {
      //window.open('https://play.google.com/store/apps/details?id=eu.trentorise.smartcampus.viaggiatrento', '_blank');
      var alertPopup = $ionicPopup.alert({
        title: 'Viaggia Trento',
        template: Config.textTypesList()['In preparazione...'][$rootScope.lang]
      });
      alertPopup.then(function(res) {
        console.log('viagga trento done');
      });
    }
  };

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
        link: 'contentscate/bondone'
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
        link: 'contacts'
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

.controller('ContentsListCtrl', function ($scope, $state, $stateParams, DatiDB, Config) {
  if ($stateParams.contentsCate) {
    $scope.gotdata = DatiDB.cate('content', $stateParams.contentsCate).then(function (data) {
      $scope.contents = data;
      $scope.title = Config.textTypesList()[$stateParams.contentsCate];
    });
  } else if ($stateParams.contentsIds) {
    $scope.gotdata = DatiDB.get('content', $stateParams.contentsIds).then(function (data) {
      $scope.contents = data;
      if (data && data.length > 0) {
        $scope.title = Config.textTypesList()[data[0].classification];
      }
    });
  } else if ($state.current.data.contentsCate) {
    $scope.gotdata = DatiDB.cate('content', $state.current.data.contentsCate).then(function (data) {
      $scope.title = Config.textTypesList()[$state.current.data.contentsCate];
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

  $scope.filterDef = function () {
    if ($scope.filter) {
      var r = $filter('translate')(Config.hotelTypesList()[$scope.filter]);
      if (r.length > 20) r = r.substr(0,20)+'...';
      return r + ': ';
    } 
    else return '';
  }

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
      var f = filter ? Config.hotelTypesList()[filter].it : filter;
      DatiDB.cate('hotel', f).then(function (data) {
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
  $scope.filterDef = function () {
    if ($scope.filter) {
      var r = $filter('translate')(Config.restaurantTypesList()[$scope.filter]);
      if (r.length > 20) r = r.substr(0,20)+'...';
      return r + ': ';
    } 
    else return '';
  }

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
      var f = filter ? Config.restaurantTypesList()[filter].it : filter;
      DatiDB.cate('restaurant', f).then(function (data) {
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
        if ($stateParams.placeType) {
          $scope.cate = Config.poiCateFromType($stateParams.placeType);
        }  
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

.controller('PlaceCtrl', function ($scope, DatiDB, GeoLocate, $stateParams, $state, $window) {
  $scope.explicitBack = function() {
    return $state.current && $state.current.data && $state.current.data.explicitBack;
  };

  
  $scope.bk = function() {
    $window.history.back();
  };

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


.controller('EventsListCtrl', function ($rootScope, $scope, $stateParams, $filter, DatiDB, Config, ListToolbox, Profiling, DateUtility) {
  $scope.getLocaleDateString = function(time) {
    return DateUtility.getLocaleDateString($rootScope.lang, time);
  };

  var defaultTimeFilter = 'week';
  if ($stateParams.eventType && $stateParams.eventType != 'all') {
    $scope.cate = Config.eventCateFromType($stateParams.eventType);
  } else {
    $scope.cate = Config.eventCateFromType('all');
    defaultTimeFilter = 'today';
  }
  
  $scope.filterDef = function () {
    if ($scope.filter) {
      return $filter('translate')(Config.eventFilterTypeList()[$scope.filter])+': ';
    } 
    else return '';
  }
  
  var search = function (filter) {
      var t;
      var d = new Date();
      var f = new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()-1;
      if (filter == 'today') {
        t = new Date(d.getFullYear(),d.getMonth(),d.getDate()+1).getTime();
      } else if (filter == 'week') {
        t = new Date(d.getFullYear(),d.getMonth(),d.getDate()+7).getTime();
      } else if (filter == 'month') {
        t = new Date(d.getFullYear(),d.getMonth(),d.getDate()+30).getTime();
      } else {
        t = 0;
      }
      var post = function (data) {
          if (data) $scope.events = data;
          else $scope.events = [];
      };
      if (t > 0) {
        if ($stateParams.eventType && $stateParams.eventType != 'all') {
          $scope.gotdata = DatiDB.byTimeInterval('event', f, t, $scope.cate.it).then(post);
        } else {
          $scope.gotdata = DatiDB.byTimeInterval('event', f, t, null).then(post);
        }  
      } else {
        if ($stateParams.eventType && $stateParams.eventType != 'all') {
          $scope.gotdata = DatiDB.cate('event', $scope.cate.it).then(post);
        } else {
          $scope.gotdata = DatiDB.all('event').then(post);
        }
      }
  };
  ListToolbox.prepare($scope, {
    load: function (cache) {
      if (cache) {
        $scope.events = cache;
        $scope.cate = Config.eventCateFromType($stateParams.eventType);
      } else {
        search(defaultTimeFilter);
      }
    },
    getData: function () {
      return $scope.events;
    },
    orderingTypes: ['A-Z', 'Z-A', 'DateFrom', 'DateTo'],
    defaultOrdering: 'DateFrom',
    hasSearch: true,
    filterOptions: Config.eventFilterTypeList(),
    doFilter: search,
    defaultFilter: defaultTimeFilter
  });
})

.controller('EventCtrl', function ($scope, DatiDB, $stateParams, $rootScope, DateUtility) {
  $scope.getLocaleDateString = function(time) {
    return DateUtility.getLocaleDateString($rootScope.lang, time);
  };

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

.controller('ItinerarioCtrl', function ($scope, DatiDB, $stateParams, $window, $location) {
  $scope.bk = function() {
    $window.history.back();
  };
  $scope.clr = function() {
    $location.replace();
  };
  
  $scope.itinerarioId = $stateParams.itinerarioId;
  $scope.gotdata = DatiDB.get('itinerary', $stateParams.itinerarioId).then(function (data) {
    $scope.itinerario = data;
    DatiDB.get('poi', data.steps.join()).then(function (luoghi) {
      var tappe = [];
      angular.forEach(luoghi, function(luogo,idx) {
        tappe[data.steps.indexOf(luogo.id)] = luogo;
      });
      $scope.tappe = tappe;
      $scope.location = luoghi[0].location;
    });
  });
})

.controller('ItinerarioInfoCtrl', function ($scope, DatiDB, $stateParams) {})

.controller('ItinerarioTappeCtrl', function ($scope, DatiDB, $stateParams) {})

.controller('ItinerarioMappaCtrl', function ($scope, DatiDB, $stateParams, $filter, $ionicPopup, $location, Config) {
  $scope.map = {
    control: {},
    draggable: 'true',
    center: {
      latitude: 46.07,
      longitude: 11.12
    },
    zoom: 8,
    pan: false,
    options: {
      'streetViewControl': false,
      'zoomControl': true
    }
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

  $scope.openMarkerPopup = function ($markerModel) {
    $scope.activeMarker = $markerModel;

    var title = $filter('translate')($markerModel.title);
    var template = '<div>';
    template += title;
    template += '</div>';
    var templateUrl = 'templates/mappa_popup.html';

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      // template: template,
      templateUrl: templateUrl,
      title: $filter('translate')($scope.activeMarker.title),
      subTitle: !!$scope.activeMarker.distance ? $filter('number')($scope.activeMarker.distance, 1) + ' Km' : '',
      scope: $scope,
      buttons: [{
        text: $filter('translate')(Config.keys()['Close']),
        type: 'button-default',
        onTap: function (e) {
          $scope.activeMarker = null;
        }
            }, {
        text: $filter('translate')(Config.keys()['Details']),
        type: 'button-positive',
        onTap: function (e) {
          var itemUrl = '/app/itineraryplace/'+$scope.activeMarker.id;//$scope.activeMarker.abslink.substring(1);
          $location.path(itemUrl);
        }
        }]
    });
    $scope.show = myPopup;
    myPopup.then(function (res) {
      // console.log('Marker popup: ' + res);
    });
  }

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
