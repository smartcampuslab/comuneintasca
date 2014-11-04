#!/usr/bin/env node
 
//
// This hook copies various resource files 
// from our version control system directories 
// into the appropriate platform specific location
//
 
 
// configure all the files to copy.  
// Key of object is the source file, 
// value is the destination location.  
// It's fine to put all platforms' icons 
// and splash screen files here, even if 
// we don't build for all platforms 
// on each developer's box.
var dirstocreate = [
	'platforms/android/res/values', 'platforms/android/res/values-it', 'platforms/android/res/values-de', 
	'platforms/android/res/drawable-mdpi', 'platforms/android/res/drawable-hdpi', 'platforms/android/res/drawable-xhdpi', 'platforms/android/res/drawable-xxhdpi', 
	'platforms/ios/Trento - Il Comune in Tasca/Resources/de.lproj', 'platforms/ios/Trento - Il Comune in Tasca/Resources/it.lproj'
];
 
var filestocopy = [{
    "config/android/AndroidManifest.xml": 
    "platforms/android/AndroidManifest.xml"
}, 

{
    "config/android/res/values-en/strings.xml": 
    "platforms/android/res/values/strings.xml"
}, {
    "config/android/res/values-it/strings.xml": 
    "platforms/android/res/values-it/strings.xml"
}, {
    "config/android/res/values-de/strings.xml": 
    "platforms/android/res/values-de/strings.xml"
},

{
    "config/android/res/drawable-mdpi/ic_action_next_item.png": 
    "platforms/android/res/drawable-mdpi/ic_action_next_item.png"
}, {
    "config/android/res/drawable-mdpi/ic_action_previous_item.png": 
    "platforms/android/res/drawable-mdpi/ic_action_previous_item.png"
}, {
    "config/android/res/drawable-mdpi/ic_action_remove.png": 
    "platforms/android/res/drawable-mdpi/ic_action_remove.png"
}, {
    "config/android/res/drawable-hdpi/ic_action_next_item.png": 
    "platforms/android/res/drawable-hdpi/ic_action_next_item.png"
}, {
    "config/android/res/drawable-hdpi/ic_action_previous_item.png": 
    "platforms/android/res/drawable-hdpi/ic_action_previous_item.png"
}, {
    "config/android/res/drawable-hdpi/ic_action_remove.png": 
    "platforms/android/res/drawable-hdpi/ic_action_remove.png"
}, {
    "config/android/res/drawable-xhdpi/ic_action_next_item.png": 
    "platforms/android/res/drawable-xhdpi/ic_action_next_item.png"
}, {
    "config/android/res/drawable-xhdpi/ic_action_previous_item.png": 
    "platforms/android/res/drawable-xhdpi/ic_action_previous_item.png"
}, {
    "config/android/res/drawable-xhdpi/ic_action_remove.png": 
    "platforms/android/res/drawable-xhdpi/ic_action_remove.png"
}, {
    "config/android/res/drawable-xxhdpi/ic_action_next_item.png": 
    "platforms/android/res/drawable-xxhdpi/ic_action_next_item.png"
}, {
    "config/android/res/drawable-xxhdpi/ic_action_previous_item.png": 
    "platforms/android/res/drawable-xxhdpi/ic_action_previous_item.png"
}, {
    "config/android/res/drawable-xxhdpi/ic_action_remove.png": 
    "platforms/android/res/drawable-xxhdpi/ic_action_remove.png"
}, 

{
    "config/ios/Resources/icons/icon-40@2x.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-40@2x.png"
}, {
    "config/ios/Resources/icons/icon-40.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-40.png"
}, {
    "config/ios/Resources/icons/icon-50@2x.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-50@2x.png"
}, {
    "config/ios/Resources/icons/icon-50.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-50.png"
}, {
    "config/ios/Resources/icons/icon-60@2x.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-60@2x.png"
}, {
    "config/ios/Resources/icons/icon-60.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-60.png"
}, {
    "config/ios/Resources/icons/icon-72@2x.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-72@2x.png"
}, {
    "config/ios/Resources/icons/icon-72.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-72.png"
}, {
    "config/ios/Resources/icons/icon-76@2x.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-76@2x.png"
}, {
    "config/ios/Resources/icons/icon-76.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-76.png"
}, {
    "config/ios/Resources/icons/icon-small@2x.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-small@2x.png"
}, {
    "config/ios/Resources/icons/icon-small.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon-small.png"
}, {
    "config/ios/Resources/icons/icon@2x.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon@2x.png"
}, {
    "config/ios/Resources/icons/icon.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/icons/icon.png"
}, {
    "config/ios/Resources/splash/Default@2x~iphone.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default@2x~iphone.png"
}, {
    "config/ios/Resources/splash/Default_en@2x~iphone.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_en@2x~iphone.png"
}, {
    "config/ios/Resources/splash/Default_it@2x~iphone.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_it@2x~iphone.png"
}, {
    "config/ios/Resources/splash/Default_de@2x~iphone.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_de@2x~iphone.png"
}, {
    "config/ios/Resources/splash/Default-568h@2x~iphone.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default-568h@2x~iphone.png"
}, {
    "config/ios/Resources/splash/Default_en-568h@2x~iphone.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_en-568h@2x~iphone.png"
}, {
    "config/ios/Resources/splash/Default_it-568h@2x~iphone.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_it-568h@2x~iphone.png"
}, {
    "config/ios/Resources/splash/Default_de-568h@2x~iphone.png": 
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_de-568h@2x~iphone.png"
}, {
    "config/ios/Resources/splash/Default~iphone.png":
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default~iphone.png"
}, {
    "config/ios/Resources/splash/Default_en~iphone.png":
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_en~iphone.png"
}, {
    "config/ios/Resources/splash/Default_it~iphone.png":
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_it~iphone.png"
}, {
    "config/ios/Resources/splash/Default_de~iphone.png":
    "platforms/ios/Trento - Il Comune in Tasca/Resources/splash/Default_de~iphone.png"
}, {
    "config/ios/Resources/it.lproj/InfoPlist.strings":
    "platforms/ios/Trento - Il Comune in Tasca/Resources/it.lproj/InfoPlist.strings"
}, {
    "config/ios/Resources/en.lproj/InfoPlist.strings":
    "platforms/ios/Trento - Il Comune in Tasca/Resources/en.lproj/InfoPlist.strings"
}, {
    "config/ios/Resources/de.lproj/InfoPlist.strings":
    "platforms/ios/Trento - Il Comune in Tasca/Resources/de.lproj/InfoPlist.strings"
}, {
    "config/ios/Resources/it.lproj/Localizable.strings":
    "platforms/ios/Trento - Il Comune in Tasca/Resources/it.lproj/Localizable.strings"
}, {
    "config/ios/Resources/en.lproj/Localizable.strings":
    "platforms/ios/Trento - Il Comune in Tasca/Resources/en.lproj/Localizable.strings"
}, {
    "config/ios/Resources/de.lproj/Localizable.strings":
    "platforms/ios/Trento - Il Comune in Tasca/Resources/de.lproj/Localizable.strings"
}, ];

