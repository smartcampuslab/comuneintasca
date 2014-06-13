angular.module('ilcomuneintasca.controllers.events', [])

.controller('EventsListCtrl', function ($rootScope, $scope, $stateParams, $filter, DatiDB, Config, ListToolbox, Profiling, DateUtility, $ionicScrollDelegate) {
  $scope.getLocaleDateString = function (time) {
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
      return $filter('translate')(Config.eventFilterTypeList()[$scope.filter]) + ': ';
    } else return '';
  }

  var search = function (filter) {
    var t;
    var d = new Date();
    var f = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - 1;
    if (filter == 'today') {
      t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
    } else if (filter == 'week') {
      t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7).getTime();
    } else if (filter == 'month') {
      t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 30).getTime();
    } else {
      t = 0;
    }
    var post = function (data) {
      if (data) {
        $scope.events = data;
      } else {
        $scope.events = [];
      }
      $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
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
  $scope.getLocaleDateString = function (time) {
    return DateUtility.getLocaleDateString($rootScope.lang, time);
  };

  $scope.gotdata = DatiDB.get('event', $stateParams.eventId).then(function (data) {
    $scope.obj = data;
  });
})

.controller('MainEventsListCtrl', function ($scope, DatiDB, ListToolbox, $ionicScrollDelegate) {
  ListToolbox.prepare($scope, {
    load: function (cache) {
      if (cache) {
        $scope.mainevents = cache;
      } else {
        $scope.gotdata = DatiDB.all('mainevent').then(function (data) {
          $scope.mainevents = data;
          $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
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
