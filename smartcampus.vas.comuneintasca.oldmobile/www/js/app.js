// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'localization', 'ngCordova' ])

.run(function($ionicPlatform, $rootScope, $cordovaDevice) {
	$rootScope.appWebPage=function(){
		window.open('http://www.comune.trento.it/Aree-tematiche/Turismo/Servizi-turistici/Il-Comune-in-tasca', '_system');
	};
	$rootScope.appDownload=function(){
    if (ionic.Platform.isWebView()) {
      cordova.plugins.startapp.start({
        android: 'it.smartcampuslab.comuni.trento',
				ios: 'https://itunes.apple.com/app/id881529924'
      }, function () {
        console.log('START APP: success.');
      }, function () {
        console.log('START APP: failed!');

				if ($rootScope.platform == 'Android') {
					window.open('https://play.google.com/store/apps/details?id=eu.trentorise.smartcampus.viaggiatrento', '_system');
				} else if ($rootScope.platform == 'iOS') {
					window.open('https://itunes.apple.com/app/id881529924', '_system');
				} else {
					$rootScope.appWebPage();
				}
      });
    } else {
			$rootScope.appWebPage();
    }
	};

	$ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
		if (window.device) $rootScope.platform=device.platform;
  });
})
