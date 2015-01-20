Cordova cdvfile:// URL
https://github.com/apache/cordova-plugin-file/blob/master/doc/plugins.md

Cordova icon&splash online generator
http://ticons.fokkezb.nl


##iOS

After installing cocoapods with 

>sudo gem install cocoapods

copy config/ios/xcode/Podfile into platforms/ios/ than, from within the latter folder, launch command

>pod install

From now on always open .xcworkspacefile (instead of normal xcode project)

Unzip file config/ios/xcode/MagicKit-150120.zip inside xcode platforms/ios/ and drag-and-drop subproject file onto app main project (within workspace, remember!).

In main project "Build Phases" add MagicKit-iOS to target dependancies, libMagicKit-iOS.a to "Link Binary with libraries" along with libz.dylib

On app target "Build settings" let flag "OTHER_LDFLAGS" inherit settings from base project and set "User Header Search Paths" to these two values:

$(BUILD_ROOT)/../IntermediateBuildFilesPath/UninstalledProducts
$(BUILT_PRODUCTS_DIR)

(taken from http://stackoverflow.com/questions/5543854/xcode-4-cant-locate-public-header-files-from-static-library-dependency)


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

>if (CDV_IsIPhone5()) {


patch plugin file SQLitePlugin.m: these lines

>// Extra for SQLCipher:
>// const char *key = [@"your_key_here" UTF8String];
>// if(key != NULL) sqlite3_key(db, key, strlen(key));

must become 

>BOOL skipBackup=NO;
>NSString *skipBackupValue = [options objectForKey:@"skipBackup"];
>if (skipBackupValue != NULL) {
>  skipBackup=[skipBackupValue boolValue];
>}
>if (skipBackup) {
>  NSURL *dburl=[NSURL fileURLWithPath:(NSString *)dbname];
>  NSLog(@"db url: %@", dburl);
>
>  NSError *error = nil;
>  BOOL success = [dburl setResourceValue:[NSNumber numberWithBool:YES] forKey:NSURLIsExcludedFromBackupKey error:&error];
>  if(success){
>    NSLog(@"Excluded %@ from backup", [dburl lastPathComponent]);
>  } else {
>    NSLog(@"Error excluding %@ from backup: %@", [dburl lastPathComponent], error);
>  }
>  /* OLDER (THAN 5.01) iOS VERSION
>  const char* attrName = "com.apple.MobileBackup";
>  u_int8_t attrValue = 1;
>  int result = setxattr(name, attrName, &attrValue, sizeof(attrValue), 0, 0);
>  if (result==0) {
>    //NSLog(@"marked db file '%s' as not to backup on icloud", name);
>  } else {
>    //NSLog(@"error marking file");
>  }
>  */
>}
>
>// Extra for SQLCipher:
>// const char *key = [@"your_key_here" UTF8String];
>// if(key != NULL) sqlite3_key(db, key, strlen(key));

###[FIXED IN VERSION 3.4.1+] How to make Cordova work on arm64 architectures (iphone5s)
https://git-wip-us.apache.org/repos/asf?p=cordova-ios.git;h=82ce4f2
(linked from JIRA thread: https://issues.apache.org/jira/browse/CB-6150)

