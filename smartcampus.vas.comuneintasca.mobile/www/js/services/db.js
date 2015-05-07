angular.module('ilcomuneintasca.services.db', [])

.factory('DatiDB', function ($q, $http, $rootScope, $filter, $timeout, $window, Config, Files, Profiling, GeoLocate, $ionicLoading) {
  var SCHEMA_VERSION = Config.schemaVersion();
  var types = Config.contentTypesList();

  var parseDbRow = function (dbrow) {
    //comment out this line to profile each function call
    //Profiling.start('dbparse.total');
    //Profiling.start('dbparse');

    //console.log('dbrow.id: '+dbrow.id);
    var item = JSON.parse(dbrow.data);
    Profiling._do('dbparse','json');

		if (dbrow.parentid) {
			item['parentid']=dbrow.parentid;
			item['parenttype']=dbrow.parenttype;
			item['parent']=JSON.parse(dbrow.parent);
		}
		item['sonscount']=dbrow.sonscount;

    //item['parsedimageurl']='svg/placeholder.svg';

    var dbtype = Config.contentKeyFromDbType(dbrow.type);
    item['dbType']=dbtype;

    //console.log('dbtype: '+dbtype);
    //console.log('dbrow.classification: '+dbrow.classification);
    if (dbtype == 'itinerary') {
      item['abslink'] = '#/app/itinerary/' + item.id + '/info';
      Config.menuGroupSubgroupByTypeAndClassification('itineraries').then(function(sg){
        item['menu']=sg;
      });
    } else {
      item['abslinkgot']=Config.menuGroupSubgroupByTypeAndClassification(dbtype,dbrow.classification).then(function(sg){
        if (sg) {
          item['abslink'] = '#/app/page/'+sg._parent.id+'/'+sg.id+'/' + item.id;
          //console.log('abslink: '+item['abslink']);
          item['menu'] = sg;
        } else {
          //console.log('searching submenu without classification...');
          Config.menuGroupSubgroupByTypeAndClassification(dbtype).then(function(sg){
            if (sg) {
              item['abslink'] = '#/app/page/'+sg._parent.id+'/'+sg.id+'/' + item.id;
              //console.log('#2 abslink: '+item['abslink']);
              item['menu'] = sg;
            } else {
              console.log('sg NULL!');
              console.log('dbtype: '+dbtype);
              console.log('dbrow.classification: '+dbrow.classification);
            }
          },function(){
            console.log('#2 sg NOT FOUND!');
            console.log('#2 dbtype: '+dbtype);
            console.log('#2 dbrow.classification: '+dbrow.classification);
          });
        }
      },function(){
        console.log('sg NOT FOUND!');
        console.log('dbtype: '+dbtype);
        console.log('dbrow.classification: '+dbrow.classification);
      });
    }

    item['dbClassification'] = dbrow.classification || '';
    item['dbClassification2'] = dbrow.classification2 || '';
    item['dbClassification3'] = dbrow.classification3 || '';
    Profiling._do('dbparse','classification');

    if (dbtype == 'content') {
      //NO-OP

    } else if (dbtype == 'poi') {
      //console.log(JSON.stringify(item.info));
      Config.menuGroupSubgroup('visitare',item.dbClassification).then(function(sg){
        if (sg) {
          item['dbClass']=sg;
          item.dbClassification=sg.name;
        }
      },function(){
        console.log('sg "visitare" NOT FOUND!');
      });

    } else if (dbtype == 'event') {
      Config.menuGroupSubgroup('eventi',item.dbClassification).then(function(sg){
        if (sg) {
          item['dbClass']=sg;
          item.dbClassification=sg.name;
        }
      },function(){
        console.log('sg "eventi" NOT FOUND!');
      });

    } else if (dbtype == 'restaurant') {
      if (item.dbClassification != '') item.dbClassification = Config.restaurantCateFromType(item.dbClassification);
      if (item.dbClassification2 != '') item.dbClassification2 = Config.restaurantCateFromType(item.dbClassification2);
      if (item.dbClassification3 != '') item.dbClassification3 = Config.restaurantCateFromType(item.dbClassification3);

    } else if (dbtype == 'hotel') {
      if (item.dbClassification != '') item.dbClassification = Config.hotelCateFromType(item.dbClassification);

    } else if (dbtype == 'itinerary') {
      //NO-OP

    } else if (dbtype == 'mainevent') {
        item['date']=item.fromDate;
//      var maineventDate=new Date(item.fromDate);
//      item['date']=maineventDate.getMonth()*100 + maineventDate.getDate();
    }
    Profiling._do('dbparse','type');

    //console.log('item.location: ' + JSON.stringify(item.location));
    if (item.hasOwnProperty('location') && item.location) {
      if ($rootScope.myPosition) {
        distance = GeoLocate.distance($rootScope.myPosition, item.location);
        item['distance'] = distance;
      } else {
        GeoLocate.distanceTo(item.location).then(function (distance) {
          //console.log('distance: ' + distance);
          item['distance'] = distance;
        });
      }
    } else {
      //console.log('item.location UNKNOWN');
    }
    Profiling._do('dbparse','location');

    if (dbrow.fromTime > 0) item['fromTime'] = dbrow.fromTime;
    if (dbrow.toTime > 0) item['toTime'] = dbrow.toTime;
    Profiling._do('dbparse','time');

    Profiling._do('dbparse.total');
    return item;
  };

  var currentSchemaVersion = 0;
  if (localStorage.currentSchemaVersion) currentSchemaVersion = Number(localStorage.currentSchemaVersion);
  //console.log('currentSchemaVersion: ' + currentSchemaVersion);

  var currentDbVersion = 0, lastSynced = -1;
  if (currentSchemaVersion == SCHEMA_VERSION) {
    if (localStorage.currentDbVersion) currentDbVersion = Number(localStorage.currentDbVersion);
    if (localStorage.lastSynced) lastSynced = Number(localStorage.lastSynced);
  }
  //console.log('currentDbVersion: ' + currentDbVersion);
  //console.log('lastSynced: ' + lastSynced);

  var localSyncOptions = {
    method: 'GET',
    url: 'data/data.json',
    remote: false
  };
  var remoteSyncOptions = {
    method: 'POST',
    url: Config.syncUrl() + currentDbVersion,
    data: '{"updated":{}}',
    remote: true
  };
  console.log('remoteSyncOptions.url: '+remoteSyncOptions.url);

  var dbObj;

  var dbopenDeferred = $q.defer();
  var dbName=Config.dbName();
  if (ionic.Platform.isWebView()) {
    //console.log('cordova db...');
    document.addEventListener("deviceready", function () {
      //console.log('cordova db inited...');
      dbObj = window.sqlitePlugin.openDatabase({
        name: dbName,
        bgType: 1,
        skipBackup: true
      });
      dbopenDeferred.resolve(dbObj);
    }, false);
  } else {
    //console.log('web db...');
    dbObj = window.openDatabase(dbName, '1.0', dbName+' - Il Comune in Tasca', 5 * 1024 * 1024);
//    remoteSyncOptions = localSyncOptions;
    dbopenDeferred.resolve(dbObj);
  }
  dbopen = dbopenDeferred.promise;

  var dbDeferred = $q.defer();
  dbopen.then(function (dbObj) {
    if (currentSchemaVersion == 0 || currentSchemaVersion != SCHEMA_VERSION) {
      console.log('initializing database...');
      dbObj.transaction(function (tx) {
        // if favs schema changes, we need to specify some special changes to perform to upgrade it
        //if (currentSchemaVersion==0) {
          //tx.executeSql('DROP TABLE IF EXISTS Favorites');
          //console.log('favorites table dropped')
        //}
        tx.executeSql('CREATE TABLE IF NOT EXISTS Favorites (id text primary key)');
        tx.executeSql('CREATE INDEX IF NOT EXISTS fav_id ON Favorites( id )');
        console.log('favorites table done')

        tx.executeSql('DROP TABLE IF EXISTS ContentObjects');
        console.log('contents table created')
        tx.executeSql('CREATE TABLE IF NOT EXISTS ContentObjects (id text primary key, objid integer, parentid text, version integer, type text, category text, classification text, classification2 text, classification3 text, data text, lat real, lon real, fromTime integer, toTime integer)');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_objid ON ContentObjects( objid )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_pid ON ContentObjects( parentid )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_idpid ON ContentObjects( id, parentid )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type ON ContentObjects( type )');
        //tx.executeSql('CREATE INDEX IF NOT EXISTS co_cate ON ContentObjects( category )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_class ON ContentObjects( classification )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_class2 ON ContentObjects( classification2 )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_class3 ON ContentObjects( classification3 )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_lat ON ContentObjects( lat )');
        //tx.executeSql('CREATE INDEX IF NOT EXISTS co_lon ON ContentObjects( lon )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_lon ON ContentObjects( lat,lon )');
        //tx.executeSql('CREATE INDEX IF NOT EXISTS co_tf ON ContentObjects( fromTime )');
        //tx.executeSql('CREATE INDEX IF NOT EXISTS co_tt ON ContentObjects( toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_tt ON ContentObjects( type, toTime )');
        //tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_ttf ON ContentObjects( type, fromTime, toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_pid_type_class ON ContentObjects( parentid, type, classification )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class ON ContentObjects( type, classification )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class2 ON ContentObjects( type, classification2 )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class3 ON ContentObjects( type, classification3 )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class123 ON ContentObjects( type, classification, classification2, classification3 )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class_tt ON ContentObjects( type, classification, toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class2_tt ON ContentObjects( type, classification2, toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class3_tt ON ContentObjects( type, classification3, toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class123_tt ON ContentObjects( type, classification, classification2, classification3, toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class_ttf ON ContentObjects( type, classification, fromTime, toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class2_ttf ON ContentObjects( type, classification2, fromTime, toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class3_ttf ON ContentObjects( type, classification3, fromTime, toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class123_ttf ON ContentObjects( type, classification, classification2, classification3, fromTime, toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_typeid ON ContentObjects( type, id )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_typeid_class_tt ON ContentObjects( type, id, classification, toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_typeid_class_tft ON ContentObjects( type, id, classification, fromTime, toTime )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_typeid_class123_tft ON ContentObjects( type, id, classification, classification2, classification3, fromTime, toTime )');
      }, function (error) { //error callback
        console.log('cannot initialize db! ')
        console.log(error);
        dbDeferred.reject(error);
      }, function () { //success callback
        currentSchemaVersion = SCHEMA_VERSION;
        localStorage.currentSchemaVersion = currentSchemaVersion;
        if (currentDbVersion > 0) {
          currentDbVersion = 0;
          localStorage.currentDbVersion = currentDbVersion;
        }

        console.log('db initialized');
        dbDeferred.resolve(dbObj);
      });
    } else {
      //console.log('no need to init database...');
/*
      dbObj.transaction(function (tx) {
        tx.executeSql("select * from sqlite_master where type='index'", [], function (tx, res) { //success callback
          console.log('database schema following:');
          for (i = 0; i < res.rows.length; i++) console.log(res.rows.item(i).sql);
        }, function (e) { //error callback
          console.log('unable dump table schema 1');
        });
      }, function (e) { //success callback
        console.log('dump table schema ok');
      }, function (e) { //error callback
        console.log('unable dump table schema 2');
      });
*/
      dbDeferred.resolve(dbObj);
    }
  });
  db = dbDeferred.promise;

  var syncinprogress = null;

  return {
		reset: function () { 
          if (!ionic.Platform.isWebView() || navigator.connection.type != Connection.NONE) {
            //localStorage.cachedProfile=null;
            localStorage.lastSynced=lastSynced=-1;
          } else {
            console.log('cannot reset db: offline!');
          }
          return this.sync();//.then(function(){
//            console.log('DB reset completed.');
//          },function(){
//            console.log('DB not resetted.');
//          });
		},
		fullreset: function (cb) { 
			localStorage.currentDbVersion=currentDbVersion=0;
      localStorage.cachedProfile=null;
      var loading = $ionicLoading.show({
        template: $filter('translate')(Config.keys()['loading']),
        delay: 400,
        duration: Config.loadingOverlayTimeoutMillis()
      });
      return this.reset().then(function(){
        console.log('DB FULL-RESET completed.');
      });
		},
		remotereset: function (cb) { 
			localStorage.currentDbVersion=currentDbVersion=1;
      localStorage.cachedProfile=null;
      var loading = $ionicLoading.show({
        template: $filter('translate')(Config.keys()['loading']),
        delay: 400,
        duration: Config.loadingOverlayTimeoutMillis()
      });
      return this.reset().then(function(){
        console.log('DB REMOTE-RESET completed.');
      });
		},
    sync: function () {
      if (syncinprogress!=null) {
        //console.log('waiting for previuos sync process to finish...');
        return syncinprogress;
      }
      syncronization = $q.defer();
      syncinprogress=syncronization.promise;
      db.then(function (dbObj) {
        Profiling.start('dbsync');
        if (ionic.Platform.isWebView() && navigator.connection.type == Connection.NONE && currentDbVersion!=0) {
          $ionicLoading.hide();
          console.log('no network connection');
          Profiling._do('dbsync');
          syncinprogress=null;
          syncronization.resolve(currentDbVersion);
        } else {
          var now_as_epoch = parseInt((new Date).getTime() / 1000);
          var to = (lastSynced + Config.syncTimeoutSeconds());
          //console.log('lastSynced='+lastSynced);
          if (lastSynced == -1 || now_as_epoch > to) {
            console.log('currentDbVersion: ' + currentDbVersion);
            if (currentDbVersion == 0) {
              console.log('on first run, skipping sync time tagging to allow real remote sync on next check');
            } else {
              console.log((now_as_epoch - lastSynced) + ' seconds since last syncronization: checking web service...');
              lastSynced = now_as_epoch;
              localStorage.lastSynced = lastSynced;
            }

            var syncingOverlay = $ionicLoading.show({
              template: $filter('translate')(Config.keys()['syncing']),
              duration: Config.syncingOverlayTimeoutMillis()
            });

            if (currentDbVersion == 0) {
              currentSyncOptions = localSyncOptions;
            //} else if (!currentSyncOptions || currentSyncOptions.remote) {
            } else {
              currentSyncOptions = remoteSyncOptions;
              currentSyncOptions.url = Config.syncUrl() + currentDbVersion;
            }
            console.log('currentSyncOptions: ' + JSON.stringify(currentSyncOptions));

            $http.defaults.headers.common.Accept = 'application/json';
            $http.defaults.headers.post = { 'Content-Type': 'application/json' };
            $http(currentSyncOptions).success(function (data, status, headers, config) {
//              console.log('successful sync response status: '+status);
              var nextVersion = data.version;
              console.log('nextVersion: ' + nextVersion);
              if (nextVersion > currentDbVersion) {
                var itemsToInsert=[];
                var objsReady=[];

                var configTypeClassName=types['config'];
                if (!angular.isUndefined(data.updated[configTypeClassName])) {
                  config = data.updated[configTypeClassName][0];
                  //console.log('CONFIG object parsed:');console.log(config);
                  localStorage.cachedProfile = JSON.stringify(config);
                  $rootScope.$emit('profileUpdated');
                }

                try {
                  angular.forEach(types, function (contentTypeClassName, contentTypeKey) {
                  //console.log('INSERTS[' + contentTypeKey + ']: ' + contentTypeClassName);

                  if (!angular.isUndefined(data.updated[contentTypeClassName])) {
                    updates = data.updated[contentTypeClassName];

                    if (contentTypeKey == 'config' || contentTypeKey == 'oldconfig') {
                      //console.log('CONFIG object already parsed');
                      return;
                    }
                    /*
                    if (contentTypeKey == 'home') {
                      localStorage.homeObject = JSON.stringify(updates[0]);
                      return;
                    }
                    */

                    console.log('INSERTS[' + contentTypeKey + ']: ' + updates.length);
                    angular.forEach(updates, function (item, idx) {
											var parentid=null;

                      var fromTime = 0;
                      var toTime = 0;

                      var classification = '', 
                          classification2 = '', 
                          classification3 = '';

                      var classified=$q.defer();
                      if (contentTypeKey == 'event') {

                        fromTime = item.fromTime;
                        if (item.toTime > 0) toTime = item.toTime;
                        else toTime = fromTime;
                        //console.log('event fromTime: ' + fromTime);
                        //console.log('event toTime: ' + toTime);

                        if (item.parentEventId) {
                          var parentEvent=item.parentEventId;
                          if (typeof parentEvent == "string") {
                            try {
                              parentEvent=JSON.parse(parentEvent);
                            } catch(err) {
                              console.log('unparsable parentEvent string for item '+item.id+'/'+item.objectId+': '+parentEvent);
                              console.log(err);
                              parentEvent = {};
                            }  
                          }
                          if (parentEvent.objectRemoteId) {
                            parentid=parentEvent.objectRemoteId;
                          }
                        }
                        //if (parentid) console.log('event parent id: ' + parentid);

                        //console.log('event cate: ' + item.category);
                        if (item.category) {
                          classified.resolve([item.category,'','']);
                        } else {
                          console.log('content db category is NULL for item: '+item.id);
                          classified.resolve(['misc','','']);
                        }

                      } else if (contentTypeKey == 'content') {
                        if (typeof item.classification === 'object') classification = item.classification.it;
                        else classification = item.classification;

                      } else if (contentTypeKey == 'mainevent') {
                        classification = item.classification.it;
                        item.category = 'mainevent';

                        /*
                        fromTime = item.fromDate;
                        if (item.toDate > 0) toTime = item.toDate;
                        else toTime = fromTime;
                        console.log('event fromTime: ' + fromTime);
                        console.log('event toTime: ' + toTime);
                        */

                      } else if (contentTypeKey == 'hotel') {
                        classification = Config.hotelTypeFromCate(item.classification.it);

                      } else if (contentTypeKey == 'restaurant') {
                        if (item.classification.it.indexOf(',')!=-1) {
                          classifications = item.classification.it.split(',');
                        } else {
                          classifications = item.classification.it.split(';');
                        }
                        classification = Config.restaurantTypeFromCate(classifications[0].trim());
                        if (classifications.length > 1) {
                          classification2 = Config.restaurantTypeFromCate(classifications[1].trim());
                          if (classifications.length > 2) {
                            classification3 = Config.restaurantTypeFromCate(classifications[2].trim());
                          }
                        }
                        item.category = 'ristorazione';
                      } else if (contentTypeKey == 'poi') {
                        classification = item.classification.it;

                      } else if (contentTypeKey == 'servizio_sul_territorio') {
                        classification = item.classification.it;

                      }
                      //console.log('classification: ' + classification);
                      //console.log('classification2: ' + classification2);
                      //console.log('classification3: ' + classification3);
                      classified.resolve([classification,classification2,classification3]);

                      objsReady.push(classified.promise.then(function(clfs){
                        values = [item.id, item.objectId, parentid, item.version, contentTypeClassName, item.category, clfs[0] ? clfs[0].toLowerCase() : clfs[0], clfs[1] ? clfs[1].toLowerCase() : clfs[1], clfs[2] ? clfs[2].toLowerCase() : clfs[2], JSON.stringify(item), ((item.location && item.location.length == 2) ? item.location[0] : -1), ((item.location && item.location.length == 2) ? item.location[1] : -1), fromTime, toTime];
                        itemsToInsert.push(values)
                      }));

                    });

                  } else {
                    console.log('nothing to update');
                  }

                });
                } catch (err) {
                    $ionicLoading.hide();
                    Profiling._do('dbsync');
                    syncinprogress=null;
                    syncronization.reject(currentDbVersion);
                    return;
                }
                var insertsPromise = $q.defer();
                var deletionsPromise = $q.defer();

                $q.all(objsReady).then(function(){
                  //console.log('itemsToInsert.length: '+itemsToInsert.length);
                  dbObj.transaction(function (tx) {
                    angular.forEach(itemsToInsert, function (rowData, rowIdx) {
                      tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [rowData[0]], function (tx, res) { //success callback
                        tx.executeSql('INSERT INTO ContentObjects (id, objid, parentid, version, type, category, classification, classification2, classification3, data, lat, lon, fromTime, toTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', rowData, function (tx, res) { //success callback
                          console.log('inserted obj ('+rowData[4]+') with id: ' + rowData[0]);
                        }, function (e) { //error callback
                          console.log('unable to insert obj with id ' + rowData[0] + ': ' + e.message);
                        });
                      }, function (e) { //error callback
                        console.log('unable to delete obj with id ' + rowData[0] + ': ' + e.message);
                      });
                    });
                  }, function (err) { //error callback
                    console.log('cannot do inserts: '+err.message);
                    insertsPromise.reject();
                  }, function () { //success callback
                    console.log('inserted');
                    insertsPromise.resolve();
                  });

                  dbObj.transaction(function (tx) {
                    angular.forEach(types, function (contentTypeClassName, contentTypeKey) {
                      //console.log('DELETIONS[' + contentTypeKey + ']: ' + contentTypeClassName);
                      if (!angular.isUndefined(data.deleted[contentTypeClassName])) {
                        deletions = data.deleted[contentTypeClassName];
                        console.log('DELETIONS[' + contentTypeKey + ']: ' + deletions.length);

                        angular.forEach(deletions, function (item, idx) {
                          //console.log('deleting obj with id: ' + item);
                          tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [item], function (tx, res) { //success callback
                            //console.log('deleted obj with id: ' + item);
                          }, function (e) { //error callback
                            console.log('unable to delete obj with id ' + item + ': ' + e.message);
                          });
                        });
                      } else {
                        console.log('nothing to delete for "'+contentTypeKey+'"');
                      }
                    });

                    var nowTime = new Date();
                    //console.log('[EVENTS CLEANUP] nowTime=' + nowTime);
                    var yesterdayTime = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), 0, 0, 0, 0).getTime();
                    //console.log('[EVENTS CLEANUP] yesterdayTime=' + new Date(yesterdayTime));
                    tx.executeSql('DELETE FROM ContentObjects WHERE type = ? AND toTime < ?', [ types['event'],yesterdayTime ], function (tx, res) { //success callback
                      console.log('deleted old events');
                    }, function (e) { //error callback
                      console.log('unable to delete old events: ' + e.message);
                    });

                  }, function (err) { //error callback
                    console.log('cannot do deletions: '+err.message);
                    deletionsPromise.reject();
                  }, function () { //success callback
                    console.log('deletions done');
                    deletionsPromise.resolve();
                  });

                }).then(function(){
                  console.log('waiting for insertsPromise &deletionsPromise...');
                  $q.all([insertsPromise.promise, deletionsPromise.promise]).then(function(){
                    $ionicLoading.hide();
                    currentDbVersion = nextVersion;
                    localStorage.currentDbVersion = currentDbVersion;
                    console.log('synced to version: ' + currentDbVersion);
                    Profiling._do('dbsync');
                    syncinprogress=null;
                    syncronization.resolve(currentDbVersion);
                  });
                },function(err){
                  $ionicLoading.hide();
                  Profiling._do('dbsync');
                  syncinprogress=null;
                  syncronization.reject();
                });

              } else {
                $ionicLoading.hide();
                console.log('local database already up-to-date!');
                Profiling._do('dbsync');
                syncinprogress=null;
                syncronization.resolve(currentDbVersion);
              }
            }).error(function (data, status, headers, config) {
              $ionicLoading.hide();
              console.log('cannot check for new data: network unavailable? (HTTP: '+status+')');
              //console.log(status);
              Profiling._do('dbsync');
              syncinprogress=null;
              syncronization.resolve(currentDbVersion);
            });
          } else {
            $ionicLoading.hide();
            //console.log('avoiding too frequent syncronizations. seconds since last one: ' + (now_as_epoch - lastSynced));
            Profiling._do('dbsync');
            syncinprogress=null;
            syncronization.resolve(currentDbVersion);
          }
        }
      });
      return syncronization.promise;
    },
    all: function (dbname, parentId) {
      var data = $q.defer();
      this.sync().then(function (dbVersion) {
        Profiling.start('dball');
        var loading = $ionicLoading.show({
          template: $filter('translate')(Config.keys()['loading']),
          delay: 600, // how many milliseconds to delay before showing the indicator
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          //console.log('[DB.all()] dbname: '+dbname);

          var parentIdCond,parentIds;
          if (parentId) {
            var parentIds=parentId.split(',')
            if (parentId.indexOf(',') == -1) {
              parentIdCond = 'c.parentid=?';
            } else {
              for (i in parentIds) parentIds[i] = '?';
              parentIdCond = 'c.parentid IN (' + parentIds.join() + ')';
            }
          }
          //console.log('parentIdCond: '+parentIdCond);

          var _complex=undefined;
          if (dbname=='event') {
            _complex=false;
          }

          var sql = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.type AS parenttype, p.data AS parent, count(s.id) as sonscount' +
						' FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid LEFT OUTER JOIN ContentObjects s ON s.parentid=c.id' +
            ' WHERE c.type=? ' +
						(parentIdCond ? ' AND '+parentIdCond : '') + 
            (_complex==undefined ? '' : ' AND c.classification' + (_complex?'=':'!=') + "'_complex'" ) + 
						' GROUP BY c.id';
          var params = [ types[dbname] ];
          if (parentId) {
            for (i in parentIds) params.push(parentIds[i]);
          }

          //console.log('[DB.all()] sql: '+sql);
          //console.log('[DB.all()] params: '+params);

          tx.executeSql(sql, params, function (tx, results) {
            Profiling._do('dball','sql');
            var len = results.rows.length,
              i;
            for (i = 0; i < len; i++) {
              var item = results.rows.item(i);
              lista.push(parseDbRow(item));
            }
            Profiling._do('dball','parse');
          }, function (tx, err) {
            $ionicLoading.hide();
            console.log('data error!');
            console.log(err);
            Profiling._do('dball');
            data.reject();
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.all() ERROR: ' + error);
          Profiling._do('dball');
          data.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          Profiling._do('dball');
          data.resolve(lista);
        });
      });
      return data.promise;
    },
    cate: function (dbname, cateId, parentId) {
      var data = $q.defer();
      this.sync().then(function (dbVersion) {
        Profiling.start('dbcate');
        var loading = $ionicLoading.show({
          template: $filter('translate')(Config.keys()['loading']),
          delay: 200,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          //console.log('[DB.cate()] dbname: '+dbname);
          //console.log('[DB.cate()] cateId: ' + cateId);

          var parentIdCond,parentIds;
          if (parentId) {
            var parentIds=parentId.split(',')
            if (parentId.indexOf(',') == -1) {
              parentIdCond = 'c.parentid=?';
            } else {
              for (i in parentIds) parentIds[i] = '?';
              parentIdCond = 'c.parentid IN (' + itemsIds.join() + ')';
            }
          }
          //console.log('parentIdCond: '+parentIdCond);

          var _complex=undefined;
          if (dbname=='event') {
            if (cateId && cateId=='_complex') {
              _complex=true;
            } else {
              _complex=false;
            }
          }
					
          var d = new Date();
          var min_toTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime() - 1;

/*
          var sql = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.type AS parenttype, p.data AS parent, count(s.id) as sonscount ' +
						'FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid LEFT OUTER JOIN ContentObjects s ON s.parentid=c.id' +
            ' WHERE c.type=? ' +
            (_complex==undefined ? (cateId ? ' AND c.classification=?' : '') : ' AND c.classification' + (_complex?'=':'!=') + "'_complex'" ) + 
						' GROUP BY c.id';
          var params = (cateId ? [types[dbname], cateId] : [types[dbname]]);
*/
          var sql = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.type AS parenttype, p.data AS parent, count(s.id) as sonscount ' +
						'FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid LEFT OUTER JOIN ContentObjects s ON s.parentid=c.id' +
            ' WHERE c.type=? ' +
						(parentIdCond ? ' AND '+parentIdCond : '') + 
						(cateId ? ' AND (c.classification=? OR c.classification2=? OR c.classification3=?)' : '') + 
            ' AND (s.id IS NULL OR s.toTime > ' + min_toTime + ')' +
            (_complex==undefined ? '' : ' AND c.classification' + (_complex?'=':'!=') + "'_complex'" ) + 
						' GROUP BY c.id';
          var params = [ types[dbname] ];
          if (parentId) {
            for (i in parentIds) params.push(parentIds[i]);
          }
          if (cateId) {
            var lower = cateId.toLowerCase();
            params.push(lower);
            params.push(lower);
            params.push(lower);
          }

          //console.log('[DB.cate()] sql: '+sql);
          //console.log('[DB.cate()] params: '+params);

          tx.executeSql(sql, params, function (tx2, cateResults) {
            Profiling._do('dbcate','sql');
            var len = cateResults.rows.length,
              i;
            for (i = 0; i < len; i++) {
              var item = cateResults.rows.item(i);
              //lista.push(parseDbRow(item));
              lista.push(item);
            }
            Profiling._do('dbcate','lista');
            //data.resolve(lista);
          }, function (tx2, err) {
            $ionicLoading.hide();
            console.log('cate data error!');
            console.log(err);
            Profiling._do('dbcate');
            data.reject(err);
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.cate() ERROR: ' + error);
          Profiling._do('dbcate');
          data.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          Profiling._do('dbcate','tx success');

          for (i in lista) lista[i]=parseDbRow(lista[i]);
          Profiling._do('dbcate','parse');
          
          data.resolve(lista);
        });
      });
      return data.promise;
    },
    byTimeInterval: function (dbname, fromTime, toTime, cateId, objContext, parentId) {
      var data = $q.defer();
      this.sync().then(function (dbVersion) {
        Profiling.start('byTimeInterval');
        var loading = $ionicLoading.show({
          template: $filter('translate')(Config.keys()['loading']),
          delay: 200,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          //console.log('[DB.byTimeInterval()] dbname: '+dbname);
          //console.log('[DB.byTimeInterval()] cateId: ' + cateId);

          var parentIdCond,parentIds;
          if (parentId) {
            var parentIds=parentId.split(',')
            if (parentId.indexOf(',') == -1) {
              parentIdCond = 'c.parentid=?';
            } else {
              for (i in parentIds) parentIds[i] = '?';
              parentIdCond = 'c.parentid IN (' + itemsIds.join() + ')';
            }
          }
          //console.log('parentIdCond: '+parentIdCond);

          var _complex=undefined;
          if (dbname=='event') {
            if (cateId && cateId=='_complex') {
              _complex=true;
            } else {
              _complex=false;
            }
          }

/*
          var sql = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, c.parentid'+
						' FROM ContentObjects c' +
            ' WHERE c.type=?' +
            ' AND c.fromTime > 0 AND c.fromTime <' + toTime + ' AND c.toTime > ' + fromTime + 
						(cateId ? ' AND (c.classification=? OR c.classification2=? OR c.classification3=?)' : '') + 
            (_complex==undefined ? '' : ' AND c.classification' + (_complex?'=':'!=') + "'_complex'" );
*/
          var sql = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.type AS parenttype, p.data AS parent, count(s.id) as sonscount'+
						' FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid LEFT OUTER JOIN ContentObjects s ON s.parentid=c.id' +
            ' WHERE c.type=?' +
						(parentIdCond ? ' AND '+parentIdCond : '') + 
            ' AND c.fromTime > 0 AND c.fromTime <' + toTime + ' AND c.toTime > ' + fromTime + 
						(cateId ? ' AND (c.classification=? OR c.classification2=? OR c.classification3=?)' : '') + 
            (_complex==undefined ? '' : ' AND c.classification' + (_complex?'=':'!=') + "'_complex'" ) + 
						' GROUP BY c.id';
          var params = [ types[dbname] ];
          if (parentId) {
            for (i in parentIds) params.push(parentIds[i]);
          }
          if (cateId) {
            var lower = cateId.toLowerCase();
            params.push(lower);
            params.push(lower);
            params.push(lower);
          }

          //console.log('[DB.byTimeInterval()] sql: '+sql);
          //console.log('[DB.byTimeInterval()] params: '+params);

          tx.executeSql(sql, params, function (tx2, cateResults) {
            Profiling._do('byTimeInterval','sql');
            var len = cateResults.rows.length,
              i;
            for (i = 0; i < len; i++) {
              var item = cateResults.rows.item(i);
              item.ctx=objContext;
              lista.push(item);
            }
            Profiling._do('byTimeInterval','parse');
          }, function (tx2, err) {
            $ionicLoading.hide();
            console.log('byTimeInterval data error!');
            console.log(JSON.stringify(err));
            Profiling._do('byTimeInterval');
            data.reject(err);
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.cate() ERROR: ' + error);
          Profiling._do('byTimeInterval');
          data.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          Profiling._do('byTimeInterval','tx success');

          for (i in lista) lista[i]=parseDbRow(lista[i]);
          Profiling._do('byTimeInterval','parse');
          
          data.resolve(lista);
        });
      });
      return data.promise;
    },
    getByParent: function (dbname, parentId) {
      //console.log('DatiDB.get("' + dbname + '","' + parentId + '")');
      return this.sync().then(function (dbVersion) {
        Profiling.start('dbsons');
        var loading = $ionicLoading.show({
          template: $filter('translate')(Config.keys()['loading']),
          delay: 400,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var dbsons = $q.defer();
        var lista = [];
        dbObj.transaction(function (tx) {
          //console.log('DatiDB.get(); parentId: ' + parentId);
          if (parentId.indexOf(',') == -1) {
            idCond = 'c.parentid=?';
          } else {
            itemsIds = parentId.split(',');
            for (i = 0; i < itemsIds.length; i++) itemsIds[i] = '?';
            idCond = 'c.parentid IN (' + itemsIds.join() + ')';
          }
          var qParams = parentId.split(',');
          if (dbname) qParams.unshift(types[dbname]);

          var fromTime = new Date().getTime();
          var dbQuery = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.type AS parenttype, p.data AS parent'+
						' FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid'+
            ' WHERE' + (dbname ? ' c.type=? AND ' : ' ') + idCond +
            ' GROUP BY c.id';
          //console.log('dbQuery: '+dbQuery);
          //console.log('qParams: ' + qParams);
          tx.executeSql(dbQuery, qParams, function (tx2, results) {
            Profiling._do('dbsons', 'sql');
            var resultslen = results.rows.length;
            //console.log('resultslen: '+resultslen);
            for (var i = 0; i < resultslen; i++) {
              var item = results.rows.item(i);
              //lista.push(parseDbRow(item));
              lista.push(item);
            }
            Profiling._do('dbsons', 'parse');
          }, function (tx2, err) {
            $ionicLoading.hide();
            console.log('error: ' + err);
            Profiling._do('dbsons', 'sql error');
            dbsons.reject(err);
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.get() ERROR: ' + error);
          Profiling._do('dbsons', 'tx error');
          dbsons.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          Profiling._do('dbsons', 'tx success');

          for (i in lista) lista[i]=parseDbRow(lista[i]);
          Profiling._do('dbsons','parse');
          
          dbsons.resolve(lista);
        });

        return dbsons.promise;
      });
    },
    getObj: function (dbname, objId) {
      console.log('DatiDB.getObj("' + dbname + '","' + objId + '")');
      return this.sync().then(function (dbVersion) {
        Profiling.start('dbgetobj');
        var loading = $ionicLoading.show({
          template: $filter('translate')(Config.keys()['loading']),
          delay: 600,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var dbitem = $q.defer();
        var lista = [];
        dbObj.transaction(function (tx) {
          //console.log('DatiDB.getObj(); objId: ' + objId);
          if (objId.indexOf(',') == -1) {
            idCond = 'c.objid=?';
          } else {
            qmarks = objId.split(',');
            for (i = 0; i < qmarks.length; i++) qmarks[i] = '?';
            idCond = 'c.objid IN (' + qmarks.join() + ')';
          }
          var qParams = objId.split(',');
          qParams.unshift(types[dbname]);

          var d = new Date();
          var min_toTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime() - 1;
					var dbQuery = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.type AS parenttype, p.data AS parent, count(s.id) as sonscount'+
						' FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid LEFT OUTER JOIN ContentObjects s ON s.parentid=c.id'+
            ' WHERE c.type=?' +
            ' AND ' + idCond + 
            ' AND (s.id IS NULL OR s.toTime > ' + min_toTime + ')' +
            ' GROUP BY c.id';
          //console.log('dbQuery: ' + dbQuery);
          //console.log('qParams: ' + qParams);
          //console.log('DatiDB.getObj("' + dbname + '", "' + objId + '"); dbQuery launched...');
          tx.executeSql(dbQuery, qParams, function (tx2, results) {
            //console.log('DatiDB.getObj("' + dbname + '", "' + objId + '"); dbQuery completed');
            var resultslen = results.rows.length;
            if (resultslen > 0) {
              if (objId.indexOf(',') == -1) {
                var item = results.rows.item(0);
                var result = parseDbRow(item);
                Profiling._do('dbgetobj', 'single');
                dbitem.resolve(result);
              } else {
                for (var i = 0; i < resultslen; i++) {
                  var item = results.rows.item(i);
                  lista.push(parseDbRow(item));
                }
                Profiling._do('dbgetobj', 'list');
                dbitem.resolve(lista);
              }
            } else {
              console.log('not found!');
              Profiling._do('dbgetobj', 'sql empty');
              dbitem.reject('not found!');
            }
          }, function (tx2, err) {
            $ionicLoading.hide();
            console.log('error: ' + err);
            Profiling._do('dbgetobj', 'sql error');
            dbitem.reject(err);
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.getObj() ERROR: ' + error);
          Profiling._do('dbgetobj', 'tx error');
          dbitem.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          Profiling._do('dbgetobj', 'tx success');
        });

        return dbitem.promise;
      });
    },
    get: function (dbname, itemId) {
      //console.log('DatiDB.get("' + dbname + '","' + itemId + '")');
      return this.sync().then(function (dbVersion) {
        Profiling.start('dbget');
        var loading = $ionicLoading.show({
          template: $filter('translate')(Config.keys()['loading']),
          delay: 600,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var dbitem = $q.defer();
        var lista = [];
        dbObj.transaction(function (tx) {
          //console.log('DatiDB.get(); itemId: ' + itemId);
          if (itemId.indexOf(',') == -1) {
            idCond = 'c.id=?';
          } else {
            itemsIds = itemId.split(',');
            for (i = 0; i < itemsIds.length; i++) itemsIds[i] = '?';
            idCond = 'c.id IN (' + itemsIds.join() + ')';
          }
          var qParams = itemId.split(',');
          if (dbname) qParams.unshift(types[dbname]);

          var d = new Date();
          var min_toTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime() - 1;
					var dbQuery = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.type AS parenttype, p.data AS parent, count(s.id) as sonscount'+
						' FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid LEFT OUTER JOIN ContentObjects s ON s.parentid=c.id'+
            (dbname?' WHERE c.type=?':'') +
            ' AND ' + idCond + 
            ' AND (s.id IS NULL OR s.toTime > ' + min_toTime + ')' +
            ' GROUP BY c.id';
          //console.log('dbQuery: ' + dbQuery);
          //console.log('qParams: ' + qParams);
          //console.log('DatiDB.get("' + dbname + '", "' + itemId + '"); dbQuery launched...');
          tx.executeSql(dbQuery, qParams, function (tx2, results) {
            //console.log('DatiDB.get("' + dbname + '", "' + itemId + '"); dbQuery completed');
            var resultslen = results.rows.length;
            if (resultslen > 0) {
              if (itemId.indexOf(',') == -1) {
                var item = results.rows.item(0);
                var result = parseDbRow(item);
                Profiling._do('dbget', 'single');
                dbitem.resolve(result);
              } else {
                for (var i = 0; i < resultslen; i++) {
                  var item = results.rows.item(i);
                  lista.push(parseDbRow(item));
                }
                Profiling._do('dbget', 'list');
                dbitem.resolve(lista);
              }
            } else {
              console.log('not found!');
              Profiling._do('dbget', 'sql empty');
              dbitem.reject('not found!');
            }
          }, function (tx2, err) {
            $ionicLoading.hide();
            console.log('error: ' + err);
            Profiling._do('dbget', 'sql error');
            dbitem.reject(err);
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.get() ERROR: ' + error);
          Profiling._do('dbget', 'tx error');
          dbitem.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          Profiling._do('dbget', 'tx success');
        });

        return dbitem.promise;
      });
    },
    checkIDs: function (itemIds,ref) {
      //console.log('DatiDB.checkIDs(); itemIds: ' + itemIds);
      Profiling.start('dbcheck');
      var dbitem = $q.defer();
      db.then(function (dbObj) {
        dbObj.transaction(function (tx) {
          var conds = [];
          for (var i = 0; i < itemIds.length; i++) conds[i] = '?';
          var idCond = 'id IN (' + conds.join() + ')';

          var qParams = itemIds;
          var dbQuery = 'SELECT id FROM ContentObjects WHERE ' + idCond;
          //console.log('DatiDB.getAny(); dbQuery: ' + dbQuery);
          tx.executeSql(dbQuery, qParams, function (tx2, results) {
            //console.log('DB.checkIDs(); qParams: '+qParams);
            var resultslen = results.rows.length;
            if (resultslen > 0) {
              Profiling._do('dbcheck', 'list');
              dbitem.resolve(qParams);
            } else {
              //console.log('DB.checkIDs('+itemIds+'): not found!');
              Profiling._do('dbcheck', 'sql empty');
              dbitem.reject([itemIds,ref]);
            }
          }, function (tx2, err) {
            $ionicLoading.hide();
            console.log('error: ' + err);
            Profiling._do('dbcheck', 'sql error');
            dbitem.reject([itemIds,ref]);
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('DB.checkIDs() ERROR: ' + error);
          Profiling._do('dbcheck', 'tx error');
          dbitem.reject([itemIds,ref]);
        }, function () { //success callback
          $ionicLoading.hide();
          Profiling._do('dbcheck', 'tx success');
        });
      });

      return dbitem.promise;
    },
    getFavorites: function () {
      //console.log('DatiDB.getFavorites()');

      Profiling.start('dbfavs');
      var loading = $ionicLoading.show({
        template: $filter('translate')(Config.keys()['loading']),
        delay: 1000,
        duration: Config.loadingOverlayTimeoutMillis()
      });

      var dbitem = $q.defer();
      db.then(function (dbObj) {
        dbObj.transaction(function (tx) {
          //console.log('type: '+types[dbname]);
          var dbQuery = 'SELECT co.id, co.type, co.classification, co.classification2, co.classification3, co.data, co.category FROM ContentObjects co, Favorites f WHERE f.id=co.id';
          //console.log('dbQuery: ' + dbQuery);
          tx.executeSql(dbQuery, null, function (tx, results) {
            var resultslen = results.rows.length;
            if (resultslen > 0) {
              var lista = [];
              for (var i = 0; i < resultslen; i++) {
                var item = results.rows.item(i);
                lista.push(parseDbRow(item));
              }
              Profiling._do('dbfavs', 'list');
              dbitem.resolve(lista);
            } else {
              //console.log('not found!');
              Profiling._do('dbfavs', 'sql empty');
              dbitem.reject('not found!');
            }
          }, function (tx, err) {
            $ionicLoading.hide();
            console.log('error: ' + err);
            Profiling._do('dbfavs', 'sql error');
            dbitem.reject(err);
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.get() ERROR: ' + error);
          Profiling._do('dbfavs', 'tx error');
          dbitem.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          Profiling._do('dbfavs', 'tx success');
        });
      });
      return dbitem.promise;
    },
    isFavorite: function (itemId) {
      //console.log('DatiDB.isFavorite('+itemId+')');
      var dbitem = $q.defer();
      db.then(function (dbObj) {
        dbObj.transaction(function (tx) {
          Profiling.start('dbfav');

          //console.log('type: '+types[dbname]);
          var dbQuery = 'SELECT id FROM Favorites f WHERE f.id=?';
          //console.log('dbQuery: ' + dbQuery);
          tx.executeSql(dbQuery, [itemId], function (tx, results) {
            if (results.rows.length > 0) {
              Profiling._do('dbfav', 'found');
              dbitem.resolve(true);
            } else {
              //console.log('not found!');
              Profiling._do('dbfav', 'not found');
              dbitem.resolve(false);
            }
          }, function (tx, err) {
            console.log('error: ' + err);
            Profiling._do('dbfav', 'sql error');
            dbitem.resolve(false);
          });
        }, function (error) { //error callback
          console.log('db.isFavorite() ERROR: ' + error);
          Profiling._do('dbfav', 'tx error');
          dbitem.resolve(false);
        }, function () { //success callback
          //console.log('db.isFavorite() DONE!');
          Profiling._do('dbfav', 'tx success');
        });
      });
      return dbitem.promise;
    },
    setFavorite: function (itemId, val) {
      //console.log('DatiDB.setFavorite(' + itemId + ',' + val + ')');
      var dbitem = $q.defer();
      db.then(function (dbObj) {
        dbObj.transaction(function (tx) {
          Profiling.start('dbfavsave');
          //console.log('type: '+types[dbname]);
          var dbQuery = null;
          if (val) {
            dbQuery = 'INSERT INTO Favorites (id) VALUES (?)';
          } else {
            dbQuery = 'DELETE FROM Favorites WHERE id = ?';
          }
          //console.log('dbQuery: ' + dbQuery);
          tx.executeSql(dbQuery, [itemId], function (tx, results) {
            dbitem.resolve(val);
            Profiling._do('dbfavsave', 'done');
          }, function (tx, err) {
            console.log('error: ' + err);
            Profiling._do('dbfavsave', 'sql error');
            dbitem.resolve(!val);
          });
        }, function (error) { //error callback
          console.log('db.setFavorite() ERROR: ' + error);
          Profiling._do('dbfavsave', 'tx error');
          dbitem.resolve(!val);
        }, function () { //success callback
          //console.log('db.setFavorite() DONE!');
          Profiling._do('dbfavsave', 'tx success');
        });
      });
      return dbitem.promise;
    },
    cleanupCatesOfType: function (cates,type) {
      Profiling.start('filterclean');
      var returned=$q.defer();

      //console.log('type: '+type);
      //console.log('types[type]: '+types[type]);

      db.then(function (dbObj) {
        //Profiling._do('filterclean','dbobj');
        
        dbObj.transaction(function (tx) {
          Profiling._do('filterclean','dbtrans');
          
          var cleaned={};
          var cleanedPromises=[];
          for (key in cates) {
            var d=$q.defer();
            cleaned[key]=d;
            cleanedPromises.push(d.promise);
          }
          //Profiling._do('filterclean','promises');

          for (var key in cates) {
            var cate=cates[key].it;
            //console.log('cates['+key+']: '+cate);
            var dbQuery="select count(*) as totale, '"+key+"' as catekey from ContentObjects where type=? and (classification=? OR classification2=? OR classification3=?)";
            //console.log('dbQuery: '+dbQuery);
            var dbQueryArgs=[ types[type], key, key, key ];
            //console.log('dbQueryArgs: '+dbQueryArgs);
            tx.executeSql(dbQuery,dbQueryArgs,function (tx, results) {
              var resultslen = results.rows.length;
              //console.log('resultslen='+resultslen);
              if (resultslen>0) {
                var item = results.rows.item(0);
                //console.log('cates['+item.catekey+']='+item.catekey);

                //filteredCates.push(cates[item.catekey]);
                //filteredCates[item.catekey]=cates[item.catekey];
                //cleaned[item.catekey].resolve();

                //console.log('cates['+item.catekey+'].count='+item.totale);
                Profiling._do('filterclean', 'done.'+item.catekey);
                if (item.totale>0) {
                  cleaned[item.catekey].resolve(item.catekey);
                } else {
                  cleaned[item.catekey].resolve(null);
                }
              } else {
                //console.log('no results for cates['+key+']: ');
                Profiling._do('filterclean', 'err.'+key);
                cleaned[key].reject();
              }
            }, function (tx, err) {
              console.log('error: ' + err);
              Profiling._do('filterclean', 'sql tx2 error');
              cleaned[key].reject();
            });
          }

          $q.all(cleanedPromises).then(function(cleanedPromisesCates) {
            //console.log('cleanedPromisesCates: '+cleanedPromisesCates);
            Profiling._do('filterclean', 'q.all');

            var filteredCates={};
            for (i in cleanedPromisesCates) {
              var key=cleanedPromisesCates[i];
              if (key!=null) filteredCates[key]=cates[key];
            }
            //console.log('filteredCates keys: '+Object.keys(filteredCates));

            returned.resolve(filteredCates);
          },function(err){
            console.log('$q.all() error: ' + err);
            Profiling._do('filterclean', 'q.all error');
            returned.reject(err);
          });
        }, function (error) { //error callback
          Profiling._do('filterclean', 'tx error');
          console.log('db.cleanupCatesOfType() ERROR: ' + error);
          returned.reject(error);
        }, function () { //success callback
          Profiling._do('filterclean', 'sql tx1 success');
        });
      },function (error) {
        console.log('dbobj ERROR: ' + error);
        returned.reject(error);
      });

      Profiling._do('filterclean','returned');
      return returned.promise;
    }
  }
})
