angular.module('ilcomuneintasca.controllers.common', [])

.controller('SettingsCtrl', function ($scope, Config) {
})

.controller('MenuCtrl', function ($scope, $ionicModal, Config) {
  $scope.shownGroup = null;

  $scope.isGroupShown = function (groupId) {
    return $scope.shownGroup == groupId;
  };
  $scope.showGroup = function (groupId) {
    if (groupId != $scope.shownGroup) {
      $scope.shownGroup = groupId;
    } else {
      $scope.shownGroup = null;
    }
  };

  Config.menu().then(function(menu) {
    $scope.menu=menu;
  },function(menu) {
    $scope.menu=null;
  });
  
  $ionicModal.fromTemplateUrl('templates/credits.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
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

.controller('FavouritesListCtrl', function ($scope, DatiDB) {
  $scope.gotdata = DatiDB.getFavorites().then(function (data) {
    $scope.favorites = data;
  });
})

.controller('CategoriesListCtrl', function ($scope, $stateParams, Config) {
  Config.menuGroup($stateParams.cateId).then(function(g){
      $scope.group=g;
  });
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


.controller('PageCtrl', function ($scope, $state, $stateParams, $window, Config, DatiDB, ListToolbox, DateUtility, GeoLocate, MapHelper, $ionicScrollDelegate) {
  $scope._ = _;
  $scope.getLocaleDateString = function (time) {
    return DateUtility.getLocaleDateString($rootScope.lang, time);
  };
  $scope.explicitBack = function () {
    return $state.current && $state.current.data && $state.current.data.explicitBack;
  };
  $scope.bk = function () {
    $window.history.back();
  };

  Config.menuGroupSubgroup($stateParams.groupId,$stateParams.menuId).then(function(sg){
    $scope.title=sg.name;
    if (sg.query) {
      if ($stateParams.itemId!='') {
        $scope.template='templates/page/'+(sg.view||sg.query.type)+'.html';
        $scope.gotdata = DatiDB.get(sg.query.type, $stateParams.itemId).then(function (data) {
          console.log('obj: '+data);
          $scope.obj = data;

          if (data.location) {
            GeoLocate.locate().then(function (latlon) {
              $scope.distance = GeoLocate.distance(latlon, data.location);
            });
          } else {
            console.log('no known location for place');
          }
        });
      } else {
        $scope.template='templates/page/'+(sg.view||sg.query.type+'_list')+'.html';

        var tboptions={
          hasSort: false,
          hasSearch: (sg.query.search||true),
          load: function (cache) {
            if (cache) {
              $scope.results = cache;
            } else {
              if (typeof this.doFilter=='function') {
                this.doFilter(this.defaultFilter);
              } else {
                if (sg.query.classification) {
                  $scope.gotdbdata=DatiDB.cate(sg.query.type, sg.query.classification);
                } else {
                  $scope.gotdbdata=DatiDB.all(sg.query.type);
                }
                $scope.gotdata = $scope.gotdbdata.then(function (data) {
                  $scope.results = data;
                  $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
                });
              }
            }
          },
          getData: function () {
            return $scope.results;
          },
          getTitle: function () {
            return $scope.title;
          }
        };

        if (sg.query.hasOwnProperty('sort')) {
          tboptions.hasSort=true
          tboptions.orderingTypes=sg.query.sort.options;
          tboptions.defaultOrdering=sg.query.sort.default;
        } else if (sg._parent.hasOwnProperty('sort')) {
          tboptions.hasSort=true
          tboptions.orderingTypes=sg._parent.sort.options;
          tboptions.defaultOrdering=sg._parent.sort.default;
        }

        if (sg.query.hasOwnProperty('map')) {
          tboptions.hasMap=true;
        } else if (sg._parent.hasOwnProperty('map')) {
          tboptions.hasMap=true;
        }

        $scope.filterDef='';
        if (sg.query.hasOwnProperty('filter') || sg._parent.hasOwnProperty('filter')) {
          if (sg.query.type=="hotel") {
            tboptions.filterOptions=Config.hotelTypesList();
          } else if (sg.query.type=="restaurant") {
            tboptions.filterOptions=Config.restaurantTypesList();
          }

          tboptions.doFilter=function(filter) {
            console.log('filter: '+filter);
            var t=0;
            var d = new Date();
            var f = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - 1;
            if (filter == 'today') {
              t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
            } else if (filter == 'week') {
              t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7).getTime();
            } else if (filter == 'month') {
              t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 30).getTime();
            }
            if (t > 0) {
              if (sg.query.classification) {
                $scope.gotdbdata=DatiDB.byTimeInterval(sg.query.type, f, t, sg.query.classification);
              } else {
                $scope.gotdbdata=DatiDB.byTimeInterval(sg.query.type, f, t, null);
              }
            } else {
              if (filter) {
                $scope.gotdbdata=DatiDB.cate(sg.query.type, filter);
              } else {
                $scope.gotdbdata=DatiDB.all(sg.query.type);
              }
            }
            $scope.gotdata = $scope.gotdbdata.then(function (data) {
              if (data) {
                $scope.results = data;
              } else {
                $scope.results = [];
              }
              $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
            });
          };
          if (sg.query.hasOwnProperty('filter') && sg.query.filter.hasOwnProperty('options')) {
            tboptions.filterOptions=sg.query.filter.options;
          } else if (sg._parent.hasOwnProperty('filter') && sg._parent.filter.hasOwnProperty('options')) {
            tboptions.filterOptions=sg._parent.filter.options;
          }
          if (sg.query.hasOwnProperty('filter') && sg.query.filter.hasOwnProperty('default')) {
            tboptions.defaultFilter=sg.query.filter.default;
          } else if (sg._parent.hasOwnProperty('filter') && sg._parent.filter.hasOwnProperty('default')) {
            tboptions.defaultFilter=sg._parent.filter.default;
          }
          if ($scope.filter) {
            if (sg._parent.hasOwnProperty('sort')) {
              Config.menuGroupSubgroup($stateParams.groupId,$root.lang,$scope.filter).then(function(sg) {
                if (sg) {
                  var fd = $filter('translate')(sg.name);
                  if (fd.length > 20) fd = fd.substr(0, 20) + '...';
                  $scope.filterDef= fd + ': ';
                }
              });
            }
          }
        }

        if (tboptions.hasMap || tboptions.hasFilter || tboptions.hasSort || tboptions.hasSearch) {
          ListToolbox.prepare($scope, tboptions);
        } else {
          if (sg.query.classification) {
            $scope.gotdbdata=DatiDB.cate(sg.query.type, sg.query.classification);
          } else {
            $scope.gotdbdata=DatiDB.all(sg.query.type);
          }
          $scope.gotdata = $scope.gotdbdata.then(function (data) {
            $scope.results = data;
          });
        }
      }
    } else if (sg.objectIds) {
      $scope.template='templates/page/'+(sg.view||'single')+'.html';
      $scope.gotdata = DatiDB.get(sg.type, sg.objectIds.join(',')).then(function (data) {
        data=(data.hasOwnProperty('length')?data:[data]);
        $scope.results = data;
      });
    } else {
    }
  });
})
