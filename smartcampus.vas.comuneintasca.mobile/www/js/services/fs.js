angular.module('ilcomuneintasca.services.fs', [])

.factory('Files', function ($q, $http, Config, $queue, Profiling, $ionicLoading, $filter) {
  var lastFileCleanup = -1;
  if (localStorage.lastFileCleanup) lastFileCleanup = Number(localStorage.lastFileCleanup);
  console.log('lastFileCleanup: ' + lastFileCleanup);

  var queueFileDownload = function (obj) {
    var fileTransfer = new FileTransfer();
    fileTransfer.download(obj.url, obj.savepath, function (fileEntry) {
      Profiling._do('fileget', 'saved');
      //DISABLED 
      /*
      window.FileMetadata.getMetadataForURL(obj.url,function(url_metadata){
        if (url_metadata.modified>0) {
          window.FileMetadata.setModifiedForFileURI(url_metadata.modified,fileEntry.nativeURL,function(){
            console.log("success modifing date for file uri: " + fileEntry.nativeURL);
          },function(){
            console.log("error changing modified date for file uri: " + fileEntry.nativeURL);
          });
        } else {
          console.log("unknowm modified date for url: " + obj.url);
        }
      }, function() {
        console.log("url metadata error for " + obj.url);
      });
      */
      window.FileMetadata.getMetadataForFileURI(fileEntry.nativeURL,function(metadata){
        if (metadata.size>0 && metadata.type && metadata.type.indexOf('image/')==0) {
          console.log("keeping valid downloaded file: " + metadata.uri);
        } else {
          console.log("deleting invalid downloaded file: " + metadata.uri);
          console.log("file size: " + metadata.size);
          console.log("mime type: " + metadata.type);
          window.resolveLocalFileSystemURL(metadata.uri, function(fileEntry){
            fileEntry.remove(function() {
              console.log('invalid file removed');
            }, function() {
              console.log('cannot remove invalid file');
            });
          });
        }
      });
      if (device.version.indexOf('2.') == 0) {
        console.log("download complete: " + fileEntry.nativeURL + " (Android 2.x)");
        obj.promise.resolve(fileEntry.nativeURL);
      } else {
        console.log("download complete: " + obj.savepath);
        obj.promise.resolve(obj.savepath);
      }
    }, function (error) {
      //console.log("download error source " + error.source);console.log("download error target " + error.target);console.log("donwload error code: " + error.code);
      Profiling._do('fileget', 'save error');
      obj.promise.reject(error);
    }, true, { /* headers: { "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA==" } */ });
  };
  /*
  var downloadQueues=new Array(3);
  for (var i=0; i<downloadQueues.length; i++) {
    downloadQueues[i]=$queue.queue(queueFileDownload, {
      delay: 10, // delay 10 millis between processing items
      paused: false, // run immediatly
      complete: function() { console.log('downloadQueues[]: complete!'); }
    });
  }
  */
  var IMAGESDIR_NAME = Config.savedImagesDirName();
  console.log('savedImagesDirName: ' + IMAGESDIR_NAME);
  var onErrorFS = function (e) {
    console.log('File API Exception:');
    console.log(e);
    var msg = '';
    switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
    };
    console.log('Error: ' + msg);
    fsObj.reject();
  };
  var rootFS;
  var fsObj = $q.defer();
  var filesystem = fsObj.promise;
  console.log('Opening file system...');
  if (ionic.Platform.isWebView()) {
    document.addEventListener("deviceready", function () {
      window.requestFileSystem(window.PERSISTENT, 50 * 1024 * 1024 /*50MB*/ , function (fs) {
        rootFS = fs.root;
        console.log('Opened file system: ' + rootFS.toURL());
        if (device.platform == 'Android') {
          console.log('cordova (android) fs...');
          fsRoot = 'files-external';
          //fsRoot = 'documents';
        } else {
          console.log('cordova (ios) fs...');
          fsRoot = 'documents';
        }
        fs.root.getDirectory(IMAGESDIR_NAME, {
          create: true
        }, function (dirEntry) {
          console.log('main dirEntry.nativeURL: ' + dirEntry.nativeURL);
          //console.log('main dirEntry.toUrl(): '+dirEntry.toUrl());
          //console.log('main dirEntry.fullPath: ' + dirEntry.fullPath);
          fsObj.resolve(dirEntry);
        }, function (err) {
          console.log('cannot find main folder fs');
          fsObj.reject('cannot find main folder fs');
        });
      }, onErrorFS);
    }, false);
  } else {
    /*
    var FS_QUOTA = 50 * 1024 * 1024; // 50MB
    var quotaRequested = function (grantedBytes) {
      window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
      window.requestFileSystem(window.PERSISTENT, grantedBytes, function (fs) {
        fsObj.resolve(fs.root);
      }, onErrorFS);
    };

    if (window.webkitStorageInfo && window.webkitStorageInfo.requestQuota) {
      console.log('requesting quota...');
      window.webkitStorageInfo.requestQuota(PERSISTENT, FS_QUOTA, quotaRequested, onErrorFS);
    } else {
      quotaRequested(FS_QUOTA);
    }
    */
    fsObj.resolve();
  }
  return {
    cleanup: function () {
      console.log('cleanup()...');
      var cleaned = $q.defer();
      filesystem.then(function (mainDir) {
        if (ionic.Platform.isWebView()) {
          console.log('cleaning mainDir: ' + mainDir.toURL());
          console.log(mainDir.nativeUrl);
          var now_as_epoch = parseInt((new Date).getTime() / 1000);
          var to = (lastFileCleanup + Config.fileCleanupTimeoutSeconds());
          if (lastFileCleanup == -1 || now_as_epoch > to) {
            Profiling.start('filecleanup');

            console.log((now_as_epoch - lastFileCleanup) + ' seconds since last file cleanup: checking data dir...');
            lastFileCleanup = now_as_epoch;
            localStorage.lastFileCleanup = lastFileCleanup;

            var cleaningOverlay = $ionicLoading.show({
              content: $filter('translate')(Config.keys()['cleaning']),
              showDelay: 1500, // how many milliseconds to delay before showing the indicator
              duration: Config.fileCleanupOverlayTimeoutMillis()
            });

            var allTotalSizesDeferreds = {};
            var allTotalSizesPromises = {};
            var allFilesMetadata = [];
            var totalSize=0;
            var dirReader=mainDir.createReader()

            var toArray=function(list){ return Array.prototype.slice.call(list || [], 0); };
            // we'll keep calling readEntries() until no more results are returned (https://developer.mozilla.org/en-US/docs/Web/API/DirectoryReader#readEntries)
            var readAllEntries = function() {
              dirReader.readEntries(function(results) {
                if (!results.length) {
                  console.log('data dir reading done: waiting for all files ('+allTotalSizesPromises.length+') metadata...');
                  //console.log('allTotalSizesPromises.length: '+allTotalSizesPromises.length);
                  $q.all(allTotalSizesPromises).then(function(){
                    var totalSizeMB=totalSize/1000000;
                    var totalSizeMB_MAX=Config.fileDatadirMaxSizeMB();
                    console.log('total data dir size (MB): ' + totalSizeMB + '/' + totalSizeMB_MAX);
                    if (totalSizeMB > totalSizeMB_MAX) {
                      var totalSize_MAX=totalSizeMB_MAX*1000000*.8;
                      console.log('desired total data dir maximum size: '+totalSize_MAX);
                      allFilesMetadata.sort(function(a,b){ return a.modified - b.modified; });
                      for (mdi in allFilesMetadata) {
                        md=allFilesMetadata[mdi];
                        if (md.size>0) {
                          if (totalSize>totalSize_MAX) {
                            window.resolveLocalFileSystemURL(md.uri, function(fileEntry) {
                              fileEntry.remove(function(){
                                console.log('file deleted');
                              },function(){
                                console.log('ERROR: cannot delete file!');
                              });
                            });
                            totalSize-=md.size;
                          }
                        } else {
                          console.log('size error ('+md.size+') for uri ' + md.uri);

                          //should we delete "broken" files?
                          window.resolveLocalFileSystemURL(md.uri, function(fileEntry) {
                            fileEntry.remove(function(){
                              console.log('file deleted');
                            },function(){
                              console.log('ERROR: cannot delete file!');
                            });
                          });
                        }
                      }
                      console.log('cleaned data dir size: ' + totalSize);
                    }
                    $ionicLoading.hide();
                    Profiling._do('filecleanup');
                    cleaned.resolve(mainDir);
                  });
                } else {
                  console.log('reading data dir: '+results.length+' entries');
                  for (i=0; i<results.length; i++) {
                    entry=results[i];
                    if (entry.isDirectory) {
                      console.log('Directory: ' + entry.nativeURL);
                    } else if (entry.isFile) {
                      var fileURI=entry.nativeURL;
                      //console.log('File: ' + fileURI);
                      allTotalSizesDeferreds[fileURI]=$q.defer();
                      allTotalSizesPromises[fileURI]=allTotalSizesDeferreds[fileURI].promise;
                      window.FileMetadata.getMetadataForFileURI(fileURI, function(metadata) {
                        //console.log('file uri size: ' + metadata.size);
                        if (metadata.size>0) totalSize+=metadata.size;
                        allTotalSizesDeferreds[metadata.uri].resolve();
                        allFilesMetadata.push(metadata);
                      });
                    }
                  }
                  readAllEntries();
                }
              }, function() {
                console.log('error reading data dir');
              });
            };
            readAllEntries();
/*
            },function(){
              console.log('error getting data dir size');

              $ionicLoading.hide();
              Profiling._do('filecleanup');
              cleaned.resolve(mainDir);
            //})['finally'](function(){
              //$ionicLoading.hide();
              //Profiling._do('filecleanup');
              //return mainDir;
            });
*/
          } else {
            $ionicLoading.hide();
            //console.log('avoiding too frequent file cleanups. seconds since last one: ' + (now_as_epoch - lastFileCleanup));
            cleaned.resolve(mainDir);
          }
        } else {
          cleaned.resolve(mainDir);
        }
      });
      return cleaned.promise;
    },
    get: function (fileurl) {
      var filegot = $q.defer();
      this.cleanup().then(function (mainDir) {
        //console.log('fileurl: '+fileurl);
        //var filename = fileurl.substring(fileurl.lastIndexOf('/') + 1);
        var filename = CryptoJS.SHA1(fileurl).toString(CryptoJS.enc.Hex) + '.jpg';
        //console.log('filename: '+filename);
        if (ionic.Platform.isWebView()) {
          Profiling.start('fileget');
          //console.log('rootDir: ' + rootDir.fullPath);
          mainDir.getFile(filename, {}, function (fileEntry) {
            /*
            console.log('fileEntry.toURL(): ' + fileEntry.toURL());
            console.log('fileEntry.nativeURL: ' + fileEntry.nativeURL);
            console.log('fileEntry.fullPath: ' + fileEntry.fullPath);
            window.resolveLocalFileSystemURL(filesavepath,function(entry){
              console.log('entry.nativeURL: '+entry.nativeURL);
              console.log('entry.toUrl(): '+entry.toUrl());
              console.log('entry.fullPath: '+entry.fullPath);
              filegot.resolve(filesavepath);
            },function(evt){
              console.log('cordova resolveLocalFileSystemURL() error:');
              console.log(evt.target.error.code );
              filegot.resolve(fileurl);
            });
            */
            var filesavepath = rootFS.toURL() + IMAGESDIR_NAME + '/' + filename;
            Profiling._do('fileget', 'already');
            if (device.version.indexOf('2.') == 0) {
              console.log('already downloaded to "' + fileEntry.nativeURL + '" (Android 2.x)');
              filegot.resolve(fileEntry.nativeURL);
            } else {
              console.log('already downloaded to "' + filesavepath + '"');
              filegot.resolve(filesavepath);
            }
          }, function () {
            if (navigator.connection.type == Connection.NONE) {
              console.log('no network connection: cannot download missing images!');
              Profiling._do('fileget', 'offline');
              filegot.reject('no network connection');
            } else {
              var fileObj = {
                savepath: rootFS.toURL() + IMAGESDIR_NAME + '/' + filename,
                url: fileurl,
                promise: filegot
              };
              console.log('not found: downloading to "' + fileObj.savepath + '"');
              queueFileDownload(fileObj);
            }
          });
        } else {
          filegot.resolve(fileurl);
        }
    });
      return filegot.promise;
    }
  };
})
