Cordova cdvfile:// URL
https://github.com/apache/cordova-plugin-file/blob/master/doc/plugins.md

Cordova icon&splash online generator
http://ticons.fokkezb.nl


##iOS

###[FIXED IN VERSION 3.4.1+] How to make Cordova work on arm64 architectures (iphone5s)
https://git-wip-us.apache.org/repos/asf?p=cordova-ios.git;h=82ce4f2
(linked from JIRA thread: https://issues.apache.org/jira/browse/CB-6150)

###Missing headers during archive

As per instructions here:

http://stackoverflow.com/questions/5543854/xcode-4-cant-locate-public-header-files-from-static-library-dependency

set "Public Headers Folder Path" of xcode subproject "Build Settings" of target "MagicKit-ios" to "MagicKit" and 
set "Public Headers Folder Path" of xcode subproject "Build Settings" of target "CordovaLib" to "Cordova". Then go to "Build Settings" panel of main Xcode project and set "User Header Search Paths" to these two values:

$(BUILD_ROOT)/../IntermediateBuildFilesPath/UninstalledProducts
$(BUILT_PRODUCTS_DIR)


###Localized splash screen
add new key to -Info.plist file called "Launch image", with value "Default"

patch file CDVSplashScreen.m, lines (131-139)

>BOOL isOrientationLocked = !(supportsPortrait && supportsLandscape);
>
>if (imageName) {
>	imageName = [imageName stringByDeletingPathExtension];
>} else {
>	imageName = @"Default";
>}
>
>if (CDV_IsIPhone5()) {

must become

>BOOL isOrientationLocked = !(supportsPortrait && supportsLandscape);
>
>if (imageName) {
>	imageName = [imageName stringByDeletingPathExtension];
>	NSLog(@"INFO: The temp custom splashscreen is named %@", imageName);
>	imageName = NSLocalizedString(imageName, "localized splash screen name");
>	NSLog(@"INFO: The localized custom splashscreen name is %@", imageName);
>	NSLog(NSLocalizedString(@"logmsg","testing localization"));
>} else {
>	imageName = @"Default";
>	NSLog(@"INFO: The default splashscreen is named %@", imageName);
>}

if (CDV_IsIPhone5()) {

