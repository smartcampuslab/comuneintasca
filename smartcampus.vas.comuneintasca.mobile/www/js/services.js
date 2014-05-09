angular.module('starter.services', [])

.factory('Config', function($q) {
    var poiTypes={
        'museums':{ de:'Musei', it:'Musei', en:'Musei' },
        'buildings':{ de:'Historische Gebäude', it:'Edifici storici', en:'Historic Buildings' },
        'churches':{ de:'Kirchen', it:'Chiese', en:'Churches' },
        'acheo':{ de:'Archäologische Areas', it:'Aree Archeologiche', en:'Archaeological Areas' },
        'parks':{ de:'Natur', it:'Natura', en:'Nature' },
        'misc':{ de:'Andere Seiten von historischem und künstlerischem Interesse', it:'Altri siti di interesse storico artistico', en:'Other sites of historical and artistic interest' }
    };
    eventTypes={
        'fairs':{ de:'', it:'Feste, mercati e fiere', en:'' },
        'conferences':{ de:'', it:'Incontri, convegni e conferenze', en:'' },
        'shows':{ de:'', it:'Spettacoli', en:'' },
        'exhibitions':{ de:'', it:'Mostre', en:'' },
        'labs':{ de:'', it:'Corsi e laboratori', en:'' },
        'competitions':{ de:'', it:'Competizioni e gare', en:'' },
        'misc':{ de:'', it:'Iniziative varie', en:'' },
    };
    return {
        syncTimeoutSeconds: function(){
            return 60*60 *24 *10; /* 60 times 60 seconds = 1 HOUR --> x24 = 1 DAY x10 */
        },
        poiCateFromType: function(type){
            return poiTypes[type];
        },
        eventCateFromType: function(type){
            return eventTypes[type];
        }
    }
})

.factory('GeoLocate', function($q) {
    return {
        locate: function() {
            var localization = $q.defer();
            if (window.cordova) {
                console.log('cordova localization...');
                document.addEventListener("deviceready", function(){
                    console.log('cordova localization inited...');
                    navigator.geolocation.watchPosition(function(position){
                        r=[position.coords.latitude,position.coords.longitude];
                        localization.resolve(r);
                    },function(error) {
                        localization.reject();
                    });
                }, false);
            } else {
                console.log('web localization...');
                navigator.geolocation.watchPosition(function(position){
                    r=[position.coords.latitude,position.coords.longitude];
                    localization.resolve(r);
                },function(error) {
                    localization.reject();
                });
            }
            return localization.promise;
        },
        distance: function(pt1,pt2) {
            var lat1=pt1[0];
            var lon1=pt1[1];
            var lat2=pt2[0];
            var lon2=pt2[1];

            var R = 6371; // km
            var dLat = (lat2-lat1).toRad();
            var dLon = (lon2-lon1).toRad();
            var lat1 = lat1.toRad();
            var lat2 = lat2.toRad();
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;

            return d;
        }
   }
})

