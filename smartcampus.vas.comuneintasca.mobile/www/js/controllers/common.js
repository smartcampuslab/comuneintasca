angular.module('ilcomuneintasca.controllers.common', [])

.controller('MenuCtrl', ['$scope', '$rootScope', '$location', '$ionicModal', '$ionicLoading', '$ionicPopup', '$filter', '$window', 'Config', 'Files', 'DatiDB', 'GoogleMapApi'.ns(), function ($scope, $rootScope, $location, $ionicModal, $ionicLoading, $ionicPopup, $filter, $window, Config, Files, DatiDB, GoogleMapApi) {
  $scope.shownGroup = null;
  $scope.version=Config.getVersion();

  GoogleMapApi.then(function(maps) {
    //console.log('GoogleMapApi is READY!!!');
    $rootScope.mapsReady=true;
  });
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

  $rootScope.$on('profileUpdated', function() {
    console.log('profile updated!');
    Config.menu().then(function (menu) {
      $scope.menu = menu;
    }, function (menu) {
      $scope.menu = null;
    });
  });
  
  Config.menu().then(function (menu) {
    $scope.menu = menu;
  }, function (menu) {
    $scope.menu = null;
  });

  $scope.setLang = function (l) {
    $rootScope.lang = localStorage.lang = l;
    /*
    var loading = $ionicLoading.show({
      template: $filter('translate')(Config.keys()['loading']),
    });
*/
    /*
    $timeout(function(){
      $window.location.reload();
    },500);
		*/
  };
  $scope.fsCleanup = function () {
    console.log('clean!');
    localStorage.lastFileCleanup = -1;
    Files.deleteall().then(function () {
      console.log('fs cleanup completed!');
      $ionicPopup.alert({
        title: $filter('translate')('settings_data_clean'),
        template: $filter('translate')('settings_done')
      }).then(function(res) {
        console.log('fs cleanup acknowledged!');
        $scope.settings.hide();
        //$location.path('#/app/home');
      });
    });
  };
  $scope.dbReset = function () {
    console.log('reset!');
    DatiDB.reset().then(function () {
      console.log('db reset completed!');
      $ionicPopup.alert({
        title: $filter('translate')('settings_data_sync'),
        template: $filter('translate')('settings_done')
      }).then(function(res) {
        console.log('db reset acknowledged!');
        $scope.settings.hide();
        $window.location.reload();
      });
    });
  };
  $scope.dbFullReset = function () {
    console.log('reset!');
    DatiDB.fullreset().then(function(){
      $ionicPopup.alert({
        title: 'RESET',
        template: 'done'
      }).then(function(res) {
        console.log('full db reset acknowledged!');
        $scope.settings.hide();
        $window.location.reload();
      })
    });
  };
  $scope.dbRemoteReset = function () {
    console.log('remote reset!');
    DatiDB.remotereset().then(function(){
      console.log('remote db reset completed!');
      $scope.settings.hide();
      $window.location.reload();
    });
  };

  $scope.testConnReqStart = 0;
  $scope.testConnReqCount = 0;
  $scope.enableTestConnection = function() {
    var curr = new Date().getTime();
    if ($scope.testConnReqStart == 0 || curr - $scope.testConnReqStart > 1000) {
      $scope.testConnReqCount = 0;
      $scope.testConnReqStart = curr;
    }
    $scope.testConnReqCount += 1;
    if ($scope.testConnReqCount == 5) {
      $rootScope.switchTestConnection();
      $ionicPopup.alert({
        title: 'TEST MODE',
        template: $rootScope.TEST_CONNECTION ? $filter('translate')('settings_data_sync_draft_enabled') : $filter('translate')('settings_data_sync_draft_disabled')
      }).then(function(res){
        $scope.dbRemoteReset();
      });
    }
  }
  

  $ionicModal.fromTemplateUrl('templates/credits.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.credits = modal;
  });
  $scope.showCredits = function () {
    $scope.credits.show();
  };

  $ionicModal.fromTemplateUrl('templates/settings.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.settings = modal;
  });
  $scope.showSettings = function () {
    $scope.settings.show();
  };


  $scope.$on('$destroy', function () {
    $scope.credits.remove();
    $scope.settings.remove();
  });
}])

