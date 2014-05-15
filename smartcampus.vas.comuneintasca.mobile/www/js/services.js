angular.module('starter.services', [])

.factory('Config', function ($q) {
  var poiTypes = {
    'museums': {
      de: 'Musei',
      it: 'Musei',
      en: 'Museums'
    },
    'buildings': {
      de: 'Historische Gebäude',
      it: 'Edifici storici',
      en: 'Historic Buildings'
    },
    'churches': {
      de: 'Kirchen',
      it: 'Chiese',
      en: 'Churches'
    },
    'acheo': {
      de: 'Archäologische Areas',
      it: 'Aree Archeologiche',
      en: 'Archaeological Areas'
    },
    'parks': {
      de: 'Natur',
      it: 'Natura',
      en: 'Nature'
    },
    'misc': {
      de: 'Andere Seiten von historischem und künstlerischem Interesse',
      it: 'Altri siti di interesse storico artistico',
      en: 'Other sites of historical and artistic interest'
    }
  };
  var eventTypes = {
    'fairs': {
      de: 'Festivals, Märkte und Messen',
      it: 'Feste, mercati e fiere',
      en: 'Festivals, markets and fairs'
    },
    'conferences': {
      de: 'Tagungen, Seminare und Konferenzen',
      it: 'Incontri, convegni e conferenze',
      en: 'Meetings, seminars and conferences'
    },
    'shows': {
      de: 'Shows',
      it: 'Spettacoli',
      en: 'Shows'
    },
    'exhibitions': {
      de: 'Ausstellungen',
      it: 'Mostre',
      en: 'Exhibitions'
    },
    'labs': {
      de: 'Kurse und Workshops',
      it: 'Corsi e laboratori',
      en: 'Courses and workshops'
    },
    'competitions': {
      de: 'Wettbewerbe und Gewinnspiele',
      it: 'Competizioni e gare',
      en: 'Competitions and contests'
    },
    'misc': {
      de: 'Verschiedene Initiativen',
      it: 'Iniziative varie',
      en: 'Various initiatives'
    },
  };

  var hotelTypes = {
    'hotel': {
      de: 'Hotel',
      it: 'Hotel',
      en: 'Hotel'
    },
    'hostel': {
      de: 'Jugendherberge',
      it: 'Ostello',
      en: 'Youth Hostel'
    },
    'agri': {
      de: 'Agritourismusbetrieb',
      it: 'Agritur',
      en: 'Farmhouse Inn'
    },
    'bnb': {
      de: 'Bed and Breakfast',
      it: 'Bed and Breakfast',
      en: 'Bed and Breakfast'
    },
    'camp': {
      de: 'Campingplatz',
      it: 'Campeggio',
      en: 'Camp-site'
    },
    'rooms': {
      de: 'Zimmervermietung',
      it: 'Affittacamere',
      en: 'Landlord'
    },
    'apts': {
      de: 'Ferienwohnungen',
      it: 'Appartamenti per vacanze',
      en: 'Holiday apartments'
    },
  };

  var restaurantTypes = {
    'osteria': {
      de: '',
      it: 'Osteria',
      en: ''
    },
    'pizzeria': {
      de: '',
      it: 'Pizzeria',
      en: ''
    },
    'trattoria': {
      de: 'Gastwirtschaft',
      it: 'Trattoria',
      en: ''
    },
    'typical': {
      de: 'Bed and Breakfast',
      it: 'Osteria tipica',
      en: 'Typical Osteria'
    },
    'restaurant': {
      de: 'Restaurant',
      it: 'Ristorante',
      en: 'Restaurant'
    },
    'pub': {
      de: 'Bierstube',
      it: 'Birreria',
      en: 'Pub'
    },
    'fastfood': {
      de: '',
      it: 'Fast food',
      en: ''
    },
    'bar': {
      de: '',
      it: 'Bar',
      en: ''
    },
    'winebar': {
      de: '',
      it: 'Wine Bar',
      en: ''
    },
    'agritur': {
      de: 'Agritourismusbetrieb',
      it: 'Agritur',
      en: 'Agritur (farmhouse inn)'
    },
    'selfservice': {
      de: '',
      it: 'Self-service',
      en: ''
    },
    'chinese': {
      de: 'Chinesische Spezialitäten',
      it: 'Specialità cinese',
      en: 'Chinese specialities'
    },
    'thai': {
      de: 'Thailändische und chinesische Spezialitäten',
      it: 'Specialità thailandese e cinese',
      en: 'Thai and Chinese specialities'
    },
    'brazil': {
      de: 'Brasilianisches Restaurant',
      it: 'Ristorante brasiliano',
      en: 'Brazilian Restaurant'
    },
    'mexico': {
      de: 'Mexikanische Küche',
      it: 'Cucina messicana',
      en: 'Mexican food'
    },
    'japan': {
      de: 'Japanische Spezialitäten ',
      it: 'Specialità giapponesi',
      en: 'Japanese specialities'
    },
    'japanchina': {
      de: 'Japanische und chinesische Spezialitäten',
      it: 'Specialità giapponese e cinese',
      en: 'Japanese and Chinese specialities'
    },
    'orient': {
      de: 'Orientalische Spezialitäten',
      it: 'Specialità orientali',
      en: 'Oriental specialities'
    }
  };
  var contentTypes = {
    'content': 'eu.trentorise.smartcampus.comuneintasca.model.ContentObject',
    'poi': 'eu.trentorise.smartcampus.comuneintasca.model.POIObject',
    'event': 'eu.trentorise.smartcampus.comuneintasca.model.EventObject',
    'restaurant': 'eu.trentorise.smartcampus.comuneintasca.model.RestaurantObject',
    'hotel': 'eu.trentorise.smartcampus.comuneintasca.model.HotelObject',
    'itinerary': 'eu.trentorise.smartcampus.comuneintasca.model.ItineraryObject',
    'mainevent': 'eu.trentorise.smartcampus.comuneintasca.model.MainEventObject'
  };

  return {
    savedImagesDirName: function () {
      return 'TrentoInTasca';
    },
    schemaVersion: function () {
      return 52;
    },
    syncTimeoutSeconds: function () {
      return 60 * 60; /* 60 times 60 seconds = 1 HOUR */
      return 60 * 60 * 24; /* 60 times 60 seconds = 1 HOUR --> x24 = 1 DAY */
      return 60 * 60 * 24 * 10; /* 60 times 60 seconds = 1 HOUR --> x24 = 1 DAY x10 */
    },
    syncingOverlayTimeoutMillis: function () {
      return 30 * 1000; /* 30 seconds before automatically hiding syncing overlay */
    },
    loadingOverlayTimeoutMillis: function () {
      return 10 * 1000; /* 10 seconds before automatically hiding loading overlay */
    },
    contentTypesList: function () {
      return contentTypes;
    },
    contentKeyFromDbType: function (dbtype) {
      for (var contentType in contentTypes) {
        if (contentTypes.hasOwnProperty(contentType)) {
          if (contentTypes[contentType] == dbtype) return contentType;
        }
      }
      return '';
    },
    poiTypesList: function () {
      return poiTypes;
    },
    poiCateFromType: function (type) {
      return poiTypes[type];
    },
    poiCateFromDbClassification: function (dbclassification) {
      for (var poiType in poiTypes) {
        if (poiTypes.hasOwnProperty(poiType)) {
          if (poiTypes[poiType].it == dbclassification) return poiTypes[poiType];
        }
      }
      return {
        de: 'UNKNOWN',
        it: 'UNKNOWN',
        en: 'UNKNOWN'
      };
    },
    eventTypesList: function () {
      return eventTypes;
    },
    eventCateFromType: function (type) {
      return eventTypes[type];
    },
    eventCateFromDbClassification: function (dbclassification) {
      for (var eventType in eventTypes) {
        if (eventTypes.hasOwnProperty(eventType)) {
          if (eventTypes[eventType].it == dbclassification) return eventTypes[eventType];
        }
      }
      return {
        de: 'UNKNOWN',
        it: 'UNKNOWN',
        en: 'UNKNOWN'
      };
    },
    hotelTypesList: function () {
      return hotelTypes;
    },
    hotelCateFromType: function (type) {
      return hotelTypes[type];
    },
    hotelCateFromDbClassification: function (dbclassification) {
      for (var hotelType in hotelTypes) {
        if (hotelTypes.hasOwnProperty(hotelType)) {
          if (hotelTypes[hotelType].it == dbclassification) return hotelTypes[hotelType];
        }
      }
      return {
        de: 'UNKNOWN',
        it: 'UNKNOWN',
        en: 'UNKNOWN'
      };
    },
    restaurantTypesList: function () {
      return restaurantTypes;
    },
    restaurantCateFromType: function (type) {
      return restaurantTypes[type];
    },
    restaurantCateFromDbClassification: function (dbclassification) {
      for (var restaurantType in restaurantTypes) {
        if (restaurantTypes.hasOwnProperty(restaurantType)) {
          if (restaurantTypes[restaurantType].it == dbclassification) return restaurantTypes[restaurantType];
        }
      }
      return {
        de: 'UNKNOWN',
        it: 'UNKNOWN',
        en: 'UNKNOWN'
      };
    }
  }
})