.factory('DatiDB', function($q, $http, $ionicLoading, Config) {
    var SCHEMA_VERSION=26;
    var types={
        'content':'eu.trentorise.smartcampus.comuneintasca.model.ContentObject',
        'poi':'eu.trentorise.smartcampus.comuneintasca.model.POIObject',
        'event':'eu.trentorise.smartcampus.comuneintasca.model.EventObject',
        'restaurant':'eu.trentorise.smartcampus.comuneintasca.model.RestaurantObject',
        'hotel':'eu.trentorise.smartcampus.comuneintasca.model.HotelObject',
        'itinerary':'eu.trentorise.smartcampus.comuneintasca.model.ItineraryObject'
    };
    lastSynced=-1;

    var currentSchemaVersion=0;
    if (localStorage.currentSchemaVersion) currentSchemaVersion=localStorage.currentSchemaVersion;
    console.log('currentSchemaVersion: '+currentSchemaVersion);
    var currentDbVersion=0;
    if (currentSchemaVersion==SCHEMA_VERSION && localStorage.currentDbVersion) currentDbVersion=localStorage.currentDbVersion;
    console.log('currentDbVersion: '+currentDbVersion);

    var localSyncOptions={ method:'GET', url:'data/trento.json' };
    var remoteSyncOptions={ method:'POST', url:'https://vas-dev.smartcampuslab.it/comuneintasca/sync?since='+currentDbVersion, data:'{"updated":{}}' };

    var dbopenDeferred = $q.defer();
    var dbDeferred = $q.defer();

    var dbObj;
    if (window.cordova) {
        console.log('cordova db...');
        document.addEventListener("deviceready", function(){
            console.log('cordova db inited...');
            dbObj = window.sqlitePlugin.openDatabase({name: "Trento", bgType: 1});
            syncOptions=remoteSyncOptions;
            dbopenDeferred.resolve(dbObj);
        }, false);
    } else {
        console.log('web db...');
        dbObj = window.openDatabase('Trento', '1.0', 'Trento in Tasca', 2 * 1024 * 1024);
        syncOptions=localSyncOptions;
//        syncOptions=remoteSyncOptions;
        dbopenDeferred.resolve(dbObj);
    }
    dbopen=dbopenDeferred.promise;
    dbopen.then(function(dbObj){
        if (currentDbVersion==0 || currentSchemaVersion!=SCHEMA_VERSION) {
            console.log('initializing database...');
            dbObj.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS ContentObjects');
                tx.executeSql('CREATE TABLE IF NOT EXISTS ContentObjects (id text primary key, version integer, type text, category text, classification text, data text, lat real, lon real, updateTime integer)');
                tx.executeSql('CREATE INDEX IF NOT EXISTS co_id ON ContentObjects( id )');
                tx.executeSql('CREATE INDEX IF NOT EXISTS co_type ON ContentObjects( type )');
                tx.executeSql('CREATE INDEX IF NOT EXISTS co_cate ON ContentObjects( category )');
                tx.executeSql('CREATE INDEX IF NOT EXISTS co_class ON ContentObjects( classification )');
                tx.executeSql('CREATE INDEX IF NOT EXISTS co_lat ON ContentObjects( lat )');
                tx.executeSql('CREATE INDEX IF NOT EXISTS co_lon ON ContentObjects( lon )');
                tx.executeSql('CREATE INDEX IF NOT EXISTS co_typeclass ON ContentObjects( type, classification )');
                tx.executeSql('CREATE INDEX IF NOT EXISTS co_typeid ON ContentObjects( type, id )');
                localStorage.currentSchemaVersion=currentSchemaVersion=SCHEMA_VERSION;
                if (currentDbVersion>0) localStorage.currentDbVersion=currentDbVersion=0;
                console.log('initialized');

                dbDeferred.resolve(dbObj);
            });
        } else {
            dbDeferred.resolve(dbObj);
        }
    });
    db=dbDeferred.promise;

    return {
        sync: function() {
            syncronization=$q.defer();
            db.then(function(dbObj){
                var now_as_epoch = parseInt((new Date).getTime()/1000);
                if ( lastSynced==-1 || now_as_epoch>(lastSynced+Config.syncTimeoutSeconds()) ) {
                    syncing=$ionicLoading.show({ content: 'syncing...' });

                    $http.defaults.headers.common.Accept='application/json';
                    $http.defaults.headers.post={ 'Content-Type':'application/json' };
                    $http(syncOptions).success(function(data,status,headers,config){
                        console.log((now_as_epoch-lastSynced)+' seconds since last syncronization: checking web service...');
                        lastSynced=now_as_epoch;

                        nextVersion=data.version;
                        console.log('nextVersion: '+nextVersion);
                        if (nextVersion>currentDbVersion) {
                            objsDone=$q.defer();
                            objsUpdated={};
                            objsDeleted={};

                            dbObj.transaction(function (tx) {
                                angular.forEach(types, function(contentTypeClassName, contentTypeKey){
                                    console.log('type ('+contentTypeKey+'): '+contentTypeClassName);

                                    if (!angular.isUndefined(data.updated[contentTypeClassName])) {
                                        updates=data.updated[contentTypeClassName];
                                        console.log('updates: '+updates.length);

                                        angular.forEach(updates, function(item, idx){
                                            tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [ item.id ]);

                                            classification='';
                                            if (contentTypeKey=='content') {
                                                classification=item.classification;
                                            } else if (contentTypeKey=='poi') {
                                                classification=item.classification.it;
                                            } else if (contentTypeKey=='event') {
                                                category=item.category;
                                                if (category) {
                                                    // "category": "{objectName=Feste, mercati e fiere, classIdentifier=tipo_eventi, datePublished=1395152152, dateModified=1395152182, objectRemoteId=a15d79dc9794d829ed43364863a8225a, objectId=835351, link=http://www.comune.trento.it/api/opendata/v1/content/object/835351}"
                                                    startMrkr="{objectName=";
                                                    endMrkr=", classIdentifier=";
                                                    classification=category.substring(startMrkr.length,category.indexOf(endMrkr)) || '';
                                                    if (!classification || classification.toString()=='false') classification=Config.eventCateFromType('misc').it;
                                                    console.log('event cate: '+classification);
                                                }
                                            }
                                            values=[item.id, item.version, contentTypeClassName, item.category, classification, JSON.stringify(item), ((item.location && item.location.length==2)?item.location[0]:-1), ((item.location && item.location.length==2)?item.location[1]:-1), item.updateTime];
                                            tx.executeSql('INSERT INTO ContentObjects (id, version, type, category, classification, data, lat, lon, updateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', values
                                                ,function(tx, res){ //success callback
                                                    console.log('inserted obj with id: '+item.id);
                                                }
                                                ,function(e){  //error callback
                                                    console.log('unable to insert obj with id '+item.id+': '+e.message);
                                                }
                                            );
                                        });
                                    } else {
                                        console.log('nothing to update');
                                    }

                                    if (!angular.isUndefined(data.deleted[contentTypeClassName])) {
                                        deletions=data.deleted[contentTypeClassName];
                                        console.log('deletions: '+deletions.length);

                                        angular.forEach(deletions, function(item, idx){
                                            console.log('deleting obj with id: '+item.id);
                                            tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [ item.id ]
                                                ,function(tx, res){ //success callback
                                                    console.log('deleted obj with id: '+item.id);
                                                }
                                                ,function(e){  //error callback
                                                    console.log('unable to deleted obj with id '+item.id+': '+e.message);
                                                }
                                            );
                                        });
                                    } else {
                                        console.log('nothing to delete');
                                    }
                                });
                                objsDone.resolve(true);
                            });

                            objsDone.promise.then(function () {
                                currentDbVersion=nextVersion;
                                localStorage.currentDbVersion=currentDbVersion;

                                $ionicLoading.hide();
                                syncronization.resolve(currentDbVersion);
                            });
                        } else {
                            console.log('local database already up-to-date!');

                            $ionicLoading.hide();
                            syncronization.resolve(currentDbVersion);
                        }
                    }).error(function(data,status,headers,config){
                        console.log('data error!');
                        console.log(data);

                        $ionicLoading.hide();
                        syncronization.reject();
                    });
                } else{
                    console.log('avoiding too frequent syncronizations. seconds since last one: '+(now_as_epoch-lastSynced));

                    $ionicLoading.hide();
                    syncronization.resolve(currentDbVersion);
                }
            });
            return syncronization.promise;
        },
        all: function(dbname) {
            var data = $q.defer();
            this.sync().then(function(dbVersion){
                console.log('current database version: '+dbVersion);
                var loading=$ionicLoading.show({ content: 'loading...', showDelay:1000 });

                dbObj.transaction(function (tx) {
                    //console.log('type: '+types[dbname]);
                    tx.executeSql('SELECT id, data, lat, lon FROM ContentObjects WHERE type=?', [ types[dbname] ], function (tx, results) {
                        lista=[]
                        var len = results.rows.length, i;
                        console.log('results.rows.length: '+results.rows.length);
                        for (i = 0; i < len; i++) {
                            //console.log(results.rows.item(i));
                            lista.push(JSON.parse(results.rows.item(i).data));
                        }

                        $ionicLoading.hide();
                        data.resolve(lista);
                    });
                });
            });
            return data.promise;
        },
        cate: function(dbname,cateId) {
            var data = $q.defer();
            this.sync().then(function(dbVersion){
                console.log('current database version: '+dbVersion);
                var loading=$ionicLoading.show({ content: 'loading...', showDelay:1000 });

                dbObj.transaction(function (tx) {
//                    console.log('type: '+types[dbname]);
                    console.log('category: '+cateId);
                    tx.executeSql('SELECT id, data, lat, lon FROM ContentObjects WHERE type=? AND classification=?', [ types[dbname],cateId ], function (tx, cateResults) {
                        lista=[]
                        var len = cateResults.rows.length, i;
                        console.log('cateResults.rows.length: '+cateResults.rows.length);
                        for (i = 0; i < len; i++) {
                            //console.log(cateResults.rows.item(i));
                            lista.push(JSON.parse(cateResults.rows.item(i).data));
                        }

                        $ionicLoading.hide();
                        data.resolve(lista);
                    },function(tx, err){
                        console.log('data error!');
                        console.log(err);

                        $ionicLoading.hide();
                        data.reject();
                    });
                });
            });
            return data.promise;
        },
        get: function(dbname,itemId) {
            console.log('DatiDB.get("'+dbname+'","'+itemId+'")');

            return this.sync().then(function(dbVersion){
                console.log('[DatiDB.get("'+dbname+'","'+itemId+'")] current database version: '+dbVersion);
                var loading=$ionicLoading.show({ content: 'loading...', showDelay:1000 });

                var dbitem = $q.defer();
                dbObj.transaction(function (tx) {
                    //console.log('type: '+types[dbname]);
                    if (itemId.indexOf(',')==-1) {
                        console.log('itemId: '+itemId);
                        idCond='id=?';
                    } else {
                        console.log('itemsIds: '+itemId);
                        itemsIds=itemId.split(',');
                        for (i=0; i<itemsIds.length; i++) itemsIds[i]='?';
                        idCond='id IN ('+itemsIds.join()+')';
                    }
                    qParams=itemId.split(',');
                    qParams.unshift(types[dbname]);
                    dbQuery='SELECT id, data, lat, lon FROM ContentObjects WHERE type=? AND '+idCond;
                    console.log('dbQuery: '+dbQuery);
                    tx.executeSql(dbQuery, qParams, function (tx, results) {
                        $ionicLoading.hide();

                        if (results.rows.length>0) {
                            if (itemId.indexOf(',')==-1) {
                                dbitem.resolve(JSON.parse(results.rows.item(0).data));
                            } else {
                                lista=[]
                                var len = results.rows.length, i;
                                console.log('results.rows.length: '+results.rows.length);
                                for (i = 0; i < len; i++) {
                                    //console.log(cateResults.rows.item(i));
                                    lista.push(JSON.parse(results.rows.item(i).data));
                                }
                                dbitem.resolve(lista);
                            }
                        } else {
                            console.log('not found!');
                            dbitem.reject();
                        }
                    },function(tx, err){
                        console.log('error!');

                        $ionicLoading.hide();
                        dbitem.reject();
                    });
                });
                return dbitem.promise;
            });
        }
    }
})

