angular.module('ilcomuneintasca.controllers.common', [])

.controller('MenuCtrl', function ($scope, $rootScope, $location, $ionicModal, $ionicLoading, $filter, Config, Files, DatiDB) {
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
    localStorage.lastFileCleanup = -1;
    Files.cleanup().then(function () {
      console.log('fs cleanup completed!');
      $location.path('#/app/home')
      $scope.settings.hide()
    });
  };
  $scope.dbReset = function () {
    console.log('sync!');
    DatiDB.reset().then(function () {
      console.log('db reset completed!');
      $location.path('#/app/home')
      $scope.settings.hide()
    });
  };


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
})

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

.controller('PageCtrl', function ($scope, $state, $stateParams, $filter, $location, $window, Config, DatiDB, ListToolbox, DateUtility, GeoLocate, MapHelper, $ionicScrollDelegate) {
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

  //console.log('$stateParams.groupId: ' + $stateParams.groupId);
  //console.log('$stateParams.menuId: ' + $stateParams.menuId);
  if ($stateParams.groupId=='highlights') {
    Config.highlights().then(function(items) {
      if ($stateParams.itemId != '') {
        for (idx in items) {
          var item=items[idx];
          if (item.type == 'text') item.type = 'content';
          // temporary fix
          var type=item.type||'content';
          
          console.log('item('+type+'): '+JSON.stringify(item));
          if (item.objectIds.join(',')==$stateParams.itemId) {
            console.log('QUELO! '+item.objectIds.join(','));
            $scope.title = $filter('translate')(item.name);
            $scope.gotdata = DatiDB.get(type, item.objectIds.join(',')).then(function (data) {
              var dbType = null;
              if (data.hasOwnProperty('length')) {
                dbType =  data[0].dbType;
              } else {
                dbType =  data.dbType;
                data = [data];
              }
              if (data.length==1) {
                $scope.obj = data[0];
              } else {
                $scope.results = data;
              }
              console.log('highlight ('+dbType+') gotdata!');
              $scope.template = 'templates/page/' + dbType + '.html';
            });
          }
        }
      } else {
        //TO-DO
      }
    });
  /*
        var sg_query_type=sg.query.type || 'content';
        if (sg_query_type.indexOf('eu.trentorise.smartcampus.comuneintasca.model.')==0) sg_query_type=Config.contentKeyFromDbType(sg_query_type);
        var dbtypeCustomisations = Config.getProfileExtensions()[sg_query_type] || {};
        var dbtypeClass = sg.query.classification || '_none_';
        var dbtypeClassCustomisations = {};
        if (dbtypeCustomisations.classifications && dbtypeCustomisations.classifications[dbtypeClass]) dbtypeClassCustomisations = dbtypeCustomisations.classifications[dbtypeClass];

        if ($stateParams.itemId != '') {
          $scope.template = 'templates/page/' + (sg.view || sg_query_type) + ($state.current.data && $state.current.data.sons ? '_sons' : '') + '.html';
  */
  } else {

    Config.menuGroupSubgroup($stateParams.groupId, $stateParams.menuId).then(function (sg) {
      if (!sg) {
        console.log('GROUP ERRROR '+$stateParams.groupId);
      }

      $scope.title = sg.name;
      if (sg.query) {
        var sg_query_type=sg.query.type || 'content';
        if (sg_query_type.indexOf('eu.trentorise.smartcampus.comuneintasca.model.')==0) sg_query_type=Config.contentKeyFromDbType(sg_query_type);
        var dbtypeCustomisations = Config.getProfileExtensions()[sg_query_type] || {};
        var dbtypeClass = sg.query.classification || '_none_';
        var dbtypeClassCustomisations = {};
        if (dbtypeCustomisations.classifications && dbtypeCustomisations.classifications[dbtypeClass]) dbtypeClassCustomisations = dbtypeCustomisations.classifications[dbtypeClass];

        if ($stateParams.itemId != '') {
          $scope.template = 'templates/page/' + (sg.view || sg_query_type) + ($state.current.data && $state.current.data.sons ? '_sons' : '') + '.html';
          $scope.gotdata = DatiDB.get(sg_query_type, $stateParams.itemId).then(function (data) {
            //console.log('itemId gotdata!');
            $scope.obj = data;


            if (data.parentid) {
              console.log('siblings');

              $scope.gotsonsdata = DatiDB.getByParent(sg_query_type, data.parentid).then(function (data) {
                $scope.sons = data;
                $scope.siblingscount = data.length;
              });

              $scope.toggleSiblings = function () {
                if ($scope.sonsVisible) {
                  $scope.sonsVisible = null;
                } else {
                  $scope.gotsonsdata.then(function () {
                    $scope.sonsVisible = true;
                  })
                }
              }
            } else if (data.sonscount > 0) {
              console.log('sons');

              $scope.toggleSons = function () {
                if ($scope.sonsVisible) {
                  $scope.sonsVisible = null;
                } else {
                  $scope.gotsonsdata = DatiDB.getByParent(sg_query_type, data.id).then(function (data) {
                    if (!$scope.sons) $scope.sons = data;
                    $scope.sonsVisible = true;
                  });
                }
              }

              if ($state.current.data && $state.current.data.sons) {
                //console.log('sons');
                $scope.gotsonsdata = DatiDB.getByParent(sg_query_type, data.id).then(function (data) {
                  $scope.sons = data;
                });
              }
            }

            if (data.location) {
              GeoLocate.locate().then(function (latlon) {
                $scope.distance = GeoLocate.distance(latlon, data.location);
              });
            } else {
              console.log('no known location for place');
            }
          })
        } else {
          $scope.template = 'templates/page/' + (sg.view || dbtypeClassCustomisations.view || sg_query_type + '_list') + '.html';

          var tboptions = {
            hasSort: false,
            hasSearch: (sg.query.search || true),
            load: function (cache) {
              if (cache) {
                $scope.results = cache;
              } else {
                if (typeof this.doFilter == 'function') {
                  this.doFilter(this.defaultFilter);
                } else {
                  if (sg.query.classification) {
                    $scope.gotdbdata = DatiDB.cate(sg_query_type, sg.query.classification);
                  } else {
                    $scope.gotdbdata = DatiDB.all(sg_query_type);
                  }
                  $scope.gotdata = $scope.gotdbdata.then(function (data) {
                    //console.log('tboptions gotdata!');
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
            tboptions.hasSort = true
            tboptions.orderingTypes = sg.query.sort.options;
            tboptions.defaultOrdering = sg.query.sort.default;
          } else if (sg._parent.hasOwnProperty('sort')) {
            tboptions.hasSort = true
            tboptions.orderingTypes = sg._parent.sort.options;
            tboptions.defaultOrdering = sg._parent.sort.default;
          } else if (dbtypeClassCustomisations.hasOwnProperty('sort')) {
            tboptions.hasSort = true
            tboptions.orderingTypes = dbtypeClassCustomisations.sort.options;
            tboptions.defaultOrdering = dbtypeClassCustomisations.sort.default;
          } else if (dbtypeCustomisations.hasOwnProperty('sort')) {
            tboptions.hasSort = true
            tboptions.orderingTypes = dbtypeCustomisations.sort.options;
            tboptions.defaultOrdering = dbtypeCustomisations.sort.default;
          }

          if (sg.query.hasOwnProperty('map')) {
            tboptions.hasMap = true;
          } else if (sg._parent.hasOwnProperty('map')) {
            tboptions.hasMap = true;
          } else if (dbtypeClassCustomisations.hasOwnProperty('map')) {
            tboptions.hasMap = true;
          } else if (dbtypeCustomisations.hasOwnProperty('map')) {
            tboptions.hasMap = true;
          }

          $scope.filterDef = '';
          if (sg.query.hasOwnProperty('filter') || sg._parent.hasOwnProperty('filter') || dbtypeCustomisations.hasOwnProperty('filter')) {

            if (sg_query_type == "hotel") {
              tboptions.filterOptions = Config.hotelTypesList();
            } else if (sg_query_type == "restaurant") {
              tboptions.filterOptions = Config.restaurantTypesList();
            }

            tboptions.doFilter = function (filter) {
              //console.log('doFilter()...');
              var t = 0;
              var d = new Date();
              var f = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - 1;
              if (filter == 'today') {
                t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
              } else if (filter == 'week') {
                t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7).getTime();
              } else if (filter == 'month') {
                t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 30).getTime();
              }
              //console.log('f: '+f);
              //console.log('t: '+t);
              if (t > 0) {
                console.log('sg.query.classification: '+sg.query.classification);
                console.log('sg_query_type: '+sg_query_type);
                if (sg.query.classification) {
                  $scope.gotdbdata = DatiDB.byTimeInterval(sg_query_type, f, t, sg.query.classification);
                } else {
                  $scope.gotdbdata = DatiDB.byTimeInterval(sg_query_type, f, t, null);
                }
              } else {
                if (filter) {
                  $scope.gotdbdata = DatiDB.cate(sg_query_type, filter);
                } else {
                  if (sg.query.classification) {
                    $scope.gotdbdata = DatiDB.cate(sg_query_type, sg.query.classification);
                  } else {
                    $scope.gotdbdata = DatiDB.all(sg_query_type);
                  }
                }
              }
              $scope.gotdata = $scope.gotdbdata.then(function (data) {
                //console.log('do filter gotdata!');
                if (data) {
                  //$scope.results = $filter('extOrderBy')(data,$scope.ordering);
                  $scope.results = data;
                } else {
                  $scope.results = [];
                }
                $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);

                if (filter) {
                  $scope.filterDef = $scope.filterOptions[filter];
                } else {
                  $scope.filterDef = null;
                }
              });
            };
            if (sg.query.hasOwnProperty('filter') && sg.query.filter.hasOwnProperty('options')) {
              tboptions.filterOptions = sg.query.filter.options;
            } else if (sg._parent.hasOwnProperty('filter') && sg._parent.filter.hasOwnProperty('options')) {
              tboptions.filterOptions = sg._parent.filter.options;
            } else if (dbtypeClassCustomisations.hasOwnProperty('filter') && dbtypeClassCustomisations.filter.hasOwnProperty('options')) {
              tboptions.filterOptions = dbtypeClassCustomisations.filter.options;
            } else if (dbtypeCustomisations.hasOwnProperty('filter') && dbtypeCustomisations.filter.hasOwnProperty('options')) {
              tboptions.filterOptions = dbtypeCustomisations.filter.options;
            }
            if (sg.query.hasOwnProperty('filter') && sg.query.filter.hasOwnProperty('default')) {
              tboptions.defaultFilter = sg.query.filter.default;
            } else if (sg._parent.hasOwnProperty('filter') && sg._parent.filter.hasOwnProperty('default')) {
              tboptions.defaultFilter = sg._parent.filter.default;
            } else if (dbtypeClassCustomisations.hasOwnProperty('filter') && dbtypeClassCustomisations.filter.hasOwnProperty('default')) {
              tboptions.defaultFilter = dbtypeClassCustomisations.filter.default;
            } else if (dbtypeCustomisations.hasOwnProperty('filter') && dbtypeCustomisations.filter.hasOwnProperty('default')) {
              tboptions.defaultFilter = dbtypeCustomisations.filter.default;
            }

          }
          if (tboptions.hasMap || tboptions.hasFilter || tboptions.hasSort || tboptions.hasSearch) {
            //console.log('ListToolbox.prepare()...');
            ListToolbox.prepare($scope, tboptions);
          } else {
            //console.log('sg.query.classification: '+sg.query.classification);
            if (sg.query.classification) {
              $scope.gotdbdata = DatiDB.cate(sg_query_type, sg.query.classification);
            } else {
              $scope.gotdbdata = DatiDB.all(sg_query_type);
            }
            $scope.gotdata = $scope.gotdbdata.then(function (data) {
              //console.log('list gotdata!');
              $scope.results = data;
            });
          }
        }
      } else if (sg.objectIds) {
        console.log('objectIds: '+sg.objectIds.join(','));
        var sg_type=sg.type || sg._parent.type || 'content';
        if (sg_type=='text') sg_type='content';
        $scope.template = 'templates/page/' + (sg.view || sg_type || sg._parent.view || 'content') + '.html';
        console.log('$scope.template: '+$scope.template);
        $scope.gotdata = DatiDB.get(sg_type, sg.objectIds.join(',')).then(function (data) {
          //console.log('objectIds gotdata!');
          data = (data.hasOwnProperty('length') ? data : [data]);
          $scope.results = data;
        });
      } else {
        console.log('unkown menu object type!');
      }
    });
  }
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
