angular.module('ilcomuneintasca.controllers.home', [])

.controller('HomeCtrl', function ($scope, $rootScope, $location, $filter, $ionicPopup, Config, DatiDB, Files) {
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
    if (btn.hasOwnProperty('app')) {
      $scope.openApp(btn.name,btn.app);
    } else if (btn.hasOwnProperty('ref')) {
      if (btn.ref=='itineraries') {
        $rootScope.goto('itineraries');
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
  $scope.slides = null;

  var defaultSlide = {
    title: 'Trento',
    img: 'img/hp-box/trento.png',
    id: null,
    ref: '#/app/contents/text.3001,text.3004'
  };

  var navbarElement = angular.element(document.getElementById('navbar'));
  navbarElement.addClass('bar-comuni-home');
  $scope.$on('$destroy', function () {
    navbarElement.removeClass('bar-comuni-home');
  });

  Config.navigationItems().then(function(items) {
    if (items) {
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

  DatiDB.sync().then(function (data) {
    var homeObject = JSON.parse(localStorage.homeObject);
    var homeObjects = homeObject.contentIds;
    DatiDB.getAny(homeObjects).then(function (data) {
      var slides = [defaultSlide];
      for (var i = 0; i < data.length; i++) {
        slides.push({
          title: $filter('translate')(data[i].title),
          img: data[i].image,
          id: data[i].id,
          ref: data[i].abslink
        });
      }
      if (slides.length > 0) {
        $scope.slides = slides;
      }
    });
  });

  Files.cleanup().then(function (data) {
    //console.log('files cleaned!');
  });
})