.factory('GeoLocate', function ($q, $rootScope) {
  return {
    locate: function () {
      var localization = $q.defer();
      if ($rootScope.myPosition) {
        localization.resolve($rootScope.myPosition);
      } else {
        if (ionic.Platform.isWebView()) {
          console.log('cordova localization...');
          document.addEventListener("deviceready", function () {
            console.log('cordova localization inited...');
            navigator.geolocation.watchPosition(function (position) {
              console.log('localizing...');
              r = [position.coords.latitude, position.coords.longitude];
              localization.resolve(r);
            }, function (error) {
              localization.reject();
            }, {
              //maximumAge: 3000,
              //timeout: 5000, 
              enableHighAccuracy: true
            });
          }, false);
        } else {
          console.log('web localization...');
          navigator.geolocation.watchPosition(function (position) {
            r = [position.coords.latitude, position.coords.longitude];
            localization.resolve(r);
          }, function (error) {
            localization.reject();
          }, {
            //maximumAge: 3000, 
            //timeout: 5000, 
            enableHighAccuracy: true
          });
        }

      }
      return localization.promise;
    },
    distance: function (pt1, pt2) {
      var d = false;
      if (pt1 && pt1[0] && pt1[1] && pt2 && pt2[0] && pt2[1]) {
        var lat1 = pt1[0];
        var lon1 = pt1[1];
        var lat2 = pt2[0];
        var lon2 = pt2[1];

        var R = 6371; // km
        //var R = 3958.76; // miles
        var dLat = (lat2 - lat1).toRad();
        var dLon = (lon2 - lon1).toRad();
        var lat1 = lat1.toRad();
        var lat2 = lat2.toRad();
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = R * c;
        console.log('distance: ' + d);
      } else {
        console.log('cannot calculate distance!');
      }
      return d;
    },
    distanceTo: function (gotoPosition) {
      var GL = this;
      return this.locate().then(function (myPosition) {
        //if ($rootScope.myPosition){
        //console.log('$rootScope.myPosition: '+JSON.stringify($rootScope.myPosition));
        console.log('myPosition: ' + JSON.stringify(myPosition));
        console.log('gotoPosition: ' + JSON.stringify(gotoPosition));
        return GL.distance(myPosition, gotoPosition);
        //return this.distance($rootScope.myPosition,gotoPosition);
        //} else {
        //return false;
        //};
      });
    }
  }
})

