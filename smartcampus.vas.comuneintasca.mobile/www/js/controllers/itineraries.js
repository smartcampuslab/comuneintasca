angular.module('ilcomuneintasca.controllers.itineraries', [])

.controller('ItinerariCtrl', function ($scope, $rootScope, $location, $filter, Config, DatiDB, ListToolbox) {
//  Config.menuGroupSubgroup('percorsi','itineraries').then(function(sg){
//    $scope.title = sg.name;
//  });
  if ($rootScope.itineraryGroup) {
    $scope.title = $rootScope.itineraryGroup.name;
  }  

  var dosort = function() {
    $scope.itinerari = $filter('extOrderBy')($scope.itinerari,$scope.ordering);
  };
  
  ListToolbox.prepare($scope, {
    load: function (cache) {
      if (cache) {
        $scope.itinerari = cache;
      } else {
        $scope.gotdata = DatiDB.all('itinerary').then(function (data) {
          $scope.itinerari = data;
          dosort();
        });
      }
    },
    doSort: dosort,
    getData: function () {
      return $scope.itinerari;
    },
    orderingTypes: ['A-Z', 'Z-A'],
    defaultOrdering: 'A-Z',
    hasSearch: true
  });
  $scope.gotdata = DatiDB.all('itinerary').then(function (data) {
    $scope.itinerari = data;
    dosort();
  });
})

.controller('ItinerarioCtrl', function ($scope, DatiDB, $stateParams, $window, $location, $ionicPlatform, $timeout) {
/*  
  var back = function(event) {
    event.preventDefault();
    event.stopPropagation();
    $scope.bk();
  };
  $ionicPlatform.onHardwareBackButton(back);
  $scope.$on('$destroy', function() {
    $ionicPlatform.offHardwareBackButton(back);
  });
*/
  $scope.backActive = false;
  $timeout(function(){$scope.backActive = true;},200);
  $scope.explicitBack = function () {
    return $state.current && $state.current.data && $state.current.data.explicitBack;
  };
  $scope.bk = function () {
    $window.history.back();
  };

  $scope.clr = function () {
    $location.replace();
  };

  $scope.toggleFavorite = function (obj) {
    DatiDB.setFavorite(obj.id, obj.favorite < 0).then(function (res) {
      obj['favorite'] = res ? 1 : -1;
    });
  }
  $scope.isFavorite = function (obj) {
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

  
  $scope.itinerarioId = $stateParams.itinerarioId;
  $scope.gotdata = DatiDB.get('itinerary', $stateParams.itinerarioId).then(function (data) {
    $scope.itinerario = data;
    DatiDB.get('poi', data.steps.join()).then(function (luoghi) {
      var tappe = [];
      angular.forEach(luoghi, function (luogo, idx) {
        tappe[idx] = luogo;
        luogo.abslinkgot.then(function(){
          luogo['abslink']='#/app/itinstep/'+$scope.itinerario.id+'/poi/'+luogo.id;
        })
      });
      $scope.tappe = tappe;
      $scope.location = luoghi[0].location;
    });
  });
})

.controller('ItinerarioInfoCtrl', function ($scope, DatiDB, $stateParams) {})
.controller('ItinerarioTappeCtrl', function ($scope, DatiDB, $stateParams) {
  if ($stateParams.poiId) {
    console.log('ItinerarioTappeCtrl: poi');
    $scope.gotdata = DatiDB.get('poi', $stateParams.poiId).then(function (data) {
      $scope.obj=data;

      $scope.isObjFavorite = false;
      DatiDB.isFavorite(data.id).then(function (res) {
        $scope.isObjFavorite=res; 
      });
      $scope.toggleFavorite = function (obj) {
        DatiDB.setFavorite(obj.id, !$scope.isObjFavorite).then(function (res) {
          $scope.isObjFavorite=res;
        });
      };
      
      $scope.template='templates/page/poi_content.html';
    });
  } else {
    console.log('ItinerarioTappeCtrl: lista');
  }
})
.controller('ItinerarioPoiCtrl', function ($scope, $state, $timeout, $window, DatiDB, $stateParams) {
  $scope.backActive = false;
  $timeout(function(){$scope.backActive = true;},200);
  $scope.explicitBack = function () {
    return $state.current && $state.current.data && $state.current.data.explicitBack;
  };
  $scope.bk = function () {
    $window.history.back();
  };
    
  //console.log('itin id: '+$stateParams.itinerarioId);
  //console.log('poi id: '+$stateParams.poiId);
  $scope.gotdata = DatiDB.get('poi', $stateParams.poiId).then(function (data) {
    $scope.obj=data;

    $scope.isObjFavorite = false;
    DatiDB.isFavorite(data.id).then(function (res) {
      $scope.isObjFavorite=res; 
    });
    $scope.toggleFavorite = function (obj) {
      DatiDB.setFavorite(obj.id, !$scope.isObjFavorite).then(function (res) {
        $scope.isObjFavorite=res;
      });
    };
  });
})

.controller('ItinerarioMappaCtrl', function ($rootScope, $scope, DatiDB, $stateParams, $filter, $ionicPopup, $location, Config) {
  $scope.$on('$viewContentLoaded', function () {
    var mapHeight = 10; // or any other calculated value
    mapHeight = angular.element(document.querySelector('#map-container-itineraries'))[0].offsetHeight;
    mapHeight = mapHeight - 32 - 44; // header + footer
    angular.element(document.querySelector('.angular-google-map-container'))[0].style.height = mapHeight + 'px';
  });

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
      'zoomControl': true,
      styles:[{
        featureType:"poi",
        elementType:"labels",
        stylers:[{
          visibility:"off"
        }]
      }]
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
    if ($markerModel.id=='myPos') {
      //console.log('no actions on click my position marker');
      return;
    }
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
            //var itemUrl = '/app/itinerary/'+$scope.itinerario.id+'/steps/'+$scope.activeMarker.id;
            var itemUrl = '/app/itinstep/'+$scope.itinerario.id+'/step/'+$scope.activeMarker.id;
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
        //console.log(luogo.title.it);
        if (!!luogo.location) {
          /*m = new mxn.Marker(new mxn.LatLonPoint(luogo.location[0], luogo.location[1]));
          m.setIcon('img/mapmarker.png', [25, 40], [25 / 2, 40 / 2]);
          m.setInfoBubble(luogo.title.it);
          map2.addMarker(m);*/

          luogo.latitude = luogo.location[0];
          luogo.longitude = luogo.location[1];
          luogo.icon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=' + (data.steps.indexOf(luogo.id) + 1) + '|2975A7|FFFFFF';

          //console.log('data.steps.indexOf(luogo.id): '+data.steps.indexOf(luogo.id));
          $scope.markers.models[data.steps.indexOf(luogo.id)] = luogo;
        } else {
          console.log('WARNING: no location for "' + luogo.title.it + '"');
          //luogo.latitude = 0;
          //luogo.longitude = 0;
        }
      });

      if ($rootScope.myPosition) {
        p={ 'id':'myPos', latitude:$rootScope.myPosition[0], longitude:$rootScope.myPosition[1] };
        //console.log('geolocation (lat,lon): ' + JSON.stringify(p));
        $scope.markers.models.push(p);
      }
      
      
      // drawDirections($scope.map.control, $scope.markers.models);

      /*setTimeout(function () {
        map2.autoCenterAndZoom();
      }, 500);*/
    });
  });
})
