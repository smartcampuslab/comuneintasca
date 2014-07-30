Il comune in tasca: Trento
==========================

New mobile app made with Ionic/Cordova.


Instructions:
=============
install nodejs,npm and ant
add this line to the bashrc:

	export PATH=${PATH}:/Development/adt-bundle/sdk/platform-tools:/Development/adt-bundle/sdk/tools

install all the plugins

	*(already added by ionic)*
	org.apache.cordova.console
	org.apache.cordova.device
	org.apache.cordova.statusbar

	*(project related)*
	cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin.git
	cordova plugin add org.apache.cordova.file
	cordova plugin add org.apache.cordova.file-transfer
	cordova plugin add org.apache.cordova.geolocation
	cordova plugin add org.apache.cordova.core.inappbrowser
		*(or: cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git)*
	cordova plugin add de.appplant.cordova.plugin.email-composer
	cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
	cordova plugin add org.apache.cordova.network-information
	cordova plugin add org.apache.cordova.splashscreen
	cordova plugin add https://github.com/enricomarchesin/cordova-startapp.git
	cordova plugin add https://github.com/smartcampuslab/cordova-file-metadata.git
	cordova plugin add https://github.com/driftyco/ionic-plugins-keyboard.git

Activate all needed platform with commands like:

	$: cordova platform add android	

You can finally build and install app on device (if available, otherwise emulator will be launched) with:

	$: cordova run
