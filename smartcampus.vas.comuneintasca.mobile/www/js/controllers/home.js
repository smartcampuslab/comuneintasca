angular.module('ilcomuneintasca.controllers.home', [])

.controller('HomeCtrl', function ($scope, $rootScope, $ionicSlideBoxDelegate, $q, $location, $filter, $ionicPopup, Config, DatiDB, Files) {
  $rootScope.inHome = true;
  $scope.openApp = function (appname,appdata) {
    if (ionic.Platform.isWebView() && device.platform == 'Android' && appdata.android) {
      cordova.plugins.startapp.start({
        android: appdata.android
      }, function () {
        //console.log('android app "'+appdata.android+'" success!');
      }, function () {
        console.log('app "'+appdata.android+'" failed!');
        window.open('https://play.google.com/store/apps/details?id='+appdata.android, '_system');
      });
    } else if (ionic.Platform.isWebView() && device.platform == 'iOS ' && appdata.ios) {
      window.open('itms-apps://itunes.apple.com/app/id'+appdata.ios, '_system');
    } else {
      var alertPopup = $ionicPopup.alert({
        title: $filter('translate')(appname),
        template: $filter('translate')(Config.keys()['coming_soon'])
      });
      alertPopup.then(function (res) {
        //console.log('app "'+JSON.stringify(appdata)+'" done');
      });
    }
  };
  $scope.gotoButton = function (btn) {
    if (btn.app) {
      $scope.openApp(btn.name,btn.app);
    } else if (btn.ref) {
      if (btn.ref == 'profile_cit_csvimport_Percorsi_item_comuneintasca') {
        $rootScope.goto('itineraries');
      }
      else if (btn.ref=='itineraries' || btn.ref=='favorites') {      
        $rootScope.goto(btn.ref);
      } else {
        $rootScope.goto('menu/'+btn.ref+'/');
      }
    }
  }
/*
  $scope.goToItem = function (link) {
    console.log("goToItem('"+link+"')");
    if (link.charAt(0)=='/') {
      $location.path(link.substring(1));
    } else {
      $location.path($location.path+'/'+link);
    }
  }
*/
 
  $scope.highlights = null;
  var defaultHighlight = {
    id: null,
    name:{ 'it':'Ricadi', 'en':'Ricadi', 'de':'Ricadi' },
    image: 'img/hp-box/citta.png',
    ref: 'info'
  };
  DatiDB.sync().then(function (data) {
/*
    var homeObjects = JSON.parse(localStorage.homeObjects);
    DatiDB.getAny(homeObjects).then(function (data) {
      var highlights = [defaultHighlight];
      for (var i = 0; i < data.length; i++) highlights.push(data[i]);
      $scope.highlights = highlights;
    });
*/
    Config.highlights().then(function(items) {
      if (items && items.length) {
        //console.log('highlights.length: '+items.length);
        var highlights = [];

        var hlVerifiedObjects = [];
        var hlVerificationsPromises = [];
        for (hli=0; hli<items.length; hli++) {
          var item=items[hli];
          if (item.objectIds) {
            //console.log('adding items "'+item.objectIds+'"...');
            hlVerificationsPromises.push(DatiDB.checkIDs(item.objectIds,item).then(function(ids){
              hlVerifiedObjects.push(ids);
              //console.log('verified items "'+ids+'"');
            },function(rr){
              console.log('missing objectIds "'+rr[0]+'" '+(rr[1]&&rr[1].id?'for highlight item "'+rr[1].id+'"':''));
            }));
          } else {
            console.log('unknown highlight type for "'+(item.id||item)+'"');
          }
        }
        if (hlVerificationsPromises.length>0) {
          $q.all(hlVerificationsPromises).then(function(){
            if (hlVerifiedObjects.length>0) {
              var highlightsVerified = [];
              for (hli=0; hli<items.length; hli++) {
                var item=items[hli];
                //console.log('highlight.objectIds: '+item.objectIds);
                for (vi=0; vi<hlVerifiedObjects.length; vi++) {
                  if (item.objectIds==hlVerifiedObjects[vi]) {
                    item.title=item.name;
                    item.abslink='/app/page/highlights/'+item.objectIds.join(',');
                    highlightsVerified.push(item);
                    break;
                  }
                }
              }
              /*  
              for (var i = 0 ; i < items.length; i++) {
                if (items[i].ref && !items[i].objectIds) {
                  highlightsVerified.push(items[i]);
                }  
              }
              */
              $scope.highlights=highlightsVerified;
              $ionicSlideBoxDelegate.update();
            }
          })
        } else if (highlights.length>0) {
          $scope.highlights=highlights;
        } else {
          $scope.highlights = [ defaultHighlight ];
        }
      }
    },function(menu) {
      console.log('error getting highligts from profile');
      $scope.highlights = [ defaultHighlight ];
    });

    Config.navigationItems().then(function(items) {
      if (items) {
        if (items[items.length-1] && items[items.length-1].id != 'preferiti'){
          // hardcoded favourites
          items.push({
            "id": "preferiti",
            "name": {
              "it": "PREFERITI",
              "en": "FAVORITES",
              "de": "LIEBLINGSSEITEN"
            },
            "description": null,
            "image": null,
            "objectIds": null,
            "items": null,
            "query": null,
            "ref": "favorites",
            "type": null,
            "app": null
          });
        }
        var rows=[], row=-1;
        for (ii=0; ii<items.length; ii++) {
          if ((ii%2)==0) {
            row++;
            rows[row]=[];
          }
          rows[row].push(items[ii]);
        }
        $scope.buttonsRows=rows;
      }
    },function(menu) {
      $scope.buttonRows=null;
    });

    Files.cleanup().then(function (data) {
      //console.log('files cleaned!');
    },function(){
      console.log('files cleaning error!');      
    });
  });

  var navbarElement = angular.element(document.getElementById('navbar'));
  navbarElement.addClass('bar-comuni-home');
  $scope.$on('$destroy', function () {
    navbarElement.removeClass('bar-comuni-home');
  });
})
