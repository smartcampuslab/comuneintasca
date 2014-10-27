#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];


//
// This hook copies various resource files 
// into the appropriate platform specific location
//
var android_filestocopy = [
{
    "config/AndroidManifest.xml": "platforms/android/AndroidManifest.xml"
},

{
    "config/translations/values/strings.xml": "platforms/android/res/values/strings.xml"
}, {
    "config/translations/values-it/strings.xml": "platforms/android/res/values-it/strings.xml"
}, {
    "config/translations/values-de/strings.xml": "platforms/android/res/values-de/strings.xml"
},

// cd config/ticons && gulp android-icons
{
    "Resources/android/appicon.png": "platforms/android/res/drawable/icon.png"
}, {
    "config/ticons/platform/android/res/drawable-ldpi/appicon.png": "platforms/android/res/drawable-ldpi/icon.png"
}, {
    "config/ticons/platform/android/res/drawable-mdpi/appicon.png": "platforms/android/res/drawable-mdpi/icon.png"
}, {
    "config/ticons/platform/android/res/drawable-hdpi/appicon.png": "platforms/android/res/drawable-hdpi/icon.png"
}, {
    "config/ticons/platform/android/res/drawable-xhdpi/appicon.png": "platforms/android/res/drawable-xhdpi/icon.png"
}, {
    "config/ticons/platform/android/res/drawable-xxhdpi/appicon.png": "platforms/android/res/drawable-xxhdpi/icon.png"
}, {
    "config/ticons/platform/android/res/drawable-xxxhdpi/appicon.png": "platforms/android/res/drawable-xxxhdpi/icon.png"
}
];

var iphone_filestocopy = [
// ticons icons -d . -p iphone icon.png 
{
    "config/ticons/Resources/iphone/appicon-Small-40@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-40@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-Small-40.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-40.png"
}, {
    "config/ticons/Resources/iphone/appicon-Small-50@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-50@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-Small-50.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-50.png"
}, {
    "config/ticons/Resources/iphone/appicon-60@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-60@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-60.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-60.png"
}, {
    "config/ticons/Resources/iphone/appicon-72@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-72@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-72.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-72.png"
}, {
    "config/ticons/Resources/iphone/appicon-76@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-76@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-76.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-76.png"
}, {
    "config/ticons/Resources/iphone/appicon-Small@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-small@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-Small.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-small.png"
}, {
    "config/ticons/Resources/iphone/appicon@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon.png"
},

{
    "config/it.lproj/InfoPlist.strings": "platforms/ios/Trento - Il Comune in Tasca/Resources/it.lproj/InfoPlist.strings"
}, {
    "config/en.lproj/InfoPlist.strings": "platforms/ios/Trento - Il Comune in Tasca/Resources/en.lproj/InfoPlist.strings"
}, {
    "config/de.lproj/InfoPlist.strings": "platforms/ios/Trento - Il Comune in Tasca/Resources/de.lproj/InfoPlist.strings"
}, {
    "config/it.lproj/Localizable.strings": "platforms/ios/Trento - Il Comune in Tasca/Resources/it.lproj/Localizable.strings"
}, {
    "config/en.lproj/Localizable.strings": "platforms/ios/Trento - Il Comune in Tasca/Resources/en.lproj/Localizable.strings"
}, {
    "config/de.lproj/Localizable.strings": "platforms/ios/Trento - Il Comune in Tasca/Resources/de.lproj/Localizable.strings"
},

{
    "config/ticons/Resources/iphone/Default.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default~iphone.png"
}, {
    "config/ticons/Resources/iphone/Default@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default@2x~iphone.png"
}, {
    "config/ticons/Resources/iphone/Default-568h@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default-568h@2x~iphone.png"
/*
}, {
    "config/ticons/i18n/en/Default.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_en~iphone.png"
}, {
    "config/ticons/i18n/en/Default@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_en@2x~iphone.png"
}, {
    "config/ticons/i18n/en/Default-568h@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_en-568h@2x~iphone.png"
}, {
    "config/ticons/i18n/it/Default.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_it~iphone.png"
}, {
    "config/ticons/i18n/it/Default@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_it@2x~iphone.png"
}, {
    "config/ticons/i18n/it/Default-568h@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_it-568h@2x~iphone.png"
}, {
    "config/ticons/i18n/de/Default.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_de~iphone.png"
}, {
    "config/ticons/i18n/de/Default@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_de@2x~iphone.png"
}, {
    "config/ticons/i18n/de/Default-568h@2x.png": "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_de-568h@2x~iphone.png"
*/
} ];


// cd config/ticons && gulp android-splashes
[
	//'it-', 'en-', 'de-',
	'' 
].forEach(function (lang) {
	[
/*
		'long-land-ldpi', 'long-land-mdpi', 'long-land-hdpi', 'long-land-xhdpi', 'long-land-xxhdpi', 'long-land-xxxhdpi', 
		'long-port-ldpi', 'long-port-mdpi', 'long-port-hdpi', 'long-port-xhdpi', 'long-port-xxhdpi', 'long-port-xxxhdpi', 
		'notlong-land-ldpi', 'notlong-land-mdpi', 'notlong-land-hdpi', 'notlong-land-xhdpi', 'notlong-land-xxhdpi', 'notlong-land-xxxhdpi', 
		'notlong-port-ldpi', 'notlong-port-mdpi', 'notlong-port-hdpi', 'notlong-port-xhdpi', 'notlong-port-xxhdpi', 'notlong-port-xxxhdpi'
*/
		'long-port-hdpi', 'long-port-ldpi', 'long-port-xhdpi', 'notlong-port-hdpi', 'notlong-port-ldpi', 'notlong-port-xhdpi', 'notlong-port-mdpi'
	].forEach(function (d) {
		var srcdir = path.join(rootdir, 'config/ticons/Resources/android/images/res-' + lang + d);
		var srcfile = path.join(srcdir, 'default.png');
		if (fs.existsSync(srcfile)) {
			var destdir = path.join(rootdir, 'platforms/android/res/drawable-' + lang + d);
			if (!fs.existsSync(destdir)) fs.mkdirSync(destdir);

			var destfile = path.join(destdir, 'splash.png');
			fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
		}
	});
});


var copyObj=function (obj) {
  Object.keys(obj).forEach(function (key) {
    var val = obj[key];
    var srcfile = path.join(rootdir, key);
    var destfile = path.join(rootdir, val);
    var destdir = path.dirname(destfile);
    if (fs.existsSync(srcfile)) {
      if (!fs.existsSync(destdir)) {
        fs.mkdirSync(destdir);
        console.log("created dest dir "+destdir);
      }
      fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
      console.log("copied "+srcfile+" to "+destfile);
    } else {
      console.log("missing source file "+srcfile);
    }
  });
};
fs.exists('platforms/android', function(hasAndroid) {
  if (hasAndroid) android_filestocopy.forEach(copyObj);
});
fs.exists('platforms/ios', function(hasIOS) {
  if (hasIOS) iphone_filestocopy.forEach(copyObj);
});
