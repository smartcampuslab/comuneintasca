angular.module('ilcomuneintasca.controllers.places', [])

.controller('PlacesListCtrl', function ($scope, $stateParams, $filter, DatiDB, Config, ListToolbox, $ionicScrollDelegate) {
  ListToolbox.prepare($scope, {
    load: function (cache) {
      if ($stateParams.placeType) $scope.cate = Config.poiCateFromType($stateParams.placeType);

      if (cache) {
        $scope.places = cache;
      } else {
        if ($stateParams.placeType) {
          $scope.gotdata = DatiDB.cate('poi', $scope.cate.it).then(function (data) {
            $scope.places = data;
            $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
          });
        } else {
          $scope.gotdata = DatiDB.all('poi').then(function (data) {
            $scope.places = data;
            $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
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

.controller('PlaceCtrl', function ($scope, DatiDB, GeoLocate, $stateParams, $state, $window) {
  $scope.explicitBack = function () {
    return $state.current && $state.current.data && $state.current.data.explicitBack;
  };


  $scope.bk = function () {
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

.controller('MapCtrl', function ($scope, MapHelper, $ionicScrollDelegate, $timeout) {
  $scope._ = _;
  MapHelper.start($scope);

  $scope.$on('$viewContentLoaded', function () {
    var mapHeight = 10; // or any other calculated value
    mapHeight = angular.element(document.querySelector('#map-container'))[0].offsetHeight;
    angular.element(document.querySelector('.angular-google-map-container'))[0].style.height = mapHeight + 'px';
  });
})
