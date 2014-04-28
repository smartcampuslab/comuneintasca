angular.module('starter.services', [])

.factory('Config', function($q) {
    return {
        syncTimeoutSeconds: function(){ return 120; }
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
    var SCHEMA_VERSION=18;
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
                tx.executeSql('CREATE INDEX IF NOT EXISTS co_typeclass ON ContentObjects( type, id )');
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

                                            if (contentTypeKey=='content') {
                                                classification=item.classification;
                                            } else if (contentTypeKey=='poi') {
                                                classification=item.classification.it;
                                            } else {
                                                classification='';
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
                loading=$ionicLoading.show({ content: 'loading...', showDelay:1000 });

                db.then(function(dbObj){
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
            });

            return data.promise;
        },
        cate: function(dbname,cateId) {
            var data = $q.defer();
            this.sync().then(function(dbVersion){
                console.log('current database version: '+dbVersion);
                loading=$ionicLoading.show({ content: 'loading...', showDelay:1000 });

                db.then(function(dbObj){
                    dbObj.transaction(function (tx) {
//                        console.log('type: '+types[dbname]);
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
            });
            return data.promise;
        },
        get: function(dbname,itemId) {
            var item = $q.defer();
            this.sync().then(function(dbVersion){
                console.log('current database version: '+dbVersion);

                db.then(function(dbObj){
                    dbObj.transaction(function (tx) {
                        //console.log('type: '+types[dbname]);
                        //console.log('itemId: '+itemId);
                        tx.executeSql('SELECT id, data, lat, lon FROM ContentObjects WHERE type=? AND id=?', [ types[dbname],itemId ], function (tx, results) {
                            if (results.rows.length>0) {
                                //console.log(results.rows.item(0));
                                item.resolve(JSON.parse(results.rows.item(0).data));
                            } else {
                                item.reject();
                            }
                        });
                    });
                });
            });
            return item.promise;
        }
    }
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
    }
})
