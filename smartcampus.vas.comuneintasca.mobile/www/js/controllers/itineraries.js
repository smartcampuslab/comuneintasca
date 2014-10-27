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

  $scope.$watch('ordering.searchText', function(newValue, oldValue) {
    if (newValue!=oldValue) {
      if (oldValue == null) {
        $scope.allItinerari = $scope.itinerari;
      } else {
        $scope.itinerari = $scope.allItinerari;
      }
      //console.log('search for: '+newValue+' ('+oldValue+')');
      dosort();
    }
  });
  
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

.controller('ItinerarioCtrl', function ($scope, DatiDB, $stateParams, $window, $location, $ionicPlatform, $ionicViewService, $timeout) {
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
  $scope.backActive = true;
  $scope.explicitBack = function () {
    return $state.current && $state.current.data && $state.current.data.explicitBack;
  };
  $scope.bk = function () {
    //console.log('back from itin...');
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
//    $window.history.back();
  };

  $scope.clr = function () {
    $location.replace();
  };

  $scope.isObjFavorite = false;
  $scope.toggleFavorite = function (obj) {
    DatiDB.setFavorite(obj.id, !$scope.isObjFavorite).then(function (res) {
      $scope.isObjFavorite=res;
    });
  };
  
  $scope.itinerarioId = $stateParams.itinerarioId;
  $scope.gotitindata = DatiDB.get('itinerary', $stateParams.itinerarioId).then(function (data) {
    $scope.itinerario = data;

    DatiDB.isFavorite(data.id).then(function (res) {
      $scope.isObjFavorite=res; 
    });
    
    $scope.gotstepsdata=DatiDB.get('poi', data.steps.join()).then(function (luoghi) {
      //console.log('luoghi: '+luoghi);
      $scope.location = luoghi[0].location;
      var tappe=[];
      angular.forEach(luoghi, function (luogo, idx) {
        //console.log('luogo#'+idx+': '+luogo.id);
        tappe[idx] = luogo;
      });
      $scope.tappe = tappe;
      return luoghi;
    });
    return data;
  });
})

.controller('ItinerarioInfoCtrl', function ($scope, DatiDB, $stateParams) {
})
.controller('ItinerarioTappeCtrl', function ($scope, DatiDB, $stateParams) {
/*
  console.log('itin id: '+$scope.itinerarioId);
  $scope.gotitindata.then(function(data){
    console.log('gotitindata: '+JSON.stringify(data.steps));
    console.log('$scope.gotstepsdata: '+$scope.gotstepsdata);
    $scope.gotstepsdata.then(function(luoghi){
      console.log('luoghi#2: '+luoghi);
      var tappe=[];
      angular.forEach(luoghi, function (luogo, idx) {
        console.log('luogo#'+idx+': '+luogo.id);
        tappe[idx] = luogo;
      });
      $scope.tappe = tappe;
      return luoghi;
    },function(){
      console.log('errore gotstepsdata');
    });
*/
/*
    $scope.gotstepsdata=DatiDB.get('poi', data.steps.join()).then(function (luoghi) {
      var tappe = [];
      $scope.tappe = tappe;
      angular.forEach(luoghi, function (luogo, idx) {
        console.log('luogo#'+idx+': '+luogo.id);
        tappe[idx] = luogo;
        luogo.abslinkgot.then(function(){
          luogo['abslink']='#/app/itinstep/'+$scope.itinerario.id+'/poi/'+luogo.id;
        });
      });
      return tappe;
    });
*/
//  });
})
.controller('ItinerarioPoiCtrl', function ($scope, $state, $timeout, $window, DatiDB, $stateParams, $ionicViewService) {
  $scope.backActive = true;
  $scope.explicitBack = function () {
    return $state.current && $state.current.data && $state.current.data.explicitBack;
  };
  $scope.bk = function () {
    //console.log('back from inside itin POIs!');
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
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

.controller('ItinerarioMappaCtrl',['$rootScope', '$scope', '$q', 'DatiDB', '$stateParams', '$filter', '$ionicPopup', '$location', 'Config', 'GoogleMapApi'.ns(), function ($rootScope, $scope, $q, DatiDB, $stateParams, $filter, $ionicPopup, $location, Config, GoogleMapApi) {
  var gotheight=$q.defer();
  $scope.$on('$viewContentLoaded', function () {
    var mapHeight = 600; // or any other calculated value
    mapHeight = angular.element(document.querySelector('#map2-container'))[0].offsetHeight;
    //console.log('mapheight: '+mapHeight);
    gotheight.resolve(mapHeight + 40);
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
      streetViewControl: false,
      zoomControl: true,
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
      key: -1,
      latitude: 0,
      longitude: 0
    }, {
      key: -2,
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
    doCluster: false
  };

  GoogleMapApi.then(function(maps) {
    console.log('GoogleMapApi is READY!!!');

    gotheight.promise.then(function (mapHeight) {
      angular.element(document.querySelector('#map2 .angular-google-map-container'))[0].style.height = mapHeight + 'px';
    });

    $scope.openMarkerPopup = function ($marker) {
      if ($marker.key=='myPos') {
        //console.log('no actions on click my position marker');
        return;
      }
      for (i in $scope.markers.models) {
        if ($scope.markers.models[i].key==$marker.key) {
          $scope.activeMarker=$scope.markers.models[i];
        }
      }

      var title = $filter('translate')($scope.activeMarker.title);
      var template = '<div>';
      template += title;
      template += '</div>';
      var templateUrl = 'templates/mappa_popup.html';

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        // template: template,
        templateUrl: templateUrl,
        title: $scope.activeMarker.step+'. '+$filter('translate')($scope.activeMarker.title),
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
        var models=[];
        if ($rootScope.myPosition) {
          var p={ 'id':'myPos', 'key':'myPos', latitude:$rootScope.myPosition[0], longitude:$rootScope.myPosition[1] };
          //console.log('geolocation (lat,lon): ' + JSON.stringify(p));
          models.push(p);
        } else {
          console.log('unknown location: not showing myPos marker!');
        }
        angular.forEach(luoghi, function (luogo, idx) {
          // for (var i = 0; i < luoghi.length; i++) {
          //console.log(luogo.title.it);
          if (!!luogo.location) {
            /*m = new mxn.Marker(new mxn.LatLonPoint(luogo.location[0], luogo.location[1]));
            m.setIcon('img/mapmarker.png', [25, 40], [25 / 2, 40 / 2]);
            m.setInfoBubble(luogo.title.it);
            map2.addMarker(m);*/

            luogo.step = idx + 1;
            luogo.key = luogo.id;
            luogo.latitude = luogo.location[0];
            luogo.longitude = luogo.location[1];
            luogo.icon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=' + (luogo.step) + '|2975A7|FFFFFF';

            //console.log('data.steps.indexOf(luogo.id): '+data.steps.indexOf(luogo.id));
            models.push(luogo);
          } else {
            console.log('WARNING: no location for "' + luogo.title.it + '"');
          }
        });
        $scope.markers.models=models;

        // drawDirections($scope.map.control, $scope.markers.models);

        /*setTimeout(function () {
          map2.autoCenterAndZoom();
        }, 500);*/
      });
    });
  },function(err){
    console.log('GoogleMapApi is NOT AVAILABLE!!!');
  });
}])
