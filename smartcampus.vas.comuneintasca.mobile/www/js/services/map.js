angular.module('ilcomuneintasca.services.map', [])

.factory('MapHelper', function ($rootScope, $location, $filter, $ionicPopup, Config, $ionicScrollDelegate) {
  var map = {
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
    //    events: {
    //      'drag': function () {
    //        var handle = $ionicScrollDelegate.$getByHandle('mapScroll');
    //        var scrollView = $ionicScrollDelegate.$getByHandle('mapScroll').getScrollView();
    //        console.log(scrollView);
    //      }
    //    }
  };

  var markers = {
    models: [],
    coords: 'self',
    icon: 'icon',
    fit: true,
    doCluster: true
  };

  var title = '';

  var categoriesIcons = {
    'dormire': 'home',
    'ristorazione': 'restaurant',
    'cultura': 'civic-building',
    'other': 'location'
  };

  return {
    prepare: function (t, data) {
      showInfoWindow = false;
      title = t;

      if ($rootScope.myPosition) {
        p={ 'id':'myPos', 'key':'myMapPos', latitude:$rootScope.myPosition[0], longitude:$rootScope.myPosition[1] };
        //console.log('myMapPos geolocation (lat,lon): ' + JSON.stringify(p));
        markers.models.push(p);
      } else {
        console.log('unknown location: not showing myPos marker!');
      }
      angular.forEach(data, function (luogo, idx) {
        if (!!luogo.location) {
          //console.log($filter('translate')(luogo.title));
          luogo.key = luogo.id;
          luogo.latitude = luogo.location[0];
          luogo.longitude = luogo.location[1];
          luogo.icon = 'https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=';
          luogo.icon += (!!categoriesIcons[luogo.category] ? categoriesIcons[luogo.category] : categoriesIcons['other']) + '|2975A7';
          markers.models.push(luogo);
        } else {
          console.log('WARNING: no location for "' + luogo.title.it + '"');
        }
      });

      $location.path('/app/mappa');
    },
    start: function ($scope) {
      //console.log('[cordova] map started!!!');

      $scope.map = map;
      $scope.markers=markers;
      $scope.activeMarker = null;
      console.log('scope.markers.models: '+JSON.stringify($scope.markers.models.length));

      $scope.openMarkerPopup = function ($marker) {
        if ($marker.key=='myMapPos') {
          //console.log('no actions on click my position marker');
          return;
        }
        for (i in $scope.markers.models) if ($scope.markers.models[i].key==$marker.key) $scope.activeMarker=$scope.markers.models[i];

        var title = $filter('translate')($scope.activeMarker.title);
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
          buttons: [
            {
              text: $filter('translate')(Config.keys()['Close']),
              type: 'button-default',
              onTap: function (e) {
                $scope.activeMarker = null;
              }
            }, {
              text: $filter('translate')(Config.keys()['Details']),
              type: 'button-positive',
              onTap: function (e) {
                var itemUrl = $scope.activeMarker.abslink.substring(1);
                $location.path(itemUrl);
              }
            }
          ]
        });
        $scope.show = myPopup;
        myPopup.then(function (res) {
          // console.log('Marker popup: ' + res);
        });
      }

      $scope.title = title;
    }
  };
})
