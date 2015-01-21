// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'localization', 'ngCordova'])

.run(function ($ionicPlatform, $rootScope, $timeout, $filter) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
		if (ionic.Platform.isWebView()) {
			$timeout(function(){
				document.addEventListener("deviceready", function () {
					if (window.device) {
						$rootScope.platform = window.device.platform;
						//console.log('$rootScope.platform=' + $rootScope.platform);
						$rootScope.iosPlatform = ($rootScope.platform == 'iOS');
						$rootScope.androidPlatform = ($rootScope.platform == 'Android');
					} else {
						$rootScope.webPlatform = true;
					}
				});
			});
		} else {
			//$rootScope.platform = 'iOS';
			//$rootScope.iosPlatform = true;
			$rootScope.webPlatform = true;
		}
	});

	$rootScope.androidUninstall = function (text) {
    var oldpkgName='it.comunitrentini.comuneintasca';
    var marketurl='market://details?id='+oldpkgName;
    console.log('opening market: '+marketurl);
    window.open(marketurl, '_system');
	};
	$rootScope.translate = function (text) {
    return $filter('i18n')(text);
	};

	$rootScope.appDownload = function () {
		if (ionic.Platform.isWebView()) {
			if ($rootScope.platform == 'iOS') {
				itmsurl='https://itunes.apple.com/app/id881529924';
				//console.log('opening  appstore: '+itmsurl);
				window.open(itmsurl, '_system');
			} else {
				var pkgName='it.smartcampuslab.comuni.trento';
				cordova.plugins.startapp.start({
					android: pkgName
				}, function () {
					console.log('START APP: success.');
				}, function () {
					console.log('START APP: failed!');
					setTimeout(function(){
						var marketurl='market://details?id='+pkgName;
						console.log('opening market: '+marketurl);
						window.open(marketurl, '_system');
					},0);
				});
			}
		} else {
			window.open('http://www.comune.trento.it/Aree-tematiche/Turismo/Servizi-turistici/Il-Comune-in-tasca', '_system');
		}
	};

})
