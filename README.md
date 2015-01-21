Il comune in tasca: Trento
==========================

New mobile app made with Ionic/Cordova.


Instructions:
=============

Install nodejs, npm and ant.

For android development, add something like this line to the bashrc (or equivalent):

	export PATH=${PATH}:/Development/adt-bundle/sdk/platform-tools:/Development/adt-bundle/sdk/tools
 
then install Cordova and Ionic with:

	npm install -g cordova ionic

On ios, also install ios-sim package with command:

	npm install -g ios-deploy

All needed plugins should already be installed by appropriate "platform add" hooks, but here are the list of needed plugins

_(added by ionic)_

	cordova plugin add org.apache.cordova.console
	cordova plugin add org.apache.cordova.device
	cordova plugin add org.apache.cordova.statusbar

_(project specific)_

	cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin.git
	cordova plugin add org.apache.cordova.file
	cordova plugin add org.apache.cordova.file-transfer
	cordova plugin add org.apache.cordova.geolocation
	cordova plugin add org.apache.cordova.inappbrowser
	cordova plugin add de.appplant.cordova.plugin.email-composer
	cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
	cordova plugin add org.apache.cordova.network-information
	cordova plugin add org.apache.cordova.splashscreen
	cordova plugin add https://github.com/enricomarchesin/cordova-startapp.git
	cordova plugin add https://github.com/smartcampuslab/cordova-file-metadata.git
	cordova plugin add https://github.com/driftyco/ionic-plugins-keyboard.git

Activate all needed platforms with commands like:

	$: cordova platform add android	

You can finally build and install app on device (if available, otherwise emulator will be launched) with:

	$: cordova run
