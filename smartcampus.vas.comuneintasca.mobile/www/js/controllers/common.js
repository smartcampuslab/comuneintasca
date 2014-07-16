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


.controller('PageCtrl', function ($scope, $stateParams, DatiDB, Config) {
  Config.menuGroupSubgroup($stateParams.groupId,$stateParams.menuId).then(function(sg){
    $scope.title=sg.name;
    if (sg.query) {
      $scope.hasSort=(sg.query.sort||true);
      $scope.hasSearch=(sg.query.search||true);
      $scope.template='templates/page/'+(sg.view||sg.query.type+'_list')+'.html';
      console.log(sg.query);
      if (sg.query.classification) {
        gotdbdata=DatiDB.cate(sg.query.type, sg.query.classification);
      } else {
        gotdbdata=DatiDB.all(sg.query.type);
      }
      $scope.gotdata = gotdbdata.then(function (data) {
        $scope.contents = data;
      });
    } else if (sg.objectIds) {
      $scope.template='templates/page/'+(sg.view||'single')+'.html';
      $scope.gotdata = DatiDB.get(sg.type, sg.objectIds.join(',')).then(function (data) {
        data=(data.hasOwnProperty('length')?data:[data]);
        $scope.contents = data;
      });
    } else {
    }
  });
/*
    for (mgi=0; mgi<data.menu.length; mgi++) {
      var group=data.menu[mgi];
      for (ii=0; ii<group.items.length; ii++) {
        var item=group.items[ii];
        if (item.objectIds) {
          item.path="/app/"+(item.view||"page")+"/"+item.type+"/"+item.objectIds.join(',');
        } else if (item.query) {
          item.path="/app/"+(item.view||"list")+"/"+item.query.type+(item.query.classification?"/"+item.query.classification:"");
        } else {
          item.path="/menu/"+group.id+"/"+ii;
          console.log('unkown menu item: '+item.path);
        }
        //console.log('item['+group.id+']['+item.id+'].path="'+item.path+'"');
      }
    }

  console.log('$stateParams.type='+$stateParams.type);
  $scope.gotdata = DatiDB.get($stateParams.type, $stateParams.id).then(function (data) {
    console.log(data);
    data=(data.hasOwnProperty('length')?data:[data]);
    $scope.title = data[0].title;
    $scope.contents = data;
  });
*/
})
