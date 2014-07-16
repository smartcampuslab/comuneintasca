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


.controller('PageCtrl', function ($scope, $stateParams, Config, DatiDB, ListToolbox, DateUtility, $ionicScrollDelegate) {
  $scope.getLocaleDateString = function (time) {
    return DateUtility.getLocaleDateString($rootScope.lang, time);
  };
  Config.menuGroupSubgroup($stateParams.groupId,$stateParams.menuId).then(function(sg){
    $scope.title=sg.name;
    if (sg.query) {
      if ($stateParams.itemId!='') {
        $scope.template='templates/page/'+(sg.view||sg.query.type+'_detail')+'.html';
        $scope.gotdata = DatiDB.get(sg.query.type, $stateParams.itemId).then(function (data) {
          console.log(data);
          $scope.obj = data;
        });
      } else {
        $scope.template='templates/page/'+(sg.view||sg.query.type+'_list')+'.html';

        //console.log(sg.query);
        if (sg.query.classification) {
          $scope.gotdbdata=DatiDB.cate(sg.query.type, sg.query.classification);
        } else {
          $scope.gotdbdata=DatiDB.all(sg.query.type);
        }
        $scope.gotdata = $scope.gotdbdata.then(function (data) {
          $scope.results = data;
          var tboptions={
            hasSort: false,
            hasSearch: (sg.query.search||true),
            load: function (cache) {
              if (cache) {
                $scope.results = cache;
              } else {
                $scope.gotdata = $scope.gotdbdata.then(function (data) {
                  $scope.results = data;
                  $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
                });
              }
            },
            getData: function () {
              return $scope.results;
            }
          };
          if (sg.query.hasOwnProperty('sort')) {
            tboptions.hasSort=true
            tboptions.orderingTypes=sg.query.sort.types;
            tboptions.defaultOrdering=sg.query.sort.default;
          } else if (sg._parent.hasOwnProperty('sort')) {
            tboptions.hasSort=true
            tboptions.orderingTypes=sg._parent.sort.types;
            tboptions.defaultOrdering=sg._parent.sort.default;
          }
          if (tboptions.hasSort || tboptions.hasSearch) {
            ListToolbox.prepare($scope, tboptions);
          }
        });
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
