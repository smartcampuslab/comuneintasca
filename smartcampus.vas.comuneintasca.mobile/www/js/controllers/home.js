angular.module('ilcomuneintasca.controllers.home', [])

.controller('HomeCtrl', function ($scope, $rootScope, DatiDB, Files, $filter, $ionicSlideBoxDelegate, $ionicPopup, $location, Config) {
  $rootScope.inHome = true;
  var navbarElement = angular.element(document.getElementById('navbar'));
  navbarElement.addClass('bar-comuni-home');
  $scope.$on('$destroy', function () {
    navbarElement.removeClass('bar-comuni-home');
  });

  var defaultSlide = {
    title: 'Trento',
    img: 'img/hp-box/trento.png',
    id: null,
    ref: '#/app/contents/text.3001,text.3004'
  };

  $scope.slides = null;
  $scope.goToItem = function (link) {
    $location.path(link.substring(1));
  }

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
        //$ionicSlideBoxDelegate.update();
      }
    });
  });

  Files.cleanup().then(function (data) {
    //console.log('files cleaned!');
  });

  $scope.openViaggiaTrento = function () {
    if (ionic.Platform.isWebView() && device.platform == 'Android') {
      cordova.plugins.startapp.start({
        android: 'eu.trentorise.smartcampus.viaggiatrento'
      }, function () {
        console.log('VIAGGIA TRENTO: success.');
      }, function () {
        console.log('VIAGGIA TRENTO: failed!');
        window.open('https://play.google.com/store/apps/details?id=eu.trentorise.smartcampus.viaggiatrento', '_system');
      });
    } else {
      //window.open('https://play.google.com/store/apps/details?id=eu.trentorise.smartcampus.viaggiatrento', '_blank');
      var alertPopup = $ionicPopup.alert({
        title: 'Viaggia Trento',
        template: Config.textTypesList()['In preparazione...'][$rootScope.lang]
      });
      alertPopup.then(function (res) {
        console.log('viagga trento done');
      });
    }
  };
})
