angular.module('ilcomuneintasca.controllers.events', [])

.controller('EventsListCtrl', function ($rootScope, $scope, $stateParams, $filter, DatiDB, Config, ListToolbox, Profiling, DateUtility, $ionicScrollDelegate) {

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
        $scope.gotdata = DatiDB.byTimeInterval('event', f, t, eventType).then(post);
      } else {
        $scope.gotdata = DatiDB.byTimeInterval('event', f, t, null).then(post);
      }
    } else {
      if ($stateParams.eventType && $stateParams.eventType != 'all') {
        $scope.gotdata = DatiDB.cate('event', eventType).then(post);
      } else {
        $scope.gotdata = DatiDB.all('event').then(post);
      }
    }
  };
  ListToolbox.prepare($scope, {
    load: function (cache) {
      if (cache) {
        $scope.events = cache;
/*
        Config.menuGroup(eventType).then(function(g){
          $scope.cate = g;
        });
*/
      } else {
        search(defaultTimeFilter);
      }
    },
    getData: function () {
      return $scope.events;
    },
    orderingTypes: ['A-Z', 'Z-A', 'DateFrom', 'DateTo'],
    defaultOrdering: 'DateTo',
    hasSearch: true,
    filterOptions: Config.eventFilterTypeList(),
    doFilter: search,
    defaultFilter: defaultTimeFilter
  });
})
