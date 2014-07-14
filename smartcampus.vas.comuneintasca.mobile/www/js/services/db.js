angular.module('ilcomuneintasca.services.db', [])

.factory('DatiDB', function ($q, $http, $rootScope, $ionicLoading, $filter, Config, GeoLocate, Profiling) {
  var SCHEMA_VERSION = Config.schemaVersion();
  var types = Config.contentTypesList();

  var parseDbRow = function (dbrow) {
    var dbtype = Config.contentKeyFromDbType(dbrow.type);
    var item = JSON.parse(dbrow.data);
    item['dbClassification'] = dbrow.classification || '';
    item['dbClassification2'] = dbrow.classification2 || '';
    item['dbClassification3'] = dbrow.classification3 || '';
    if (dbtype == 'content') {
      item['abslink'] = '#/app/content/' + item.id;

    } else if (dbtype == 'poi') {
      item['abslink'] = '#/app/place/' + item.id;

      item.dbClassification = Config.poiCateFromDbClassification(item.dbClassification);

    } else if (dbtype == 'event') {
      item['abslink'] = '#/app/event/' + item.id;

      item.dbClassification = Config.eventCateFromDbClassification(item.dbClassification);

    } else if (dbtype == 'restaurant') {
      item['abslink'] = '#/app/restaurant/' + item.id;

      if (item.dbClassification != '') item.dbClassification = Config.restaurantCateFromDbClassification(item.dbClassification);
      if (item.dbClassification2 != '') item.dbClassification2 = Config.restaurantCateFromDbClassification(item.dbClassification2);
      if (item.dbClassification3 != '') item.dbClassification3 = Config.restaurantCateFromDbClassification(item.dbClassification3);

    } else if (dbtype == 'hotel') {
      item['abslink'] = '#/app/hotel/' + item.id;

    } else if (dbtype == 'itinerary') {
      item['abslink'] = '#/app/itinerary/' + item.id + '/info';

    } else if (dbtype == 'mainevent') {
      item['abslink'] = '#/app/mainevent/' + item.id;

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
    url: 'data/trento.json'
  };

  var remoteSyncURL = 'https://tn.smartcampuslab.it/comuneintasca/sync?since=';
  var remoteSyncOptions = {
    method: 'POST',
    url: remoteSyncURL + currentDbVersion,
    data: '{"updated":{}}'
  };

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
    remoteSyncOptions = localSyncOptions;
    dbopenDeferred.resolve(dbObj);
  }
  dbopen = dbopenDeferred.promise;

  var dbDeferred = $q.defer();
  dbopen.then(function (dbObj) {
    if (currentSchemaVersion == 0 || currentSchemaVersion != SCHEMA_VERSION) {
      console.log('initializing database...');
      dbObj.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS ContentObjects');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ContentObjects (id text primary key, version integer, type text, category text, classification text, classification2 text, classification3 text, data text, lat real, lon real, fromTime integer, toTime integer)');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_id ON ContentObjects( id )');
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
    sync: function () {
      if (syncinprogress!=null) {
        console.log('sync already in progress...');
        return syncinprogress;
      }
      syncronization = $q.defer();
      syncinprogress=syncronization.promise;
      db.then(function (dbObj) {
        Profiling.start('dbsync');
        if (ionic.Platform.isWebView() && navigator.connection.type == Connection.NONE) {
          $ionicLoading.hide();
          console.log('no network connection');
          Profiling._do('dbsync');
          syncinprogress=null;
          syncronization.resolve(currentDbVersion);
        } else {
          var now_as_epoch = parseInt((new Date).getTime() / 1000);
          var to = (lastSynced + Config.syncTimeoutSeconds());
          console.log('lastSynced='+lastSynced);
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
              content: $filter('translate')(Config.keys()['syncing']),
              duration: Config.syncingOverlayTimeoutMillis()
            });

            $http.defaults.headers.common.Accept = 'application/json';
            $http.defaults.headers.post = {
              'Content-Type': 'application/json'
            };
            if (currentDbVersion == 0) {
              currentSyncOptions = localSyncOptions;
            } else {
              currentSyncOptions = remoteSyncOptions;
              currentSyncOptions.url = remoteSyncURL + currentDbVersion;
            }
            console.log('currentSyncOptions: ' + JSON.stringify(currentSyncOptions));
            $http(currentSyncOptions).success(function (data, status, headers, config) {
              nextVersion = data.version;
              console.log('nextVersion: ' + nextVersion);
              if (nextVersion > currentDbVersion) {
                objsDone = $q.defer();
                objsUpdated = {};
                objsDeleted = {};

                dbObj.transaction(function (tx) {

                  angular.forEach(types, function (contentTypeClassName, contentTypeKey) {
                    console.log('type (' + contentTypeKey + '): ' + contentTypeClassName);

                    if (!angular.isUndefined(data.updated[contentTypeClassName])) {
                      updates = data.updated[contentTypeClassName];
                      console.log('updates: ' + updates.length);

                      if (contentTypeKey == 'home') {
                        localStorage.homeObject = JSON.stringify(updates[0]);
                        return;
                      }

                      angular.forEach(updates, function (item, idx) {
                        tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [item.id], function (tx, res) { //success callback
                          //console.log('deleted obj with id: ' + item.id);
                        }, function (e) { //error callback
                          //console.log('unable to delete obj with id ' + item.id + ': ' + e.message);
                        });

                        var fromTime = 0;
                        var toTime = 0;

                        var classification = '',
                          classification2 = '',
                          classification3 = '';
                        if (contentTypeKey == 'content') {
                          classification = item.classification;
                        } else if (contentTypeKey == 'poi') {
                          classification = item.classification.it;
                        } else if (contentTypeKey == 'event') {
                          category = item.category;
                          if (category) {
                            // "category": "{objectName=Feste, mercati e fiere, classIdentifier=tipo_eventi, datePublished=1395152152, dateModified=1395152182, objectRemoteId=a15d79dc9794d829ed43364863a8225a, objectId=835351, link=http://www.comune.trento.it/api/opendata/v1/content/object/835351}"
                            //startMrkr = "{objectName=";
                            //endMrkr = ", classIdentifier=";
                            classification = category; //category.substring(startMrkr.length, category.indexOf(endMrkr)) || '';
                            if (!classification || classification.toString() == 'false') classification = Config.eventCateFromType('misc').it;
                            //console.log('event cate: ' + classification);
                            fromTime = item.fromTime;
                            if (item.toTime > 0) toTime = item.toTime;
                            else toTime = fromTime;
                          }
                        } else if (contentTypeKey == 'mainevent') {
                          classification = item.classification.it;
                          item.category = 'mainevent';
                        } else if (contentTypeKey == 'hotel') {
                          classification = item.classification.it;
                        } else if (contentTypeKey == 'restaurant') {
                          classifications = item.classification.it.split(';');
                          classification = classifications[0].trim();
                          if (classifications.length > 1) {
                            classification2 = classifications[1].trim();
                            if (classifications.length > 2) {
                              classification3 = classifications[2].trim();
                            }
                          }
                          item.category = 'ristorazione';
                        }

                        values = [
                          item.id,
                          item.version,
                          contentTypeClassName,
                          item.category,
                          classification,
                          classification2,
                          classification3,
                          JSON.stringify(item),
                          ((item.location && item.location.length == 2) ? item.location[0] : -1),
                          ((item.location && item.location.length == 2) ? item.location[1] : -1),
                          fromTime,
                          toTime
                        ];
                        tx.executeSql('INSERT INTO ContentObjects (id, version, type, category, classification, classification2, classification3, data, lat, lon, fromTime, toTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', values, function (tx, res) { //success callback
                          //console.log('inserted obj with id: ' + item.id);
                        }, function (e) { //error callback
                          console.log('unable to insert obj with id ' + item.id + ': ' + e.message);
                        });
                      });
                    } else {
                      console.log('nothing to update');
                    }

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
                  objsDone.reject(false);
                }, function () { //success callback
                  //console.log('synced');
                  objsDone.resolve(true);
                });

                objsDone.promise.then(function () {
                  $ionicLoading.hide();
                  currentDbVersion = nextVersion;
                  localStorage.currentDbVersion = currentDbVersion;
                  console.log('synced to version: ' + currentDbVersion);
                  Profiling._do('dbsync');
                  syncinprogress=null;
                  syncronization.resolve(currentDbVersion);
                }, function () {
                  $ionicLoading.hide();
                  console.log('cannot initialize (2)');
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
              console.log('cannot check for new data: network unavailable?');
              console.log(status);
              Profiling._do('dbsync');
              syncinprogress=null;
              syncronization.resolve(currentDbVersion);
            });
          } else {
            $ionicLoading.hide();
            console.log('avoiding too frequent syncronizations. seconds since last one: ' + (now_as_epoch - lastSynced));
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
          content: $filter('translate')(Config.keys()['loading']),
          showDelay: 2000, // how many milliseconds to delay before showing the indicator
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          //console.log('type: '+types[dbname]);
          tx.executeSql('SELECT id, type, classification, classification2, classification3, data, lat, lon FROM ContentObjects WHERE type=?', [types[dbname]], function (tx, results) {
            var len = results.rows.length,
              i;
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
          content: $filter('translate')(Config.keys()['loading']),
          showDelay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          //console.log('type: '+types[dbname]);
          //console.log('category: ' + cateId);

          var sql = 'SELECT id, type, classification, classification2, classification3, data, lat, lon FROM ContentObjects WHERE type=?' + (cateId ? ' AND (classification=? OR classification2=? OR classification3=?)' : '');
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
    byTimeInterval: function (dbname, fromTime, toTime, cateId) {
      var data = $q.defer();
      this.sync().then(function (dbVersion) {
        Profiling.start('byTimeInterval');
        var loading = $ionicLoading.show({
          content: $filter('translate')(Config.keys()['loading']),
          showDelay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          //console.log('type: '+types[dbname]);

          var sql = 'SELECT id, type, classification, classification2, classification3, data, lat, lon FROM ContentObjects WHERE type=? AND ' +
            'fromTime > 0 AND fromTime <' + toTime + ' AND toTime > ' + fromTime + (cateId ? ' AND (classification=? OR classification2=? OR classification3=?)' : '');
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
            console.log('byTimeInterval data error!');
            console.log(err);
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
    get: function (dbname, itemId) {
      //console.log('DatiDB.get("' + dbname + '","' + itemId + '")');
      return this.sync().then(function (dbVersion) {
        Profiling.start('dbget');
        var loading = $ionicLoading.show({
          content: $filter('translate')(Config.keys()['loading']),
          showDelay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var dbitem = $q.defer();
        var lista = [];
        dbObj.transaction(function (tx) {
          //console.log('DatiDB.get(); itemId: ' + itemId);
          if (itemId.indexOf(',') == -1) {
            idCond = 'id=?';
          } else {
            itemsIds = itemId.split(',');
            for (i = 0; i < itemsIds.length; i++) itemsIds[i] = '?';
            idCond = 'id IN (' + itemsIds.join() + ')';
          }
          var qParams = itemId.split(',');
          qParams.unshift(types[dbname]);
          var dbQuery = 'SELECT id, type, classification, classification2, classification3, data, lat, lon FROM ContentObjects WHERE type=? AND ' + idCond;
          //console.log('dbQuery: ' + dbQuery);
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
          content: $filter('translate')(Config.keys()['loading']),
          showDelay: 1000,
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
        content: $filter('translate')(Config.keys()['loading']),
        showDelay: 1000,
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