var fs = require('fs');
var path = require('path');
 
// no need to configure below
var rootdir = process.argv[2];

dirstocreate.forEach(function(d) {
  var destdir = path.join(rootdir, d);
  if (!fs.existsSync(destdir)) {
    fs.mkdirSync(destdir);
  }
});
 
filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
        	try {
	          fs.createReadStream(srcfile).pipe( fs.createWriteStream(destfile) );
					} catch(e) {
						console.log('ERROR0: '+e);
					}
        }
    });
});

/*
['','en-','de-']
.forEach(function(lang) {
    ['long-port-hdpi', 'long-port-ldpi', 'long-port-xhdpi', 'notlong-port-hdpi', 'notlong-port-ldpi', 'notlong-port-xhdpi', 'notlong-port-mdpi']
    .forEach(function(d) {
      var destdir = path.join(rootdir, 'platforms/android/res/drawable-'+lang + d);
      var srcdir = path.join(rootdir, 'config/android/res/drawable-'+lang + d);
      if (!fs.existsSync(destdir)) {
        fs.mkdirSync(destdir);
        var srcfile = path.join(srcdir,'splash.png');
        var destfile = path.join(destdir,'splash.png');
         if (fs.existsSync(srcfile)) {
            fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile));
        }
      }
    }); 
});
*/

var defaultLang='en';

['l','m','h','xh','xxh']//,'xxxh'
.forEach(function(d) {
	var suffix='-' + d + 'dpi';
	var srcdir = path.join(rootdir, 'config/ticons/platform/android/res/drawable' + suffix);
	var destdir = path.join(rootdir, 'platforms/android/res/drawable' + suffix);
	if (!fs.existsSync(destdir)) {
		console.log('creating dir: '+destdir);
		fs.mkdirSync(destdir);
	}
	var srcfile = path.join(srcdir,'appicon.png');
	if (fs.existsSync(srcfile)) {
		console.log('copying file: '+srcfile);
		var destfile = path.join(destdir,'icon.png');
		console.log('to: '+destfile);
		try {
			fs.createReadStream(srcfile).pipe( fs.createWriteStream(destfile) );
		} catch(e) {
			console.log('ERROR1: '+e);
		}
	}

	['en','it','de']
	.forEach(function(lang) {
		var suffix='-' + lang + '-' + d + 'dpi';
		var srcdir = path.join(rootdir, 'config/ticons/platform/android/res/drawable' + suffix);
		var srcfile = path.join(srcdir,'background.9.png');
		if (fs.existsSync(srcfile)) {
			if (lang==defaultLang) suffix='-' + d + 'dpi';
			var destdir = path.join(rootdir, 'platforms/android/res/drawable' + suffix);
			if (!fs.existsSync(destdir)) {
				console.log('creating dir: '+destdir);
				fs.mkdirSync(destdir);
			}
			console.log('copying file: '+srcfile);
			var destfile = path.join(destdir,'splash.png');
			console.log('to: '+destfile);
			fs.createReadStream(srcfile).pipe( fs.createWriteStream(destfile) );

		} else {
			['','not']
			.forEach(function(ll) {
				['land','port']
				.forEach(function(lp) {
					suffix='-'+ll+'long' + '-'+lp + '-'+d+'dpi';
					srcdir = path.join(rootdir, 'config/ticons/Resources/android/images/res-'+lang+suffix);
					srcfile = path.join(srcdir,'default.png');
					if (fs.existsSync(srcfile)) {
						if (lang!=defaultLang) suffix='-'+lang+suffix;
						var destdir = path.join(rootdir, 'platforms/android/res/drawable' + suffix);
						if (!fs.existsSync(destdir)) {
							console.log('creating dir: '+destdir);
							fs.mkdirSync(destdir);
						}
						console.log('copying file: '+srcfile);
						var destfile = path.join(destdir,'splash.png');
						console.log('to: '+destfile);
						try {
							fs.createReadStream(srcfile).pipe( fs.createWriteStream(destfile) );
						} catch(e) {
							console.log('ERROR2: '+e);
						}
					}
				});
			});
		}
	}); 
});