.controller('FavouritesListCtrl', function ($scope, DatiDB) {
  $scope.gotdata = DatiDB.getFavorites().then(function (data) {
    $scope.favorites = data;
  });
})

.controller('CategoriesListCtrl', function ($scope, $stateParams, Config) {
  Config.menuGroup($stateParams.cateId).then(function (g) {
    $scope.group = g;
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


.controller('MenuListCtrl', function ($scope, $stateParams, Config) {
  Config.menuGroup($stateParams.groupId).then(function (g) {
    $scope.group = g;
  });
})
.controller('PageCtrl', function ($scope, $rootScope, $state, $stateParams, $filter, $location, $window, $timeout, Profiling, Config, DatiDB, Files, ListToolbox, DateUtility, GeoLocate, MapHelper, $ionicScrollDelegate, $ionicViewService, $ionicLoading) {
  Profiling.start('page');

  //$scope.results=[];
  //$scope.resultsGroups=[];
  
  $scope._ = _;
  $scope.getLocaleDateString = function (time) {
    return DateUtility.getLocaleDateString($rootScope.lang, time);
  };
  $scope.explicitBack = function () {
    return $state.current && $state.current.data && $state.current.data.explicitBack;
  };
  $scope.bk = function () {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
    //$window.history.back();
  };
  $scope.$on('$destroy', function () {
    $scope.scrolldata = [];
    $scope.groupscrolldata = [];
    $scope.results = [];
    $scope.resultsGroups=[];
    //$scope.resultsAll = [];
    Files.queuedFilesCancel();
  });

  var gotItemData=function (data) {
    Profiling._do('page', 'item:gotdata');
    //console.log('itemId gotdata!');

    if (!data.hasOwnProperty('length')) {
      $scope.obj = data;
      //data = [data];
    } else {
      $scope.results = data;
    }

    $scope.isObjFavorite = false;
    DatiDB.isFavorite(data.id).then(function (res) {
      $scope.isObjFavorite=res; 
    });
    $scope.toggleFavorite = function (obj) {
      DatiDB.setFavorite(obj.id, !$scope.isObjFavorite).then(function (res) {
        $scope.isObjFavorite=res;
      });
    };

    //console.log('data.sonscount='+data.sonscount);
    if (data.parentid) {
      var parenttype=Config.contentKeyFromDbType(data.parenttype);
      //console.log('parent: type='+parenttype);

      var classification;
      if (parenttype=='event' && data.parent.eventForm=='Manifestazione') {
        classification='_complex';
      } else if (data.parent.classification) {
        classification=data.parent.classification.it;
      }
      //console.log('parent: classification='+classification);

      $scope.obj['parentAbsLink']=Config.menuGroupSubgroupByTypeAndClassification(parenttype,classification).then(function(sg){
        if (sg) {
          return 'page/'+sg._parent.id+'/'+sg.id+'/'+data.parentid;
        } else if (classification) {
          return Config.menuGroupSubgroupByTypeAndClassification(parenttype,null).then(function(sg){
            return 'page/'+sg._parent.id+'/'+sg.id+'/'+data.parentid;
          });
        }
      });
    } else if (data.sonscount > 0) {
      //console.log('sons');
      $scope.toggleSons = function () {
        if ($scope.sonsVisible) {
          $scope.sonsVisible = null;
        } else {
          $scope.gotsonsdata = DatiDB.getByParent(null, data.id).then(function (data) {
            if (!$scope.sons) {
              if (data.length > 0 && data[0].fromTime) {
                $scope.sons = $filter('extOrderBy')(data,{order:'DateFrom'});
              } else {
                $scope.sons = data;
              }
            }  
            $scope.sonsVisible = true;
          });
        }
      }
    }

    if (data.location) {
      GeoLocate.locate().then(function (latlon) {
        $scope.distance = GeoLocate.distance(latlon, data.location);
      });
    } else {
      console.log('no known location for place');
    }
  };
  var doListPage=function(sg) {
    if (sg.query.data && sg.query.data.length>0) {
      sg.query['type']=sg.query.data[0].dbType;
    }
    var sg_query_type = sg.query.type || 'content';
    if (sg_query_type.indexOf('it.smartcommunitylab.comuneintasca.core.model.')==0) sg_query_type=Config.contentKeyFromDbType(sg_query_type);
    //console.log('sg_query_type: '+sg_query_type);

    var dbtypeCustomisations = Config.getProfileExtensions()[sg_query_type] || {};
    var dbtypeClass = sg.query.classification || (sg.query.parent?'_parent_':'_none_');
    var dbtypeClassCustomisations = {};
    if (dbtypeCustomisations.classifications && dbtypeCustomisations.classifications[dbtypeClass]) dbtypeClassCustomisations = dbtypeCustomisations.classifications[dbtypeClass];

    /* HANDLE MANY EVENTS: IF TOO MANY EVENTS, FORCE WEEK FILTER */
    if (dbtypeClass == '_parent_' && sg_query_type=='event' && sg.query.sonscount > 50) {
      dbtypeClassCustomisations = { "filter":{ "default":'week' } };
    }

    $scope.template = 'templates/page/' + (sg.view || dbtypeClassCustomisations.view || sg_query_type + '_list') + '.html';
    //console.log('$scope.template: '+$scope.template);

    var dosort = function(data) {
        if (tboptions.hasSort || tboptions.hasSearch) {
          Profiling.start('sort.do');
          $scope.results = [];
          Files.queuedFilesCancel();

          $scope.results = $filter('extOrderBy')(tboptions.getData(data),$scope.ordering);
          if ($scope.resultsGroups) {
            for (idx in $scope.resultsGroups) {
              var group=$scope.resultsGroups[idx];
              if (group.results.length>0) {
                group.results=$filter('extOrderBy')(group.results,$scope.ordering)
              }
            }
          }
          Profiling._do('sort.do');
        }  
    };    

    /** INFINITE LIST SUPPORT FOR NORMAL LISTS */
    $scope.$watch('results', function(n,o) {
      //console.log('******************* $scope.$watch.results: '+($scope.results?$scope.results.length:'NULL'));
      // not for the events where objects are grouped
      if (!$scope.results || sg_query_type=='event') return;

      $scope.scrolldata = null;
      $scope.loadMore();
    });
    $scope.hasMoreDataToLoad = function() {
      return $scope.scrolldata && $scope.results && $scope.scrolldata.length < $scope.results.length;
    }
    $scope.loadMore = function() {
      if ($scope.results) {
        if (!$scope.scrolldata) {
          $scope.scrolldata=$scope.results.slice(0,20);
        } else {
          var delta = $scope.results.slice($scope.scrolldata.length,$scope.scrolldata.length+20);
          $scope.scrolldata = $scope.scrolldata.concat(delta);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      }
    };
    /** INFINITE LIST SUPPORT FOR GROUPPED LISTS */
    $scope.$watch('resultsGroups', function(n,o) {
      //console.log('******************* $scope.$watch.resultsGroups: '+($scope.resultsGroups?$scope.resultsGroups.length:'NULL'));
      $scope.groupscrolldata = null;
      //console.log('resultsGroups changed');
      $scope.loadMoreGroups();
    });
    $scope.hasMoreGroupsToLoad = function() {
      return $scope.groupscrolldata && $scope.resultsGroups && 
      ($scope.groupscrolldata.length < $scope.resultsGroups.length ||
       ($scope.groupscrolldata.length>0 && $scope.groupscrolldata[$scope.groupscrolldata.length-1].results.length < $scope.resultsGroups[$scope.resultsGroups.length-1].results.length) );
    }
    /**
     * gc corresponds to the length of the current loaded data or 1.
     * c corresponds to the num of the elements in the last group loaded
     */
    var subGroups = function(groups, gc, c) {
      var d = 20;
      var res = groups.slice(0,gc - 1);
      for (var i = gc - 1; i < groups.length; i++) {
        var group = groups[i].results;
        if (c + d < group.length) {
          res.push({label:groups[i].label,results:group.slice(0, c + d)});
          return res;
        } else {
          d = d - (group.length - c);
          res.push(groups[i]);
          c = 0;
        }
      }
      return res;
    };
    $scope.loadMoreGroups = function() {
      if ($scope.resultsGroups) {
        if (!$scope.groupscrolldata) {
          $scope.groupscrolldata= subGroups($scope.resultsGroups,1,0);
        } else {
          $scope.groupscrolldata = subGroups($scope.resultsGroups, $scope.groupscrolldata.length, $scope.groupscrolldata[$scope.groupscrolldata.length-1].results.length);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      }
    };

    $scope.groupOffsets=[];
    $scope.heights_header=32;
    $scope.heights_item=99;
    $scope.stickyTopBase=74;
    $scope.stickyTop=$scope.stickyTopBase;
    $scope.stickyLabel=null;
    $scope.checkPosition = function() {
      var listScroll=$ionicScrollDelegate.$getByHandle('listScroll');
      if (listScroll && $scope.resultsGroups && $scope.resultsGroups.length>1) {
        var top=listScroll.getScrollPosition().top;
        var label='';
        for (i in $scope.groupOffsets) {
          i=parseInt(i);
          //console.log($scope.groupOffsets[i]+' <= '+top+($scope.groupOffsets.length>0&&i<$scope.groupOffsets.length-1?' < '+$scope.groupOffsets[i+1]:''));
          if (top>=$scope.groupOffsets[i]) {
            if (i==$scope.groupOffsets.length-1 || top<$scope.groupOffsets[i+1]) {
              label=$scope.groupscrolldata[i].label;
              if (i!=$scope.groupOffsets.length-1 && top>($scope.groupOffsets[i+1]-$scope.heights_header)) {
                deltaUp=$scope.heights_header - ($scope.groupOffsets[i+1]-top);
//console.log('deltaUp: '+deltaUp);
                $timeout(function(){
                  $scope.stickyTop=($scope.stickyTopBase - deltaUp) + 'px';
//console.log('$scope.stickyTop: '+$scope.stickyTop);
                });
              } else {
                if ($scope.stickyTop!=$scope.stickyTopBase) {
                  $timeout(function(){
                    $scope.stickyTop=$scope.stickyTopBase;
                  });
                }
              }
            } 
          }
        }
        if (label!=$scope.stickyLabel) {
          if (label) $timeout(function(){
            $scope.stickyLabel=label;
          });
        }
      } else {
        $scope.stickyLabel=null;
      }
    };          
    $scope.calcGroupOffset = function (index) {
      offset=0;
      for (i in $scope.groupscrolldata) {
        if (i<index) {
          if ($scope.groupscrolldata[i].results.length>0) {
            offset+=$scope.heights_header + $scope.groupscrolldata[i].results.length*$scope.heights_item - 1;
          }
        }
      }
      $scope.groupOffsets[index]=offset;
//console.log('$scope.groupOffsets['+index+']='+offset);
      return offset;
    }

    var tboptions = {
      hasSort: false,
      hasSearch: (sg.query.search || true),
      load: function (cache) {
        if (cache) {
          //console.log('tboptions cache!');
          $scope.results = cache;
        } else {
          if (typeof this.doFilter == 'function') {
            //console.log('tboptions doFilter!');
            this.doFilter(this.defaultFilter);
          } else {
            if (sg.query.itemIds) {
              //console.log('tboptions cate...');
              $scope.gotdbdata =  DatiDB.get(sg_query_type, sg.query.itemIds.join(',')); 
            } else if (sg.query.classification) {
              //console.log('tboptions cate...');
              $scope.gotdbdata = DatiDB.cate(sg_query_type, sg.query.classification, sg.query.parent);
            } else {
              //console.log('tboptions all...');
              $scope.gotdbdata = DatiDB.all(sg_query_type, sg.query.parent);
            }
            $scope.gotdata = $scope.gotdbdata.then(function (data) {
              //console.log('tboptions gotdata!');
              $scope.resultsAll = data;
//                    $scope.results = data;
              dosort(data);
              var listScroll=$ionicScrollDelegate.$getByHandle('listScroll');
              if (!!listScroll) {
                $timeout(function(){ listScroll.scrollTop(false); });
              }
            });
          }
        }
      },
      getData: function (data) {
        return $scope.resultsAll||data;
      },
      getTitle: function () {
        return $scope.title;
      }
    };

    if (sg.query.hasOwnProperty('sort')) {
      tboptions.hasSort = true;
      if (sg.query.sort) {
        tboptions.orderingTypes = sg.query.sort.options;
        tboptions.defaultOrdering = sg.query.sort['default'];
      }
    } else if (sg._parent && sg._parent.hasOwnProperty('sort')) {
      tboptions.hasSort = true;
      if (sg._parent.sort) {
        tboptions.orderingTypes = sg._parent.sort.options;
        tboptions.defaultOrdering = sg._parent.sort['default'];
      }
    } else if (dbtypeClassCustomisations.hasOwnProperty('sort')) {
      tboptions.hasSort = true;
      if (dbtypeClassCustomisations.sort) {
        tboptions.orderingTypes = dbtypeClassCustomisations.sort.options;
        tboptions.defaultOrdering = dbtypeClassCustomisations.sort['default'];
      }
    } else if (dbtypeCustomisations.hasOwnProperty('sort')) {
      tboptions.hasSort = true;
      if (dbtypeCustomisations.sort) {
        tboptions.orderingTypes = dbtypeCustomisations.sort.options;
        tboptions.defaultOrdering = dbtypeCustomisations.sort['default'];
      }
    }

    if (sg.query.hasOwnProperty('map')) {
      tboptions.hasMap = true;
    } else if (sg._parent && sg._parent.hasOwnProperty('map')) {
      tboptions.hasMap = true;
    } else if (dbtypeClassCustomisations.hasOwnProperty('map')) {
      tboptions.hasMap = true;
    } else if (dbtypeCustomisations.hasOwnProperty('map')) {
      tboptions.hasMap = true;
    }


    tboptions.doSort = dosort;

    $scope.filterDef = '';
    if (sg.query.hasOwnProperty('filter') || (sg._parent && sg._parent.hasOwnProperty('filter')) || dbtypeCustomisations.hasOwnProperty('filter')) {

      if (sg_query_type == "hotel") {
        //tboptions.filterOptions = Config.hotelTypesList();
        tboptions.filterOptions = DatiDB.cleanupCatesOfType(Config.hotelTypesList(),sg_query_type);
      } else if (sg_query_type == "restaurant") {
        //tboptions.filterOptions = Config.restaurantTypesList();
        tboptions.filterOptions = DatiDB.cleanupCatesOfType(Config.restaurantTypesList(),sg_query_type);
      }

      tboptions.doFilter = function (filter_default) {
        var loading = $ionicLoading.show({
          template: $filter('translate')(Config.keys()['loading']),
          delay: 600,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        filter=ListToolbox.getState().filter||filter_default;
        //console.log('doFilter("'+filter+'")...');
        var t = 0;
        var d = new Date();
        var f = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime() - 1; //subtracting 1 micro since condition needs just > (not >=)
        //console.log('f: '+f);
                
        if (filter == 'today') {
          t = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime() + 1; //adding 1 micro since condition needs just < (not <=)
        } else if (filter == 'week') {
          t = new Date(d.getFullYear(), d.getMonth(), d.getDate()+7, 23, 59, 59, 999).getTime() + 1; //adding 1 micro since condition needs just < (not <=)
        } else if (filter == 'month') {
          t = new Date(d.getFullYear(), d.getMonth(), d.getDate()+30, 23, 59, 59, 999).getTime() + 1; //adding 1 micro since condition needs just < (not <=)
        } else if (filter == 'all') {
          filter = null;
        }
        //console.log('t: '+t);
        if (t > 0) {
          //console.log('doFilter byTimeInterval...');
          $scope.gotdbdata = DatiDB.byTimeInterval(sg_query_type, f, t, sg.query.classification, null, sg.query.parent);
        } else {
          if (filter) {
            console.log('doFilter FILTER: '+filter);
            $scope.gotdbdata = DatiDB.cate(sg_query_type, filter, sg.query.parent);
          } else {
            $scope.gotdbdata = DatiDB.cate(sg_query_type, sg.query.classification, sg.query.parent);
          }
        }
        $scope.gotdata = $scope.gotdbdata.then(function (data) {
          //console.log('do filter gotdata!');
          if (data) {
            //$scope.results = $filter('extOrderBy')(data,$scope.ordering);
            //$scope.results = data;
            if (sg_query_type=='event') {
              // group by date 
              if (t == 0 && !!data) {
                for (var i = 0; i < data.length; i++) {
                  var elem = data[i];
                  if (t < elem.toTime) t = elem.toTime;
                  if (t < elem.fromTime) t = elem.fromTime;
                }
                var lastDate = new Date(t);
                lastDate = new Date(lastDate.getFullYear(),lastDate.getMonth(),lastDate.getDate()+1);
                t = lastDate.getTime() - 1;
              }
              $scope.resultsAll = DateUtility.filterInterval(data, f+1,t);
              var groups = DateUtility.regroup($scope,sg_query_type,f+1,t,sg.query.classification);
              // ungroup if there are less than 3 events per day
              if (sg.query.parent && groups.length > 1 && $scope.resultsAll.length / groups.length <= 1) {
                groups = DateUtility.flatgroup($scope);
              }
              $scope.resultsGroups = groups;
            } else {
              $scope.resultsAll = data;
              dosort(data);
            }
          } else {
            $scope.results = [];
            $scope.resultsGroups = [];
            $scope.resultsAll = [];
          }
          $ionicLoading.hide();

          var listScroll=$ionicScrollDelegate.$getByHandle('listScroll');
          if (!!listScroll) {
            $timeout(function(){ listScroll.scrollTop(false); });
          }

          if (filter) {
            $scope.filterDef = $scope.filterOptions[filter];
          } else {
            $scope.filterDef = null;
          }
        });
      };
      if (sg.query.hasOwnProperty('filter') && sg.query.filter.hasOwnProperty('options')) {
        tboptions.filterOptions = sg.query.filter.options;
      } else if (sg._parent && sg._parent.hasOwnProperty('filter') && sg._parent.filter.hasOwnProperty('options')) {
        tboptions.filterOptions = sg._parent.filter.options;
      } else if (dbtypeClassCustomisations.hasOwnProperty('filter') && dbtypeClassCustomisations.filter.hasOwnProperty('options')) {
        tboptions.filterOptions = dbtypeClassCustomisations.filter.options;
      } else if (dbtypeCustomisations.hasOwnProperty('filter') && dbtypeCustomisations.filter.hasOwnProperty('options')) {
        tboptions.filterOptions = dbtypeCustomisations.filter.options;
      }
      if (sg.query.hasOwnProperty('filter') && sg.query.filter.hasOwnProperty('default')) {
        tboptions.defaultFilter = sg.query.filter['default'];
      } else if (sg._parent && sg._parent.hasOwnProperty('filter') && sg._parent.filter.hasOwnProperty('default')) {
        tboptions.defaultFilter = sg._parent.filter['default'];
      } else if (dbtypeClassCustomisations.hasOwnProperty('filter') && dbtypeClassCustomisations.filter.hasOwnProperty('default')) {
        tboptions.defaultFilter = dbtypeClassCustomisations.filter['default'];
      } else if (dbtypeCustomisations.hasOwnProperty('filter') && dbtypeCustomisations.filter.hasOwnProperty('default')) {
        tboptions.defaultFilter = dbtypeCustomisations.filter['default'];
      }

    }
    if (tboptions.hasMap || tboptions.hasFilter || tboptions.hasSort || tboptions.hasSearch) {
      //console.log('ListToolbox.prepare()...');
      ListToolbox.prepare($scope, tboptions);
      $scope.$watch('ordering.searchText', function(newValue, oldValue) {
        if (newValue!=oldValue) {
          //console.log('search for: '+newValue+' ('+oldValue+')');
          if (sg_query_type=='event') {
            $scope.resultsGroups = DateUtility.regroup($scope,sg_query_type,0,0,sg.query.classification);
          } else {
            dosort();
          }
        }
      });
      //console.log('ListToolbox prepared!');
    } else {
      //console.log('sg.query.classification: '+sg.query.classification);
      if (sg.query.classification) {
        $scope.gotdbdata = DatiDB.cate(sg_query_type, sg.query.classification, sg.query.parent);
      } else {
        $scope.gotdbdata = DatiDB.all(sg_query_type, sg.query.parent);
      }
      $scope.gotdata = $scope.gotdbdata.then(function (data) {
        Profiling._do('page', 'list:gotdata');
        //console.log('list gotdata!');
        //$scope.results = data;
        dosort(data);
      });
    }
  };
  
  //console.log('$stateParams.groupId: ' + $stateParams.groupId);
  //console.log('$stateParams.menuId: ' + $stateParams.menuId);
  if ($stateParams.groupId=='highlights') {
    Config.highlights().then(function(items) {
      console.log('$stateParams.itemId: '+$stateParams.itemId);
      if (!$stateParams.itemId) return;
      for (idx in items) {
        var item=items[idx];
        if (item.objectIds.join(',')==$stateParams.itemId) {
          if (item.type == 'text') item.type = 'content';
          // temporary fix
          var type=item.type||'content';
          //console.log('highlight('+type+'): '+JSON.stringify(item));
/*
          if (item.ref) {
            var res = Config.menuById(item.ref);
            alert(res);
          }
*/
          $scope.title = $filter('translate')(item.name);

          if ($state.current.data && $state.current.data.sons) {
            //console.log('sons sublist...');
//            DatiDB.getByParent(null, $stateParams.itemId).then(function (data) {
//              doListPage({query:{data:data,parent:$stateParams.itemId}});
//            });
              doListPage({query:{data:null, type: 'event', parent:$stateParams.itemId, sonscount: $stateParams.sonscount}});
          } else {
            $scope.gotdata = DatiDB.get(type, item.objectIds.join(',')).then(function (data) {
              var sg_query_type = null;
              if (data.hasOwnProperty('length')) {
                sg_query_type =  data[0].dbType;
              } else {
                sg_query_type =  data.dbType;
                data = [data];
              }
              if (sq_query_type == 'content' || data.length <= 1){
                $scope.template = 'templates/page/' + sg_query_type + '.html';
              } else {
                $scope.template = 'templates/page/' + sg_query_type + '_list.html';
              }

              if (data.length==1) {
                gotItemData(data[0]);
              } else {
                $scope.results = data;
              }
            });
          }
        }
      }
    });
  } else {    
    //console.log('$stateParams.groupId: '+$stateParams.groupId);
    //console.log('$stateParams.menuId: '+$stateParams.menuId);
    //console.log('$stateParams.itemId: '+$stateParams.itemId);
    Config.menuGroupSubgroup($stateParams.groupId, $stateParams.menuId||$stateParams.itemId).then(function (sg) {
      Profiling._do('page', 'menuGroupSubgroup found');
      if (!sg) {
        console.log('GROUP ERRROR '+$stateParams.groupId+'/'+$stateParams.menuId);
      }

      $scope.title = sg.name;
      
      if ($stateParams.itemId != '') {
        //console.log('$stateParams.itemId: '+$stateParams.itemId);
        Profiling._do('page', 'item');

        if ($state.current.data && $state.current.data.sons) {
          console.log('sons sublist...');
          //DatiDB.getByParent(null, $stateParams.itemId).then(function (data) {
          //  doListPage({query:{data:data,parent:$stateParams.itemId}});
          //});
          doListPage({query:{data:null,type:'event',parent:$stateParams.itemId, sonscount: $stateParams.sonscount}});
        } else {
          var sg_query_type= (sg.query ? sg.query.type : null) || sg.type || (sg._parent ? sg._parent.type : null) || 'content';
//          var sg_query_type=sg.query.type || 'content';

          $scope.gotdata = DatiDB.get(sg_query_type, $stateParams.itemId).then(gotItemData);
          $scope.template = 'templates/page/' + (sg.view || sg_query_type) + '.html';
          //console.log('$scope.template: '+$scope.template);
        };

        Profiling._do('page', 'item.done');
      }
      
      else if (sg.query) {
        Profiling._do('page', 'list');
        doListPage(sg);
        Profiling._do('page', 'list.done');
      } else if (sg.objectIds) {
        console.log('objectIds: '+sg.objectIds.join(','));
        //console.log('$scope.template: '+$scope.template);

        if ($state.current.data && $state.current.data.sons) {
          console.log('sons sublist...');
//          DatiDB.getByParent(null, sg.objectIds.join(',')).then(function (data) {
//            doListPage({query:{data:data,parent:sg.objectIds.join(',')}});
//          });
            doListPage({query:{data:null,type:'event',parent:sg.objectIds.join(','), sonscount: $stateParams.sonscount}});
        } else {
          var sg_type=sg.type || sg._parent.type || 'content';
          if (sg_type=='text') sg_type='content';

          var templateName = (sg.view || sg_type || sg._parent.view || 'content');
          if (templateName != 'content' && sg.objectIds.length > 1) {
            doListPage({query:{data:null,type:sg_type,itemIds:sg.objectIds, sonscount: $stateParams.sonscount}});
          } else {
            $scope.template = 'templates/page/' + templateName + '.html';
            $scope.gotdata = DatiDB.get(sg_type, sg.objectIds.join(',')).then(gotItemData);
          }
        }
      } else {
        console.log('unkown menu object type!');
      }
    });
  }
  Profiling._do('page', 'DONE');
})


.controller('MapCtrl',['$scope', '$q', 'MapHelper', '$ionicScrollDelegate', '$timeout', 'GoogleMapApi'.ns(), function ($scope, $q, MapHelper, $ionicScrollDelegate, $timeout, GoogleMapApi) {
  $scope._ = _;
  
  var gotheight=$q.defer();
  $scope.$on('$viewContentLoaded', function () {
    var mapHeight = 10; // or any other calculated value
    mapHeight = angular.element(document.querySelector('#map1-container'))[0].offsetHeight;
    //console.log('mapheight: '+mapHeight);
    gotheight.resolve(mapHeight + 40);
  });

  MapHelper.start($scope);
  GoogleMapApi.then(function(maps) {
    console.log('GoogleMapApi is READY!!!');
    gotheight.promise.then(function(mapHeight){
      angular.element(document.querySelector('#map1 .angular-google-map-container'))[0].style.height = mapHeight + 'px';
    });
  },function(err){
    console.log('GoogleMapApi is NOT AVAILABLE!!!');
  });
}])


.controller('TestCtrl', function ($scope, DatiDB, Config) {
  $scope.test='test page...';
  DatiDB.cleanupCatesOfType(Config.hotelTypesList(),'hotel').then(function(filteredCategories){
    $scope.cates=filteredCategories;
  });
  //$scope.cates = DatiDB.cleanupCatesOfType(Config.restaurantTypesList(),'restaurant');
})
