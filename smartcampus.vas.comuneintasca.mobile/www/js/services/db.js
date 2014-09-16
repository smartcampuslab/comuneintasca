angular.module('ilcomuneintasca.services.db', [])

.factory('DatiDB', function ($q, $http, $rootScope, $filter, $timeout, Config, Files, Profiling, GeoLocate, $ionicLoading) {
  var SCHEMA_VERSION = Config.schemaVersion();
  var types = Config.contentTypesList();

  var parseDbRow = function (dbrow) {
    var item = JSON.parse(dbrow.data);
    
    if (item.image && typeof item.image=='string' && item.image.indexOf('http')==-1 && item.image.charAt(item.image.length-1)=='|') item.image='http://trento.opencontent.it/'+item.image.substring(0,item.image.length-1);
    
		if (dbrow.parentid) {
			item['parentid']=dbrow.parentid;
			item['parent']=JSON.parse(dbrow.parent);
		}
		item['sonscount']=dbrow.sonscount;

    item['parsedimageurl']='svg/placeholder.svg';
    if (item.image) {
      var imageUrl=$filter('translate')(item.image);
      if (imageUrl && imageUrl != '' && imageUrl != 'false') {
        Files.get(imageUrl).then(function (fileUrl) {
          item['parsedimageurl']=fileUrl;
        });
      }
    }

    var dbtype = Config.contentKeyFromDbType(dbrow.type);
    item['dbType']=dbtype;

    //console.log('dbtype: '+dbtype);
    //console.log('dbrow.classification: '+dbrow.classification);
    if (dbtype == 'itinerary') {
      item['abslink'] = '#/app/itinerary/' + item.id + '/info';
      Config.menuGroupSubgroup('percorsi','itineraries').then(function(sg){
        item['menu']=sg;
      });
    } else {
      item['abslinkgot']=Config.menuGroupSubgroupByTypeAndClassification(dbtype,dbrow.classification).then(function(sg){
        if (sg) {
          item['abslink'] = '#/app/page/'+sg._parent.id+'/'+sg.id+'/' + item.id;
          //console.log('abslink: '+item['abslink']);
          item['menu'] = sg;
        } else {
          console.log('sg NULL!');
        }
      },function(){
        console.log('sg NOT FOUND!');
      });
    }

    item['dbClassification'] = dbrow.classification || '';
    item['dbClassification2'] = dbrow.classification2 || '';
    item['dbClassification3'] = dbrow.classification3 || '';

    if (dbtype == 'content') {
      //NO-OP

    } else if (dbtype == 'poi') {
      //console.log(JSON.stringify(item.info));
      Config.menuGroupSubgroup('visitare',item.dbClassification).then(function(sg){
        item['dbClass']=sg;
        item.dbClassification=sg.name;
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
      if (item.dbClassification != '') item.dbClassification = Config.restaurantCateFromDbClassification(item.dbClassification);
      if (item.dbClassification2 != '') item.dbClassification2 = Config.restaurantCateFromDbClassification(item.dbClassification2);
      if (item.dbClassification3 != '') item.dbClassification3 = Config.restaurantCateFromDbClassification(item.dbClassification3);

    } else if (dbtype == 'hotel') {
      //NO-OP

    } else if (dbtype == 'itinerary') {
      //NO-OP

    } else if (dbtype == 'mainevent') {
      //NO-OP

    }
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
    if (dbrow.fromTime > 0) item['fromTime'] = dbrow.fromTime;
    if (dbrow.toTime > 0) item['toTime'] = dbrow.toTime;
    return item;
  };

  var currentSchemaVersion = 0;
  if (localStorage.currentSchemaVersion) currentSchemaVersion = Number(localStorage.currentSchemaVersion);
  //console.log('currentSchemaVersion: ' + currentSchemaVersion);

  var currentDbVersion = 0,
    lastSynced = -1;
  if (currentSchemaVersion == SCHEMA_VERSION) {
    if (localStorage.currentDbVersion) currentDbVersion = Number(localStorage.currentDbVersion);
    if (localStorage.lastSynced) lastSynced = Number(localStorage.lastSynced);
  }
  //console.log('currentDbVersion: ' + currentDbVersion);
  //console.log('lastSynced: ' + lastSynced);

  var localSyncOptions = {
    method: 'GET',
    url: 'data/trento.json',
    remote: false
  };

  var remoteSyncURL = Config.syncUrl()+'?since=';
  var remoteSyncOptions = {
    method: 'POST',
    url: remoteSyncURL + currentDbVersion,
    data: '{"updated":{}}',
    remote: true
  };
  //console.log('remoteSyncOptions.url: '+remoteSyncOptions.url);

  var dbObj;

  var dbopenDeferred = $q.defer();
  if (ionic.Platform.isWebView()) {
    //console.log('cordova db...');
    document.addEventListener("deviceready", function () {
      //console.log('cordova db inited...');
      dbObj = window.sqlitePlugin.openDatabase({
        name: "Trento",
        bgType: 0
      });
      dbopenDeferred.resolve(dbObj);
    }, false);
  } else {
    //console.log('web db...');
    dbObj = window.openDatabase('Trento', '1.0', 'Trento - Il Comune in Tasca', 5 * 1024 * 1024);
//    remoteSyncOptions = localSyncOptions;
    dbopenDeferred.resolve(dbObj);
  }
  dbopen = dbopenDeferred.promise;

  var dbDeferred = $q.defer();
  dbopen.then(function (dbObj) {
    if (currentSchemaVersion == 0 || currentSchemaVersion != SCHEMA_VERSION) {
      console.log('initializing database...');
      dbObj.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS ContentObjects');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ContentObjects (id text primary key, objid integer, parentid text, version integer, type text, category text, classification text, classification2 text, classification3 text, data text, lat real, lon real, fromTime integer, toTime integer)');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_id ON ContentObjects( id )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_objid ON ContentObjects( objid )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_parentid ON ContentObjects( parentid )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_idparentid ON ContentObjects( id, parentid )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type ON ContentObjects( type )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_cate ON ContentObjects( category )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_class ON ContentObjects( classification )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_class2 ON ContentObjects( classification, classification2 )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_class3 ON ContentObjects( classification, classification2, classification3 )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_lat ON ContentObjects( lat )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_lon ON ContentObjects( lon )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_typeclass ON ContentObjects( type, classification )');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_typeid ON ContentObjects( type, id )');

        tx.executeSql('DROP TABLE IF EXISTS Favorites');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Favorites (id text primary key)');
        tx.executeSql('CREATE INDEX IF NOT EXISTS fav_id ON Favorites( id )');
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
      dbDeferred.resolve(dbObj);
    }
  });
  db = dbDeferred.promise;

  var syncinprogress = null;

  return {
		reset: function () { 
      if (!ionic.Platform.isWebView() || navigator.connection.type != Connection.NONE) {
        localStorage.cachedProfile=null;
        localStorage.lastSynced=lastSynced=-1;
      } else {
        console.log('cannot reset db: offline!');
      }
      return this.sync().then(function(){
        console.log('DB reset completed.');
      },function(){
        console.log('DB not resetted.');
      });
		},
		fullreset: function () { 
			localStorage.currentDbVersion=currentDbVersion=0;
			return this.reset().then(function(){
        console.log('DB FULL-RESET completed.');
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
              currentSyncOptions.url = remoteSyncURL + currentDbVersion;
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
                }

                angular.forEach(types, function (contentTypeClassName, contentTypeKey) {
                  console.log('[INSERTS] type (' + contentTypeKey + '): ' + contentTypeClassName);

                  if (!angular.isUndefined(data.updated[contentTypeClassName])) {
                    updates = data.updated[contentTypeClassName];

                    if (contentTypeKey == 'config') {
                      //console.log('CONFIG object already parsed');
                      return;
                    }
                    /*
                    if (contentTypeKey == 'home') {
                      localStorage.homeObject = JSON.stringify(updates[0]);
                      return;
                    }
                    */

                    console.log('updates: ' + updates.length);
                    angular.forEach(updates, function (item, idx) {
                      //console.log('item.category: ' + item.category);
											var parentid=null;

                      var fromTime = 0;
                      var toTime = 0;

                      var classification = '', 
                          classification2 = '', 
                          classification3 = '';

                      var classified=$q.defer();
                      if (contentTypeKey == 'event') {

                        if (item.eventForm=='Manifestazione') {
                          console.log(item.title.it);
                          classified.resolve(['_complex','','']);
                        } else {
                          if (item.parentEventId) {
                            var parentEvent=item.parentEventId;
                            if (typeof parentEvent == "string") {
                              parentEvent=JSON.parse(parentEvent);
                            }
                            if (parentEvent.objectRemoteId) {
                              parentid=parentEvent.objectRemoteId;
                            }
                          }
                          //console.log('event parent id: ' + parentid);

                          category = item.category;
                          //console.log('event cate: ' + category);
                          if (category) {
                            classification = category;
                            fromTime = item.fromTime;
                            if (item.toTime > 0) toTime = item.toTime;
                            else toTime = fromTime;

                            Config.menuGroupSubgroupByLocaleName('eventi','it',classification).then(function(sg){
                              if (sg) {
                                //console.log('content db sg classification: '+sg.id);
                                classified.resolve([sg.id,'','']);
                              } else {
                                console.log('content db sg classification is NULL for event cate: '+classification);
                                classified.resolve(['misc','','']);
                              }
                            });
                          } else {
                            console.log('content db category is NULL for item: '+item.id);
                            classified.resolve(['misc','','']);
                          }
                        }
                      } else if (contentTypeKey == 'poi') {
                        //category fix for opencontent data
                        switch (item.classification.it) {
                          //case 'Altri siti di interesse storico artistico':
                          //  item.classification.it='Edifici storici';
                          //  break;
                          case 'Edificio storico':
                            item.classification.it='Edifici storici';
                            break;
                          case 'Chiesa':
                            item.classification.it='Chiese';
                            break;
                          case 'Museo':
                            item.classification.it='Musei';
                            break;
                          case 'Area archeologica':
                          case 'Aree archeologiche':
                            item.classification.it='Aree Archeologiche';
                            break;
                        }
                        Config.menuGroupSubgroupByLocaleName('visitare','it',item.classification.it).then(function(sg){
                          if (sg) {
                            //console.log('content db sg classification: '+sg.id);
                            classified.resolve([sg.id,'','']);
                          } else {
                            console.log('content db sg classification is NULL for place cate: '+item.classification.it);
                            classified.resolve(['unknown','','']);
                          }
                        });
                      } else {
                        if (contentTypeKey == 'content') {
                          if (typeof item.classification === 'object') classification = item.classification.it;
                          else classification = item.classification;

                        } else if (contentTypeKey == 'mainevent') {
                          classification = item.classification.it;
                          item.category = 'mainevent';

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
                        }

                        classified.resolve([classification,classification2,classification3]);
                      }
                      objsReady.push(classified.promise.then(function(clfs){
                        values = [item.id, item.objectId, parentid, item.version, contentTypeClassName, item.category, clfs[0], clfs[1], clfs[2], JSON.stringify(item), ((item.location && item.location.length == 2) ? item.location[0] : -1), ((item.location && item.location.length == 2) ? item.location[1] : -1), fromTime, toTime];
                        itemsToInsert.push(values)
                      }));

                    });

                  } else {
                    console.log('nothing to update');
                  }

                });

                $q.all(objsReady).then(function(){
                  dbObj.transaction(function (tx) {
                    angular.forEach(itemsToInsert, function (rowData, rowIdx) {
                      tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [rowData[0]], function (tx, res) { //success callback
                        tx.executeSql('INSERT INTO ContentObjects (id, objid, parentid, version, type, category, classification, classification2, classification3, data, lat, lon, fromTime, toTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', rowData, function (tx, res) { //success callback
                          //console.log('inserted obj with id: ' + rowData[0]);
                        }, function (e) { //error callback
                          console.log('unable to insert obj with id ' + rowData[0] + ': ' + e.message);
                        });
                      }, function (e) { //error callback
                        console.log('unable to delete obj with id ' + rowData[0] + ': ' + e.message);
                      });
                    });

                    angular.forEach(types, function (contentTypeClassName, contentTypeKey) {
                      console.log('[DELETIONS] type (' + contentTypeKey + '): ' + contentTypeClassName);

                      if (!angular.isUndefined(data.deleted[contentTypeClassName])) {
                        deletions = data.deleted[contentTypeClassName];
                        console.log('deletions: ' + deletions.length);

                        angular.forEach(deletions, function (item, idx) {
                          //console.log('deleting obj with id: ' + item);
                          tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [item], function (tx, res) { //success callback
                            //console.log('deleted obj with id: ' + item);
                          }, function (e) { //error callback
                            console.log('unable to delete obj with id ' + item + ': ' + e.message);
                          });
                        });
                      } else {
                        //console.log('nothing to delete');
                      }
                    });

                    // events cleanup
                    var nowTime = (new Date()).getTime();
                    //console.log('[TODO events cleanup] nowTime=' + new Date(nowTime));
                    var yesterdayTime = nowTime - (24 * 60 * 60 * 1000);
                    console.log('[TODO events cleanup] yesterdayTime=' + new Date(yesterdayTime));
                    tx.executeSql('DELETE FROM ContentObjects WHERE type = ? AND toTime < ?', [ types['event'],yesterdayTime ], function (tx, res) { //success callback
                      //console.log('deleted old events');
                    }, function (e) { //error callback
                      console.log('unable to delete old events: ' + e.message);
                    });

                  }, function () { //error callback
                    console.log('cannot sync');
                    $ionicLoading.hide();
                    Profiling._do('dbsync');
                    syncinprogress=null;
                    syncronization.reject();
                  }, function () { //success callback
                    //console.log('synced');
                    $ionicLoading.hide();
                    currentDbVersion = nextVersion;
                    localStorage.currentDbVersion = currentDbVersion;
                    console.log('synced to version: ' + currentDbVersion);
                    Profiling._do('dbsync');
                    syncinprogress=null;
                    syncronization.resolve(currentDbVersion);
                  });
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
    all: function (dbname) {
      var data = $q.defer();
      this.sync().then(function (dbVersion) {
        Profiling.start('dball');
        var loading = $ionicLoading.show({
          template: $filter('translate')(Config.keys()['loading']),
          delay: 2000, // how many milliseconds to delay before showing the indicator
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          console.log('dbname: '+dbname);
          console.log('type: '+types[dbname]);
					var _complex=undefined;
          //_complex=false;
          var sql = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.data AS parent, count(s.id) as sonscount' +
						' FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid LEFT OUTER JOIN ContentObjects s ON s.parentid=c.id' +
            ' WHERE c.type=? ' +
            (dbname=='event'&&_complex==undefined ? ' AND c.classification=\'_complex\'' : '');
						' GROUP BY c.id' +
            (_complex==undefined ? '' : ' HAVING count(s.id)' + (_complex?'>':'=') + '0');
          console.log('sql: '+sql);
          tx.executeSql(sql, [types[dbname]], function (tx, results) {
            var len = results.rows.length,
              i;
            console.log('results.rows.length='+results.rows.length);
            for (i = 0; i < len; i++) {
              var item = results.rows.item(i);
              lista.push(parseDbRow(item));
            }
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
    cate: function (dbname, cateId) {
      var data = $q.defer();
      this.sync().then(function (dbVersion) {
        Profiling.start('dbcate');
        var loading = $ionicLoading.show({
          template: $filter('translate')(Config.keys()['loading']),
          delay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          //console.log('type: '+types[dbname]);
          //console.log('category: ' + cateId);

					var _complex=undefined;
          /*
					if (cateId && cateId=='_complex') {
						_complex=true;
						cateId=undefined;
          } else {
						_complex=false;
					}
          */
					
          var fromTime = new Date().getTime();
          var sql = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.data AS parent, count(s.id) as sonscount ' +
						'FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid LEFT OUTER JOIN ContentObjects s ON s.parentid=c.id' +
            ' WHERE c.type=? ' +
						(cateId ? ' AND (c.classification=? OR c.classification2=? OR c.classification3=?)' : '') + 
            ' AND (s.id IS NULL OR s.toTime > ' + fromTime + ')' +
						' GROUP BY c.id' + 
            (_complex==undefined ? '' : ' HAVING count(s.id)' + (_complex?'>':'=') + '0' );
          var params = cateId ? [types[dbname], cateId, cateId, cateId] : [types[dbname]];
          tx.executeSql(sql, params, function (tx2, cateResults) {
            var len = cateResults.rows.length,
              i;
            for (i = 0; i < len; i++) {
              var item = cateResults.rows.item(i);
              lista.push(parseDbRow(item));
            }
            data.resolve(lista);
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
          Profiling._do('dbcate');
          data.resolve(lista);
        });
      });
      return data.promise;
    },
    byTimeInterval: function (dbname, fromTime, toTime, cateId, objContext) {
      var data = $q.defer();
      this.sync().then(function (dbVersion) {
        Profiling.start('byTimeInterval');
        var loading = $ionicLoading.show({
          template: $filter('translate')(Config.keys()['loading']),
          delay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          //console.log('type: '+types[dbname]);

					var _complex=undefined;
          /*
					if (cateId && cateId=='_complex') {
						_complex=true;
						cateId=undefined;
          } else {
						_complex=false;
					}
          */

          var sql = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.data AS parent, count(s.id) as sonscount'+
						' FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid LEFT OUTER JOIN ContentObjects s ON s.parentid=c.id' +
            ' WHERE c.type=?' +
            ' AND c.fromTime > 0 AND c.fromTime <' + toTime + ' AND c.toTime > ' + fromTime + 
						(cateId ? ' AND (c.classification=? OR c.classification2=? OR c.classification3=?)' : '') + 
						' GROUP BY c.id' + 
            (_complex==undefined ? '' : ' HAVING count(s.id)' + (_complex?'>':'=') + '0' );
          var params = cateId ? [types[dbname], cateId, cateId, cateId] : [types[dbname]];
          tx.executeSql(sql, params, function (tx2, cateResults) {
            var len = cateResults.rows.length,
              i;
            for (i = 0; i < len; i++) {
              var item = cateResults.rows.item(i);
              var dbItem=parseDbRow(item);
              dbItem.ctx=objContext;
              lista.push(dbItem);
            }
            data.resolve(lista);
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
          Profiling._do('dbcate');
          data.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          Profiling._do('dbcate');
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
          delay: 1000,
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
          qParams.unshift(types[dbname]);

          var fromTime = new Date().getTime();
          var dbQuery = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.data AS parent'+
						' FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid'+
            ' WHERE c.type=? ' +
            ' AND ' + idCond +
            ' GROUP BY c.id';
          //console.log('qParams: ' + qParams);
          //console.log('DatiDB.get("' + dbname + '", "' + parentId + '"); dbQuery launched...');
          tx.executeSql(dbQuery, qParams, function (tx2, results) {
            //console.log('DatiDB.get("' + dbname + '", "' + parentId + '"); dbQuery completed');
            var resultslen = results.rows.length;
						for (var i = 0; i < resultslen; i++) {
							var item = results.rows.item(i);
							lista.push(parseDbRow(item));
						}
						Profiling._do('dbsons', 'list');
						dbsons.resolve(lista);
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
          delay: 1000,
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

          var fromTime = new Date().getTime();
					var dbQuery = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.data AS parent, count(s.id) as sonscount'+
						' FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid LEFT OUTER JOIN ContentObjects s ON s.parentid=c.id'+
            ' WHERE c.type=?' +
            ' AND ' + idCond + 
            ' AND (s.id IS NULL OR s.toTime > ' + fromTime + ')' +
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
          delay: 1000,
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

          var fromTime = new Date().getTime();
					var dbQuery = 'SELECT c.id, c.type, c.classification, c.classification2, c.classification3, c.data, c.lat, c.lon, p.id AS parentid, p.data AS parent, count(s.id) as sonscount'+
						' FROM ContentObjects c LEFT OUTER JOIN ContentObjects p ON p.id=c.parentid LEFT OUTER JOIN ContentObjects s ON s.parentid=c.id'+
            (dbname?' WHERE c.type=?':'') +
            ' AND ' + idCond + 
            ' AND (s.id IS NULL OR s.toTime > ' + fromTime + ')' +
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
    getAny: function (itemIds) {
      //console.log('DatiDB.getAny(""' + itemIds + '")');

      return this.sync().then(function (dbVersion) {
        Profiling.start('dbget');
        var loading = $ionicLoading.show({
          template: $filter('translate')(Config.keys()['loading']),
          delay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var dbitem = $q.defer();
        dbObj.transaction(function (tx) {
          //console.log('DatiDB.getAny(); itemIds: ' + itemIds);
          var conds = [];
          for (var i = 0; i < itemIds.length; i++) conds[i] = '?';
          var idCond = 'id IN (' + conds.join() + ')';
          var qParams = itemIds;
          var dbQuery = 'SELECT id, type, classification, classification2, classification3, data, lat, lon FROM ContentObjects WHERE ' + idCond;
          //console.log('dbQuery: ' + dbQuery);
          //console.log('DatiDB.getAny("' + itemIds + '"); dbQuery launched...');
          tx.executeSql(dbQuery, qParams, function (tx2, results) {
            //console.log('DatiDB.get("' + itemIds + '"); dbQuery completed');
            var resultslen = results.rows.length;
            var res = {};
            var lista = [];
            if (resultslen > 0) {
              for (var i = 0; i < resultslen; i++) {
                var item = results.rows.item(i);
                var row = parseDbRow(item);
                res[row.id] = row;
              }
              for (var i = 0; i < itemIds.length; i++) {
                if (res[itemIds[i]] != null) {
                  lista.push(res[itemIds[i]]);
                }
              }

              lista.push();
              Profiling._do('dbget', 'list');
              dbitem.resolve(lista);
            } else {
              console.log('not found!');
              Profiling._do('dbgetany', 'sql empty');
              dbitem.reject('not found!');
            }
          }, function (tx2, err) {
            $ionicLoading.hide();
            console.log('error: ' + err);
            Profiling._do('dbgetany', 'sql error');
            dbitem.reject(err);
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.getAny() ERROR: ' + error);
          Profiling._do('dbgetany', 'tx error');
          dbitem.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          Profiling._do('dbgetany', 'tx success');
        });

        return dbitem.promise;
      });
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
      var lista = [];
      dbObj.transaction(function (tx) {
        //console.log('type: '+types[dbname]);
        var dbQuery = 'SELECT co.id, co.type, co.classification, co.classification2, co.classification3, co.data, co.category FROM ContentObjects co, Favorites f WHERE f.id=co.id';
        //console.log('dbQuery: ' + dbQuery);
        tx.executeSql(dbQuery, null, function (tx, results) {
          var resultslen = results.rows.length;
          if (resultslen > 0) {
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
      return dbitem.promise;
    },
    isFavorite: function (itemId) {
      //console.log('DatiDB.isFavorite()');

      var dbitem = $q.defer();
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
      return dbitem.promise;
    },
    setFavorite: function (itemId, val) {
      //console.log('DatiDB.setFavorite(' + itemId + ',' + val + ')');

      var dbitem = $q.defer();
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
      return dbitem.promise;
    }
  }
})
