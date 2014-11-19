#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
 

var defaultLang='en';
var rootdir = process.argv[2];

var config = require(path.join(rootdir, 'config', 'comune.json'));
var NOME_COMUNE=config.nome;
console.log('NOME_COMUNE: '+NOME_COMUNE);

var androidDirsToCreate = [
	'platforms/android/res/drawable-mdpi', 'platforms/android/res/drawable-hdpi', 'platforms/android/res/drawable-xhdpi', 'platforms/android/res/drawable-xxhdpi'
]; 
var androidFilesToCopy = [{
    "config/android/AndroidManifest.xml": 
    "platforms/android/AndroidManifest.xml"
}, {
    "config/android/res/values-en/strings.xml": 
    "platforms/android/res/values/strings.xml"
}, {
    "config/android/res/values-it/strings.xml": 
    "platforms/android/res/values-it/strings.xml"
}, {
    "config/android/res/values-de/strings.xml": 
    "platforms/android/res/values-de/strings.xml"
}, {
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
}];

var iosDirsToCreate = [
	'platforms/ios/'+NOME_COMUNE+' - Il Comune in Tasca/Resources/de.lproj', 'platforms/ios/'+NOME_COMUNE+' - Il Comune in Tasca/Resources/it.lproj'
];
var iosFilesToCopy = [{
    "config/ticons/Resources/iphone/appicon-Small-40@2x.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-40@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-Small-40.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-40.png"
}, {
    "config/ticons/Resources/iphone/appicon-Small-50@2x.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-50@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-Small-50.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-50.png"
}, {
    "config/ticons/Resources/iphone/appicon-60@3x.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-60@3x.png"
}, {
    "config/ticons/Resources/iphone/appicon-60@2x.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-60@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-60.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-60.png"
}, {
    "config/ticons/Resources/iphone/appicon-72@2x.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-72@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-72.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-72.png"
}, {
    "config/ticons/Resources/iphone/appicon-76@2x.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-76@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-76.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-76.png"
}, {
    "config/ticons/Resources/iphone/appicon-Small@3x.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-small@3x.png"
}, {
    "config/ticons/Resources/iphone/appicon-Small@2x.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-small@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon-Small.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon-small.png"
}, {
    "config/ticons/Resources/iphone/appicon@2x.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon@2x.png"
}, {
    "config/ticons/Resources/iphone/appicon.png": 
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/icons/icon.png"
}, {
    "config/ios/Resources/it.lproj/InfoPlist.strings":
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/it.lproj/InfoPlist.strings"
}, {
    "config/ios/Resources/en.lproj/InfoPlist.strings":
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/en.lproj/InfoPlist.strings"
}, {
    "config/ios/Resources/de.lproj/InfoPlist.strings":
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/de.lproj/InfoPlist.strings"
}, {
    "config/ios/Resources/it.lproj/Localizable.strings":
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/it.lproj/Localizable.strings"
}, {
    "config/ios/Resources/en.lproj/Localizable.strings":
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/en.lproj/Localizable.strings"
}, {
    "config/ios/Resources/de.lproj/Localizable.strings":
    "platforms/ios/"+NOME_COMUNE+" - Il Comune in Tasca/Resources/de.lproj/Localizable.strings"
} ];


var copySrcToDestOnlyIfNeeded=function(srcfile,destfile,createdestdir) {
  if (fs.existsSync(srcfile)) {
    var destdir = path.dirname(destfile);
    if (createdestdir && !fs.existsSync(destdir)) {
      console.log('creating dest dir: '+destdir);
      fs.mkdirSync(destdir);
    }
    if (fs.existsSync(destdir)) {
      var srcstats=fs.statSync(srcfile);
      var deststats=null;
      if (fs.existsSync(destfile)) deststats=fs.statSync(destfile);
      if (deststats==null || srcstats.mtime.getTime()!=deststats.mtime.getTime()) {
        console.log("copying "+srcfile+" to "+destfile);
        try {
          var reader=fs.createReadStream(srcfile);
          reader.once('end', function () {
            fs.utimesSync(destfile, srcstats.atime, srcstats.mtime);
          });
          reader.pipe(fs.createWriteStream(destfile));
        } catch(e) {
          console.log('*** COPY ERROR #0: '+e);
        }
      } else {
        //console.log("...skip copying "+srcfile+" to "+destfile);
      }
    } else {
      console.log('*** missing destination dir: '+destdir);
    }
  } else {
    console.log('*** missing source file: '+srcfile);
  }
}


