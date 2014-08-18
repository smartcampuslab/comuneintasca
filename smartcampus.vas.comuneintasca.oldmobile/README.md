Trento - Il Comune in Tasca
===========================

Osbolete mobile app replacement.


## To enable localized images

Enable cordova splashscreen plugin:

    cordova plugin add org.apache.cordova.splashscreen

then addd the following lines to config.xml file:

    <preference name="SplashScreen" value="splash" />
    <preference name="AutoHideSplashScreen" value="false" />

### Android

Nothing more to do.

### iOS

Add the following key to XCode app Info.plist file

    Launch image (UILaunchImageFile): Default

and modify file CDVSplashScreen.m around line 130, method updateImage() like this:

    BOOL supportsPortrait = [vc supportsOrientation:UIInterfaceOrientationPortrait] || [vc supportsOrientation:UIInterfaceOrientationPortraitUpsideDown];
    BOOL isOrientationLocked = !(supportsPortrait && supportsLandscape);

    if (imageName) {
        imageName = NSLocalizedString(imageName, "localized splash screen name");
        imageName = [imageName stringByDeletingPathExtension];
    } else {
        imageName = @"Default";
    }

    if (CDV_IsIPhone5()) {

Then add folders "it.lproj" and  "de.lproj" to xcode project (right click "Resources" folder from xcode file navigator, then "Add files to..." -- check "create groups...") and also add all additional new splashscreens (and remove unused localization).

Finally, do not forget to add the following line when applcation is done loading (inside "deviceready" event handler or from $ionicPlatform.ready() function):

    setTimeout(function(){ navigator.splashscreen.hide(); },2000);


## To build

From app root folder launch

    npm install

Then go into config/ticons and build icons and splashscreen assets using gulp with default makefile "gulpfile.js":

    gulp

Finally go back to app root folder and launch

    cordova run ios
    cordova run android
