angular.module('ilcomuneintasca.services.map', [])

.factory('MapHelper', function ($location, $filter, $ionicPopup, Config, $ionicScrollDelegate) {
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
      'zoomControl': true
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
      markers.models = [];
      title = t;

      angular.forEach(data, function (luogo, idx) {
        if (!!luogo.location) {
          luogo.latitude = luogo.location[0];
          luogo.longitude = luogo.location[1];
          luogo.icon = 'https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=';
          luogo.icon += (!!categoriesIcons[luogo.category] ? categoriesIcons[luogo.category] : categoriesIcons['other']) + '|2975A7';
          markers.models.push(luogo)
        }
      });

      $location.path('/app/mappa');
    },
    start: function ($scope) {
      $scope.activeMarker = null;
      $scope.map = map;
      $scope.markers = markers;

      console.log('[cordova] map started!!!');

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
              var itemUrl = $scope.activeMarker.abslink.substring(1);
              $location.path(itemUrl);
            }
        }]
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
