angular.module('ilcomuneintasca.controllers.hospitality', [])

.controller('HotelsListCtrl', function ($scope, $filter, DatiDB, Config, ListToolbox, $ionicScrollDelegate) {
  $scope._ = _;

  $scope.filterDef = function () {
    if ($scope.filter) {
      var r = $filter('translate')(Config.hotelTypesList()[$scope.filter]);
      if (r.length > 20) r = r.substr(0, 20) + '...';
      return r + ': ';
    } else return '';
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
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
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

.controller('RestaurantsListCtrl', function ($scope, $filter, DatiDB, Config, ListToolbox, $ionicScrollDelegate) {
  $scope.filterDef = function () {
    if ($scope.filter) {
      var r = $filter('translate')(Config.restaurantTypesList()[$scope.filter]);
      if (r.length > 20) r = r.substr(0, 20) + '...';
      return r + ': ';
    } else return '';
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
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
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