.factory('Files', function($q, $http) {
    var onErrorFS=function(e) {
        console.log('Exception:');
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
    var fsObj=$q.defer();
    var filesystem=fsObj.promise;
    console.log('Opening file system...');
    if (window.cordova) {
        document.addEventListener("deviceready", function(){
            window.requestFileSystem(window.PERSISTENT, 50*1024*1024 /*5MB*/, function(fs){
                console.log('Opened file system: ' + fs.root.toURL());
                if (device.platform=='Android') {
                    console.log('cordova (android) fs...');
                    fsRoot='files-external';
                } else {
                    console.log('cordova (ios) fs...');
                    fsRoot='documents';
                }
                /*
                fs.root.getDirectory(fsRoot, {create: false}, function(dirEntry) {
                    fsObj.resolve(dirEntry);
                }, onErrorFS);
                */
                var dirReader = fs.root.createReader();
                dirReader.readEntries(function(entries) {
                    for(var i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        if (entry.isDirectory){
                            console.log('Directory: ' + entry.fullPath);
                        } else if (entry.isFile){
                            console.log('File: ' + entry.fullPath);
                        }
                    }
                    fsObj.resolve(fs.root);
                }, onErrorFS);
            }, onErrorFS);
        }, false);
    } else {
        var FS_QUOTA=50*1024*1024;  /*50MB*/
        var quotaRequested=function(grantedBytes) {
            window.requestFileSystem=window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem(window.PERSISTENT, grantedBytes, function(fs){
                fsObj.resolve(fs.root);
            }, onErrorFS);
        };

        if (window.webkitStorageInfo && window.webkitStorageInfo.requestQuota) {
            console.log('requesting quota...');
            window.webkitStorageInfo.requestQuota(PERSISTENT,FS_QUOTA,quotaRequested,onErrorFS);
        } else {
            quotaRequested(FS_QUOTA);
        }
    }
    return {
        list: function(dirname) {
            return filesystem.then(function(rootDir) {
                console.log('rootDir: '+rootDir.fullPath);
                return rootDir;
            });
        },
        get: function(fileurl) {
            //console.log('fileurl: '+fileurl);
            var filename=fileurl.substring(fileurl.lastIndexOf('/')+1);
            //console.log('filename: '+filename);
            var filegot=$q.defer();
            filesystem.then(function(rootDir) {
                //console.log('rootDir: '+rootDir.toURL());
                rootDir.getDirectory('SavedImages', {create: true}, function(dirEntry) {
                    dirEntry.getFile(filename, {}, function(fileEntry) {
                        console.log('file already saved: '+fileEntry.fullPath);
                        fileEntry.remove(function(){  console.log('file removed'); });
                        filegot.resolve(fileEntry.toURL());
                    },function(){
                        filesavepath=rootDir.toURL()+'SavedImages/'+filename;
                        if (window.cordova) {
                            console.log('[cordova] downloading to '+filesavepath);
                            var fileTransfer = new FileTransfer();
                            fileTransfer.download(fileurl,filesavepath,function(fileEntry) {
                                console.log("download complete: " + fileEntry.fullPath);
                                filegot.resolve(fileEntry.toURL());
                            }, function(error) {
                                //console.log("download error source " + error.source);console.log("download error target " + error.target);console.log("donwload error code: " + error.code);
                                filegot.reject(error);
                            }, true, { /* headers: { "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA==" } */ });
                        } else {
                            // NON CORDOVA IMPLEMENTATION PARKED: returning the same web url get got as input, for the moment
                            filegot.resolve(fileurl);
/*
                            $http({ method:'GET', url:fileurl, responseType:'arraybuffer' }).success(function(data,status,headers,config){
                                console.log(typeof data);
                                console.log('data.byteLength='+data.byteLength);
                            });
*/
                        }
                });
                }, function(){
                    filegot.reject();
                });
            });
            return filegot.promise;
        }
    };
})

.factory('DatiJSON', function($http) {
    return {
        all: function(dbname) {
            return $http.get('data/'+dbname+'-it.json').then(function(res){
                return res.data;
            });
        },
        cate: function(dbname,cateId) {
            return this.all(dbname).then(function(data){
                r=[];
                for (i=0; i<data.length; i++) {
                    if (data[i].classifications==cateId) {
                        r.push(data[i]);
                    }
                }
                return r;
            });
        },
        get: function(dbname,itemId) {
            return this.all(dbname).then(function(data){
                for (i=0; i<data.length; i++) {
                    if (data[i].id==itemId) {
                        return data[i];
                    }
                }
            });
        }
    };
})