.factory('DatiDB', function ($q, $http, $rootScope, $ionicLoading, Config, GeoLocate) {
  var SCHEMA_VERSION = Config.schemaVersion();
  var types = Config.contentTypesList();
  var lastSynced = -1;
  var parseDbRow = function (dbrow) {
    var dbtype = Config.contentKeyFromDbType(dbrow.type);
    console.log(dbtype);
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
      item['abslink'] = '#/app/event/' + item.id;

    } else if (dbtype == 'itinerary') {
      item['abslink'] = '#/app/itinerary/' + item.id + '/info';

    } else if (dbtype == 'mainevent') {
      item['abslink'] = '#/app/mainevent/' + item.id;

    }
    console.log('item.location: ' + JSON.stringify(item.location));
    if (item.hasOwnProperty('location') && item.location) {
      console.log('item.location: ' + JSON.stringify(item.location));
      if ($rootScope.myPosition) {
        console.log('$rootScope.myPosition: ' + JSON.stringify($rootScope.myPosition));
        distance = GeoLocate.distance($rootScope.myPosition, item.location);
        console.log('distance: ' + distance);
        item['distance'] = distance;
      } else {
        GeoLocate.distanceTo(item.location).then(function (distance) {
          console.log('distance: ' + distance);
          item['distance'] = distance;
        });
      }
    } else {
      console.log('item.location UNKNOWN');
    }
    return item;
  };
  var currentSchemaVersion = 0;
  if (localStorage.currentSchemaVersion) currentSchemaVersion = localStorage.currentSchemaVersion;
  console.log('currentSchemaVersion: ' + currentSchemaVersion);
  var currentDbVersion = 0;
  if (currentSchemaVersion == SCHEMA_VERSION && localStorage.currentDbVersion) currentDbVersion = localStorage.currentDbVersion;
  console.log('currentDbVersion: ' + currentDbVersion);

  var localSyncOptions = {
    method: 'GET',
    url: 'data/trento.json'
  };
  var remoteSyncOptions = {
    method: 'POST',
    url: 'https://vas-dev.smartcampuslab.it/comuneintasca/sync?since=' + currentDbVersion,
    data: '{"updated":{}}'
  };

  var dbObj;

  var dbopenDeferred = $q.defer();
  if (ionic.Platform.isWebView()) {
    console.log('cordova db...');
    document.addEventListener("deviceready", function () {
      console.log('cordova db inited...');
      dbObj = window.sqlitePlugin.openDatabase({
        name: "Trento",
        bgType: 1
      });
      syncOptions = remoteSyncOptions;
      dbopenDeferred.resolve(dbObj);
    }, false);
  } else {
    console.log('web db...');
    dbObj = window.openDatabase('Trento', '1.0', 'Trento in Tasca', 2 * 1024 * 1024);
    syncOptions = localSyncOptions;
    //syncOptions=remoteSyncOptions;
    dbopenDeferred.resolve(dbObj);
  }
  dbopen = dbopenDeferred.promise;

  var dbDeferred = $q.defer();
  dbopen.then(function (dbObj) {
    if (currentSchemaVersion == 0 || currentSchemaVersion != SCHEMA_VERSION) {
      console.log('initializing database...');
      dbObj.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS ContentObjects');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ContentObjects (id text primary key, version integer, type text, category text, classification text, classification2 text, classification3 text, data text, lat real, lon real, updateTime integer)');
        tx.executeSql('DROP TABLE IF EXISTS Favorites');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Favorites (id text primary key)');
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
      console.log('no need to init database...');
      dbDeferred.resolve(dbObj);
    }
  });
  db = dbDeferred.promise;

  return {
    sync: function () {
      syncronization = $q.defer();
      db.then(function (dbObj) {
        if (ionic.Platform.isWebView() && navigator.connection.type == Connection.NONE) {
          $ionicLoading.hide();
          console.log('no network connection');
          syncronization.resolve(currentDbVersion);
        } else {
          var now_as_epoch = parseInt((new Date).getTime() / 1000);
          if (lastSynced == -1 || now_as_epoch > (lastSynced + Config.syncTimeoutSeconds())) {
            syncing = $ionicLoading.show({
              content: 'syncing...',
              duration: Config.syncingOverlayTimeoutMillis()
            });

            $http.defaults.headers.common.Accept = 'application/json';
            $http.defaults.headers.post = {
              'Content-Type': 'application/json'
            };
            if (currentDbVersion == 0) {
              currentSyncOptions = localSyncOptions;
            } else {
              currentSyncOptions = syncOptions;
            }
            $http(currentSyncOptions).success(function (data, status, headers, config) {
              console.log((now_as_epoch - lastSynced) + ' seconds since last syncronization: checking web service...');
              lastSynced = now_as_epoch;

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

                      angular.forEach(updates, function (item, idx) {
                        tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [item.id]);

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
                            startMrkr = "{objectName=";
                            endMrkr = ", classIdentifier=";
                            classification = category.substring(startMrkr.length, category.indexOf(endMrkr)) || '';
                            if (!classification || classification.toString() == 'false') classification = Config.eventCateFromType('misc').it;
                            console.log('event cate: ' + classification);
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
                          item.category = 'mainevent';
                        }
                        values = [item.id, item.version, contentTypeClassName, item.category, classification, classification2, classification3, JSON.stringify(item), ((item.location && item.location.length == 2) ? item.location[0] : -1), ((item.location && item.location.length == 2) ? item.location[1] : -1), item.updateTime];
                        tx.executeSql('INSERT INTO ContentObjects (id, version, type, category, classification, classification2, classification3, data, lat, lon, updateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', values, function (tx, res) { //success callback
                          console.log('inserted obj with id: ' + item.id);
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
                        console.log('deleting obj with id: ' + item.id);
                        tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [item.id], function (tx, res) { //success callback
                          console.log('deleted obj with id: ' + item.id);
                        }, function (e) { //error callback
                          console.log('unable to deleted obj with id ' + item.id + ': ' + e.message);
                        });
                      });
                    } else {
                      console.log('nothing to delete');
                    }
                  });
                }, function () { //error callback
                  console.log('cannot sync');
                  objsDone.reject(false);
                }, function () { //success callback
                  console.log('synced');
                  objsDone.resolve(true);
                });

                objsDone.promise.then(function () {
                  $ionicLoading.hide();
                  currentDbVersion = nextVersion;
                  localStorage.currentDbVersion = currentDbVersion;
                  syncronization.resolve(currentDbVersion);
                }, function () {
                  $ionicLoading.hide();
                  console.log('cannot initialize (2)');
                  syncronization.reject();
                });
              } else {
                $ionicLoading.hide();
                console.log('local database already up-to-date!');
                syncronization.resolve(currentDbVersion);
              }
            }).error(function (data, status, headers, config) {
              $ionicLoading.hide();
              console.log('cannot check for new data: network unavailable?');
              console.log(status);
              syncronization.resolve(currentDbVersion);
            });
          } else {
            $ionicLoading.hide();
            console.log('avoiding too frequent syncronizations. seconds since last one: ' + (now_as_epoch - lastSynced));
            syncronization.resolve(currentDbVersion);
          }
        }
      });
      return syncronization.promise;
    },
    all: function (dbname) {
      var data = $q.defer();
      this.sync().then(function (dbVersion) {
        console.log('current database version: ' + dbVersion);
        var loading = $ionicLoading.show({
          content: 'loading...',
          showDelay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          //console.log('type: '+types[dbname]);
          tx.executeSql('SELECT id, type, classification, classification2, classification3, data, lat, lon FROM ContentObjects WHERE type=?', [types[dbname]], function (tx, results) {
            var len = results.rows.length,
              i;
            console.log('results.rows.length: ' + len);
            for (i = 0; i < len; i++) {
              var item = results.rows.item(i);
              lista.push(parseDbRow(item));
            }
          }, function (tx, err) {
            $ionicLoading.hide();
            console.log('data error!');
            console.log(err);
            data.reject();
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.all() ERROR: ' + error);
          data.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          console.log('db.all() DONE!');
          data.resolve(lista);
        });
      });
      return data.promise;
    },
    cate: function (dbname, cateId) {
      var data = $q.defer();
      this.sync().then(function (dbVersion) {
        console.log('current database version: ' + dbVersion);
        var loading = $ionicLoading.show({
          content: 'loading...',
          showDelay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          //console.log('type: '+types[dbname]);
          console.log('category: ' + cateId);
          tx.executeSql('SELECT id, type, classification, classification2, classification3, data, lat, lon FROM ContentObjects WHERE type=? AND (classification=? OR classification2=? OR classification3=?)', [types[dbname], cateId, cateId, cateId], function (tx2, cateResults) {
            console.log('cateResults.rows.length: ' + cateResults.rows.length);
            var len = cateResults.rows.length,
              i;
            console.log('results.rows.length: ' + len);
            for (i = 0; i < len; i++) {
              var item = cateResults.rows.item(i);
              lista.push(parseDbRow(item));
            }
          }, function (tx2, err) {
            $ionicLoading.hide();
            console.log('cate data error!');
            console.log(err);
            data.reject(err);
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.cate() ERROR: ' + error);
          data.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          console.log('db.cate() DONE!');
          data.resolve(lista);
        });
      });
      return data.promise;
    },
    get: function (dbname, itemId) {
      console.log('DatiDB.get("' + dbname + '","' + itemId + '")');

      return this.sync().then(function (dbVersion) {
        console.log('[DatiDB.get("' + dbname + '","' + itemId + '")] current database version: ' + dbVersion);
        var loading = $ionicLoading.show({
          content: 'loading...',
          showDelay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var dbitem = $q.defer();
        var lista = [];
        dbObj.transaction(function (tx) {
          //console.log('type: '+types[dbname]);
          if (itemId.indexOf(',') == -1) {
            console.log('itemId: ' + itemId);
            idCond = 'id=?';
          } else {
            console.log('itemsIds: ' + itemId);
            itemsIds = itemId.split(',');
            for (i = 0; i < itemsIds.length; i++) itemsIds[i] = '?';
            idCond = 'id IN (' + itemsIds.join() + ')';
          }
          var qParams = itemId.split(',');
          qParams.unshift(types[dbname]);
          var dbQuery = 'SELECT id, type, classification, classification2, classification3, data, lat, lon FROM ContentObjects WHERE type=? AND ' + idCond;
          console.log('dbQuery: ' + dbQuery);
          tx.executeSql(dbQuery, qParams, function (tx2, results) {
            if (results.rows.length > 0) {
              if (itemId.indexOf(',') == -1) {
                console.log('single db result');
                var item = results.rows.item(0);
                var result = parseDbRow(item);
                dbitem.resolve(result);
              } else {
                var len = results.rows.length,
                  i;
                console.log('results.rows.length: ' + len);
                for (i = 0; i < len; i++) {
                  var item = results.rows.item(i);
                  lista.push(parseDbRow(item));
                }
              }
            } else {
              console.log('not found!');
              dbitem.reject('not found!');
            }
          }, function (tx2, err) {
            $ionicLoading.hide();
            console.log('error: ' + err);
            dbitem.reject(err);
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.get() ERROR: ' + error);
          dbitem.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          console.log('db.get() DONE!');
          dbitem.resolve(lista);
        });
        return dbitem.promise;
      });
    },
    getFavorites: function () {
      console.log('DatiDB.getFavorites()');

      var loading = $ionicLoading.show({
        content: 'loading...',
        showDelay: 1000,
        duration: Config.loadingOverlayTimeoutMillis()
      });

      var dbitem = $q.defer();
      var lista = [];
      dbObj.transaction(function (tx) {
        //console.log('type: '+types[dbname]);
        var dbQuery = 'SELECT co.id, co.type, co.classification, co.classification2, co.classification3, co.data, co.category FROM ContentObjects co, Favorites f WHERE f.id=co.id';
        console.log('dbQuery: ' + dbQuery);
        tx.executeSql(dbQuery, null, function (tx, results) {
          if (results.rows.length > 0) {
            var len = results.rows.length,
              i;
            console.log('results.rows.length: ' + len);
            for (i = 0; i < len; i++) {
              var item = results.rows.item(i);
              lista.push(parseDbRow(item));
            }
          } else {
            console.log('not found!');
            dbitem.reject('not found!');
          }
        }, function (tx, err) {
          console.log('error: ' + err);

          $ionicLoading.hide();
          dbitem.reject(err);
        });
      }, function (error) { //error callback
        console.log('db.get() ERROR: ' + error);
        $ionicLoading.hide();
        dbitem.reject(error);
      }, function () { //success callback
        console.log('db.get() DONE!');
        $ionicLoading.hide();
        dbitem.resolve(lista);
      });
      return dbitem.promise;
    },
    isFavorite: function (itemId) {
      console.log('DatiDB.getFavorites()');

      var dbitem = $q.defer();
      var result = false;

      dbObj.transaction(function (tx) {
        //console.log('type: '+types[dbname]);
        var dbQuery = 'SELECT id FROM Favorites f WHERE f.id=?';
        console.log('dbQuery: ' + dbQuery);
        tx.executeSql(dbQuery, [itemId], function (tx, results) {
          if (results.rows.length > 0) {
            result = true;
          } else {
            console.log('not found!');
          }
        }, function (tx, err) {
          console.log('error: ' + err);
          dbitem.resolve(false);
        });
      }, function (error) { //error callback
        console.log('db.get() ERROR: ' + error);
        dbitem.resolve(false);
      }, function () { //success callback
        console.log('db.get() DONE!');
        dbitem.resolve(result);
      });

      return dbitem.promise;
    },
    setFavorite: function (itemId, val) {
      console.log('DatiDB.setFavorite(' + itemId + ',' + val + ')');

      var dbitem = $q.defer();
      var result = false;

      dbObj.transaction(function (tx) {
        //console.log('type: '+types[dbname]);
        var dbQuery = null;
        if (val) {
          dbQuery = 'INSERT INTO Favorites (id) VALUES (?)';
        } else {
          dbQuery = 'DELETE FROM Favorites WHERE id = ?';
        }
        console.log('dbQuery: ' + dbQuery);
        tx.executeSql(dbQuery, [itemId], function (tx, results) {
          result = val;
        }, function (tx, err) {
          console.log('error: ' + err);
          dbitem.resolve(!val);
        });
      }, function (error) { //error callback
        console.log('db.get() ERROR: ' + error);
        dbitem.resolve(!val);
      }, function () { //success callback
        console.log('db.get() DONE!');
        dbitem.resolve(result);
      });

      return dbitem.promise;
    }
  }
})

.factory('Files', function ($q, $http, Config) {
  IMAGESDIR_NAME = Config.savedImagesDirName();
  console.log('savedImagesDirName: ' + IMAGESDIR_NAME);
  var onErrorFS = function (e) {
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
          console.log('main dirEntry.fullPath: ' + dirEntry.fullPath);
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
    listRoot: function (dirname) {
      return filesystem.then(function (mainDir) {
        /*
        var dirReader = rootDir.createReader();
        dirReader.readEntries(function(entries) {
          for(var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (entry.isDirectory){
              console.log('Directory: ' + entry.toUrl());
            } else if (entry.isFile){
              console.log('File: ' + entry.toUrl());
            }
          }
        }, function(e){
          console.log('fsRoot Exception: '+e);
        });
        */
        var dirReader = mainDir.createReader();
        dirReader.readEntries(function (entries) {
          for (entry in entries) {
            if (entry.isDirectory) {
              console.log('Directory: ' + entry.nativeUrl);
            } else if (entry.isFile) {
              console.log('File: ' + entry.nativeUrl);
            }
          }
        }, function (e) {
          console.log('fsMain Exception: ' + e);
        });
      });
    },
    get: function (fileurl) {
      //console.log('fileurl: '+fileurl);
      var filename = fileurl.substring(fileurl.lastIndexOf('/') + 1);
      //console.log('filename: '+filename);
      var filegot = $q.defer();
      filesystem.then(function (mainDir) {
        if (ionic.Platform.isWebView()) {
          //console.log('rootDir: ' + rootDir.fullPath);
          mainDir.getFile(filename, {}, function (fileEntry) {
            /*
            console.log('file url: ' + fileEntry.toURL());
            console.log('file path: ' + fileEntry.fullPath);
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
            console.log('already downloaded to "' + filesavepath + '"');
            filegot.resolve(filesavepath);
          }, function () {
            if (ionic.Platform.isWebView()) {
              if (navigator.connection.type == Connection.NONE) {
                console.log('no network connection: cannot download missing images!');
                filegot.reject('no network connection');
              } else {
                var filesavepath = rootFS.toURL() + IMAGESDIR_NAME + '/' + filename;
                console.log('not found: downloading to "' + filesavepath + '"');
                var fileTransfer = new FileTransfer();
                fileTransfer.download(fileurl, filesavepath, function (fileEntry) {
                  console.log("download complete: " + filesavepath);
                  filegot.resolve(filesavepath);
                }, function (error) {
                  //console.log("download error source " + error.source);console.log("download error target " + error.target);console.log("donwload error code: " + error.code);
                  filegot.reject(error);
                }, true, { /* headers: { "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA==" } */ });
              }
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
          //this.listRoot();
        } else {
          filegot.resolve(fileurl);
        }
      });
      return filegot.promise;
    }
  };
})

.factory('DatiJSON', function ($http) {
  return {
    all: function (dbname) {
      return $http.get('data/' + dbname + '-it.json').then(function (res) {
        return res.data;
      });
    },
    cate: function (dbname, cateId) {
      return this.all(dbname).then(function (data) {
        r = [];
        for (i = 0; i < data.length; i++) {
          if (data[i].classifications == cateId) {
            r.push(data[i]);
          }
        }
        return r;
      });
    },
    get: function (dbname, itemId) {
      return this.all(dbname).then(function (data) {
        for (i = 0; i < data.length; i++) {
          if (data[i].id == itemId) {
            return data[i];
          }
        }
      });
    }
  };
})

.factory('Sort', function ($ionicPopup, $filter) {
  var keys = {
    'Stars': {
      'it': 'Stelle',
      'en': 'Stars',
      'de': 'Stars'
    },
    'Date': {
      'it': 'Data',
      'en': 'Date',
      'de': 'Date'
    },
    'Distance': {
      'it': 'Distanza',
      'en': 'Distance',
      'de': 'Distance'
    },
    'OrderBy': {
      'it': 'Ordinare per',
      'en': 'Order by',
      'de': 'Order by'
    },
    'A-Z': {
      'it': 'A-Z',
      'en': 'A-Z',
      'de': 'A-Z'
    },
    'Z-A': {
      'it': 'Z-A',
      'en': 'Z-A',
      'de': 'Z-A'
    }
  };

  return {
    openSortPopup: function ($scope, options, presel, callback) {
      var title = $filter('translate')(keys['OrderBy']);

      var template = '<div class="list">';
      for (var i = 0; i < options.length; i++) {
        var s = $filter('translate')(keys[options[i]]);
        template += '<a class="item item-icon-right" ng-click="show.close(\'' + options[i] + '\')">' + s + '<i class="icon ' + (options[i] == presel ? 'ion-ios7-checkmark-outline' : '') + '"></i></a>';
      }
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: template,
        title: title,
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }]
      });
      $scope.show = myPopup;
      myPopup.then(function (res) {
        console.log('sort popup res: ' + res);
        callback(res);
      });
    }
  }
})