if (fs.existsSync(path.join(rootdir, 'platforms/ios'))) {
  iosDirsToCreate.forEach(function(d) {
    var destdir = path.join(rootdir, d);
    if (!fs.existsSync(destdir)) fs.mkdirSync(destdir);
  });
  iosFilesToCopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
      var val = obj[key];
      var srcfile = path.join(rootdir, key);
      var destfile = path.join(rootdir, val);
      copySrcToDestOnlyIfNeeded(srcfile,destfile,false);
    });
  });

  ['','@2x','-568h@2x'] //6&6+ resulutions ,'-667h@2x','-Landscape-736h@3x','-Portrait-736h@3x'
  .forEach(function(suffix) {
    var def_srcfile = path.join(rootdir, 'config/ticons/Resources/iphone', 'Default'+ suffix +'.png');
    copySrcToDestOnlyIfNeeded(def_srcfile,path.join(rootdir, 'platforms/ios/'+NOME_COMUNE+' - Il Comune in Tasca/Resources/splash', 'Default'+ suffix +'~iphone.png'),false);

    config.langs.forEach(function(lang) {
      var srcfile = path.join(rootdir, 'config/ticons/i18n', lang, 'Default'+ suffix +'.png');
      copySrcToDestOnlyIfNeeded(srcfile,path.join(rootdir, 'platforms/ios/'+NOME_COMUNE+' - Il Comune in Tasca/Resources/splash', 'Default_'+lang + suffix +'~iphone.png'),false);
    }); 
  });

  ['-Landscape','-Landscape@2x','-Portrait','-Portrait@2x']
  .forEach(function(suffix) {
    var def_srcfile = path.join(rootdir, 'config/ticons/Resources/iphone', 'Default'+ suffix +'.png');
    copySrcToDestOnlyIfNeeded(def_srcfile,path.join(rootdir, 'platforms/ios/'+NOME_COMUNE+' - Il Comune in Tasca/Resources/splash', 'Default'+ suffix +'~ipad.png'),false);

    config.langs.forEach(function(lang) {
      var srcfile = path.join(rootdir, 'config/ticons/i18n', lang, 'Default'+ suffix +'.png');
      copySrcToDestOnlyIfNeeded(srcfile,path.join(rootdir, 'platforms/ios/'+NOME_COMUNE+' - Il Comune in Tasca/Resources/splash', 'Default_'+lang + suffix +'~ipad.png'),false);
    }); 
  });
} else {
  console.log('skipping IOS resources');
}


if (fs.existsSync(path.join(rootdir, 'platforms/android'))) {
  config.langs.forEach(function(lang) {
    androidDirsToCreate.push('platforms/android/res/values'+(lang==defaultLang?'':'-'+lang));
  });
  androidDirsToCreate.forEach(function(d) {
    var destdir = path.join(rootdir, d);
    if (!fs.existsSync(destdir)) fs.mkdirSync(destdir);
  });
  androidFilesToCopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
      var val = obj[key];
      var srcfile = path.join(rootdir, key);
      var destfile = path.join(rootdir, val);
      copySrcToDestOnlyIfNeeded(srcfile,destfile,false);
    });
  });

  ['l','m','h','xh','xxh']//,'xxxh'
  .forEach(function(d) {
    var suffix='-' + d + 'dpi';
    var srcfile = path.join(rootdir, 'config/ticons/platform/android/res/drawable' + suffix, 'appicon.png');
    var destfile = path.join(rootdir, 'platforms/android/res/drawable' + suffix, 'icon.png');
    copySrcToDestOnlyIfNeeded(srcfile,destfile,true);

    config.langs.forEach(function(lang) {
      var suffix='-' + lang + '-' + d + 'dpi';
      var srcfile = path.join(rootdir, 'config/ticons/platform/android/res/drawable' + suffix, 'background.9.png');
      if (fs.existsSync(srcfile)) {
        if (lang==defaultLang) suffix='-' + d + 'dpi';
        copySrcToDestOnlyIfNeeded(srcfile,path.join(rootdir, 'platforms/android/res/drawable' + suffix, 'splash.png'),true);
      } else {
        ['','not']
        .forEach(function(ll) {
          ['land','port']
          .forEach(function(lp) {
            suffix='-'+ll+'long' + '-'+lp + '-'+d+'dpi';
            srcfile = path.join(rootdir, 'config/ticons/Resources/android/images/res-'+lang+suffix, 'default.png');

            if (lang!=defaultLang) suffix='-'+lang+suffix;
            copySrcToDestOnlyIfNeeded(srcfile,path.join(rootdir, 'platforms/android/res/drawable' + suffix, 'splash.png'),true);
          });
        });
      }
    }); 
  });
} else {
  console.log('skipping ANDROID resources');
}
