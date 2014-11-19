#!/usr/bin/env node

//http://devgirl.org/2013/11/12/three-hooks-your-cordovaphonegap-project-needs/
//this hook installs all your plugins

// add your plugins to this list--either 
// the identifier, the filesystem location 
// or the URL

var pluginlist = [
  //(added by ionic)
  "org.apache.cordova.console",
  "org.apache.cordova.device",
  "org.apache.cordova.statusbar",
  //(project related)
  "org.apache.cordova.file",
  "org.apache.cordova.file-transfer",
  "org.apache.cordova.geolocation",
  "org.apache.cordova.splashscreen",
  "org.apache.cordova.network-information",
  "org.apache.cordova.core.inappbrowser",
  "de.appplant.cordova.plugin.email-composer",
  "https://github.com/brodysoft/Cordova-SQLitePlugin.git",
  "https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git",
  "https://github.com/enricomarchesin/cordova-startapp.git",
  "https://github.com/smartcampuslab/cordova-file-metadata.git",
  "https://github.com/driftyco/ionic-plugins-keyboard.git",
];
 
// no need to configure below
 
var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;
 
function puts(error, stdout, stderr) {
    sys.puts(stdout)
}
 
pluginlist.forEach(function(plug) {
    exec("cordova plugin add " + plug, puts);
});
