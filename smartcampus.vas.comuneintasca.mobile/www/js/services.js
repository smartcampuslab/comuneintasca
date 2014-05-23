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
    'all': {
      de: 'Alle Veranstaltungen',
      it: 'Tutti gli eventi',
      en: 'All events'
    },
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
  
  var textTypes = {
    'città': {
      de: 'Info',
      it: 'Informazioni',
      en: 'Info'
    },
    'bondone': {
      de: 'Mont Bondone',
      it: 'Monte Bondone',
      en: 'Mount Bondone'
    },
    'Servizi' : {
      de: 'Dienstleistungen',
      it: 'Servizi',
      en: 'Services'
    },
    'Contatti': {
      de: 'Kontakten',
      it: 'Contatti',
      en: 'Contacts'
    }
  }
  
  var contentTypes = {
    'content': 'eu.trentorise.smartcampus.comuneintasca.model.ContentObject',
    'poi': 'eu.trentorise.smartcampus.comuneintasca.model.POIObject',
    'event': 'eu.trentorise.smartcampus.comuneintasca.model.EventObject',
    'restaurant': 'eu.trentorise.smartcampus.comuneintasca.model.RestaurantObject',
    'hotel': 'eu.trentorise.smartcampus.comuneintasca.model.HotelObject',
    'itinerary': 'eu.trentorise.smartcampus.comuneintasca.model.ItineraryObject',
    'mainevent': 'eu.trentorise.smartcampus.comuneintasca.model.MainEventObject',
    'home': 'eu.trentorise.smartcampus.comuneintasca.model.HomeObject'
  };

  var eventFilterTypes = {
    'today': {
      it: 'Oggi',
      en: 'Today',
      de: 'Heute'
    },
    'week': {
      it: 'Prossimi 7 giorni',
      en: 'Next 7 days',
      de: 'Nächsten 7 Tage'
    },
    'month': {
      it: 'Prossimi 30 giorni',
      en: 'Next 30 days',
      de: 'Nächsten 30 Tage'
    }
  };

  return {
    doProfiling: function () {
      return true;
    },
    savedImagesDirName: function () {
      return 'TrentoInTasca';
    },
    schemaVersion: function () {
      return 64;
    },
    syncTimeoutSeconds: function () {
      return 60 * 60; /* 60 times 60 seconds = 1 HOUR */
      //      return 60 * 60 * 24; /* 60 times 60 seconds = 1 HOUR --> x24 = 1 DAY */
      //      return 60 * 60 * 24 * 10; /* 60 times 60 seconds = 1 HOUR --> x24 = 1 DAY x10 */
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
    eventFilterTypeList: function () {
      return eventFilterTypes;
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
    textTypesList: function () {
      return textTypes;
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
  var localization = $q.defer();
  if (ionic.Platform.isWebView()) {
    console.log('geolocalization initing (cordova)...');
    document.addEventListener("deviceready", function () {
      console.log('geolocalization inited (cordova)');
      navigator.geolocation.watchPosition(function (position) {
        r = [position.coords.latitude, position.coords.longitude];
        $rootScope.myPosition = r;
        console.log('geolocated (cordova)');
        localization.resolve(r);
      }, function (error) {
        console.log('cannot geolocate (cordova)');
        localization.reject('cannot geolocate (web)');
      }, {
        maximumAge: (5 * 60 * 1000), //5 mins
        timeout: 10*1000, //10 secs
        enableHighAccuracy: true
      });
    }, false);
  } else {
    console.log('geolocalization inited (web)');
    navigator.geolocation.watchPosition(function (position) {
      r = [position.coords.latitude, position.coords.longitude];
      $rootScope.myPosition = r;
      console.log('geolocated (web)');
      localization.resolve(r);
    }, function (error) {
      console.log('cannot geolocate (web)');
      localization.reject('cannot geolocate (web)');
    }, {
      maximumAge: (5 * 60 * 1000), //5 mins
      timeout: 1000, //1 sec
      enableHighAccuracy: true
    });
  }
  return {
    locate: function () {
      console.log('geolocalizing...');
      return localization.promise.then(function (firstGeoLocation) {
        return $rootScope.myPosition;
      });
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
      } else {
        console.log('cannot calculate distance!');
      }
      return d;
    },
    distanceTo: function (gotoPosition) {
      var GL = this;
      return localization.promise.then(function (myPosition) {
        //console.log('myPosition: ' + JSON.stringify(myPosition));
        //console.log('gotoPosition: ' + JSON.stringify(gotoPosition));
        return GL.distance(myPosition, gotoPosition);
      });
    }
  };
})

.factory('Profiling', function (Config) {
  var startTimes = {};
  return {
    start: function (label) {
      if (Config.doProfiling()) {
        startTimes[label] = (new Date).getTime();
      }
    },

    _do :
    function (label, details) {
      if (Config.doProfiling()) {
        var startTime = startTimes[label] || -1;
        if (startTime != -1) console.log('PROFILE: ' + label + (details ? '(' + details + ')' : '') + '=' + ((new Date).getTime() - startTime));
      }
    }
  };
})

.factory('DatiDB', function ($q, $http, $rootScope, $ionicLoading, Config, GeoLocate, Profiling) {
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
      console.log('item.location UNKNOWN');
    }
    if (dbrow.fromTime > 0) item['fromTime'] = dbrow.fromTime;
    if (dbrow.toTime > 0) item['toTime'] = dbrow.toTime;
    return item;
  };

  var currentSchemaVersion = 0;
  if (localStorage.currentSchemaVersion) currentSchemaVersion = Number(localStorage.currentSchemaVersion);
  console.log('currentSchemaVersion: ' + currentSchemaVersion);

  var currentDbVersion = 0,
    lastSynced = -1;
  if (currentSchemaVersion == SCHEMA_VERSION) {
    if (localStorage.currentDbVersion) currentDbVersion = Number(localStorage.currentDbVersion);
    if (localStorage.lastSynced) lastSynced = Number(localStorage.lastSynced);
  }
  console.log('currentDbVersion: ' + currentDbVersion);
  console.log('lastSynced: ' + lastSynced);

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
        bgType: 0
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
      console.log('no need to init database...');
      dbDeferred.resolve(dbObj);
    }
  });
  db = dbDeferred.promise;

  return {
    sync: function () {
      syncronization = $q.defer();
      db.then(function (dbObj) {
        Profiling.start('dbsync');
        if (ionic.Platform.isWebView() && navigator.connection.type == Connection.NONE) {
          $ionicLoading.hide();
          console.log('no network connection');
          Profiling._do('dbsync');
          syncronization.resolve(currentDbVersion);
        } else {
          var now_as_epoch = parseInt((new Date).getTime() / 1000);
          var to = (lastSynced + Config.syncTimeoutSeconds());
          if (lastSynced == -1 || now_as_epoch > to) {
            console.log((now_as_epoch - lastSynced) + ' seconds since last syncronization: checking web service...');
            lastSynced = now_as_epoch;
            localStorage.lastSynced = lastSynced;

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
                        tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [item.id]);
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
                            console.log('event cate: ' + classification);
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
                        values = [item.id, item.version, contentTypeClassName, item.category, classification, classification2, classification3, JSON.stringify(item), ((item.location && item.location.length == 2) ? item.location[0] : -1), ((item.location && item.location.length == 2) ? item.location[1] : -1), fromTime, toTime];
                        tx.executeSql('INSERT INTO ContentObjects (id, version, type, category, classification, classification2, classification3, data, lat, lon, fromTime, toTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', values, function (tx, res) { //success callback
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
                  // TODO events cleanup
                  var nowTime = (new Date()).getTime();
                  tx.executeSql('DELETE FROM ContentObjects WHERE type = "eu.trentorise.smartcampus.comuneintasca.model.EventObject" AND toTime < ' + nowTime, [], function (tx, res) { //success callback
                    console.log('deleted old events');
                  }, function (e) { //error callback
                    console.log('unable to delete old events: ' + e.message);
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
                  Profiling._do('dbsync');
                  syncronization.resolve(currentDbVersion);
                }, function () {
                  $ionicLoading.hide();
                  console.log('cannot initialize (2)');
                  Profiling._do('dbsync');
                  syncronization.reject();
                });
              } else {
                $ionicLoading.hide();
                console.log('local database already up-to-date!');
                Profiling._do('dbsync');
                syncronization.resolve(currentDbVersion);
              }
            }).error(function (data, status, headers, config) {
              $ionicLoading.hide();
              console.log('cannot check for new data: network unavailable?');
              console.log(status);
              Profiling._do('dbsync');
              syncronization.resolve(currentDbVersion);
            });
          } else {
            $ionicLoading.hide();
            console.log('avoiding too frequent syncronizations. seconds since last one: ' + (now_as_epoch - lastSynced));
            Profiling._do('dbsync');
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
          content: 'loading...',
          showDelay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var lista = []
        dbObj.transaction(function (tx) {
          //console.log('type: '+types[dbname]);
          console.log('category: ' + cateId);

          var sql = 'SELECT id, type, classification, classification2, classification3, data, lat, lon FROM ContentObjects WHERE type=?' + (cateId ? ' AND (classification=? OR classification2=? OR classification3=?)' : '');
          var params = cateId ? [types[dbname], cateId, cateId, cateId] : [types[dbname]];
          tx.executeSql(sql, params, function (tx2, cateResults) {
            console.log('cateResults.rows.length: ' + cateResults.rows.length);
            var len = cateResults.rows.length,
              i;
            console.log('results.rows.length: ' + len);
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
          content: 'loading...',
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
            console.log('cateResults.rows.length: ' + cateResults.rows.length);
            var len = cateResults.rows.length,
              i;
            console.log('results.rows.length: ' + len);
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
      console.log('DatiDB.get("' + dbname + '","' + itemId + '")');

      return this.sync().then(function (dbVersion) {
        Profiling.start('dbget');
        var loading = $ionicLoading.show({
          content: 'loading...',
          showDelay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var dbitem = $q.defer();
        var lista = [];
        dbObj.transaction(function (tx) {
          console.log('DatiDB.get(); itemId: ' + itemId);
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
          console.log('DatiDB.get("' + dbname + '", "' + itemId + '"); dbQuery launched...');
          tx.executeSql(dbQuery, qParams, function (tx2, results) {
            console.log('DatiDB.get("' + dbname + '", "' + itemId + '"); dbQuery completed');
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
      console.log('DatiDB.getAny(""' + itemIds + '")');

      return this.sync().then(function (dbVersion) {
        Profiling.start('dbget');
        var loading = $ionicLoading.show({
          content: 'loading...',
          showDelay: 1000,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var dbitem = $q.defer();
        dbObj.transaction(function (tx) {
          console.log('DatiDB.getAny(); itemIds: ' + itemIds);
          var conds = [];
          for (var i = 0; i < itemIds.length; i++) conds[i] = '?';
          var idCond = 'id IN (' + conds.join() + ')';
          var qParams = itemIds;
          var dbQuery = 'SELECT id, type, classification, classification2, classification3, data, lat, lon FROM ContentObjects WHERE ' + idCond;
          //console.log('dbQuery: ' + dbQuery);
          console.log('DatiDB.getAny("' + itemIds + '"); dbQuery launched...');
          tx.executeSql(dbQuery, qParams, function (tx2, results) {
            console.log('DatiDB.get("' + itemIds + '"); dbQuery completed');
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
      console.log('DatiDB.getFavorites()');

      Profiling.start('dbfavs');
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
            console.log('not found!');
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
      console.log('DatiDB.getFavorites()');

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
            console.log('not found!');
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
        console.log('db.isFavorite() DONE!');
        Profiling._do('dbfav', 'tx success');
      });
      return dbitem.promise;
    },
    setFavorite: function (itemId, val) {
      console.log('DatiDB.setFavorite(' + itemId + ',' + val + ')');

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
        console.log('db.setFavorite() DONE!');
        Profiling._do('dbfavsave', 'tx success');
      });
      return dbitem.promise;
    }
  }
})

.factory('Files', function ($q, $http, Config, $queue, Profiling) {
  var queueFileDownload = function (obj) {
    var fileTransfer = new FileTransfer();
    fileTransfer.download(obj.url, obj.savepath, function (fileEntry) {
      console.log("download complete: " + obj.savepath);
      Profiling._do('fileget', 'saved');
      obj.promise.resolve(obj.savepath);
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
          Profiling.start('fileget');
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
            Profiling._do('fileget', 'already');
            filegot.resolve(filesavepath);
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

.factory('MapHelper', function ($location, $filter, $ionicPopup) {
  var keys = {
    'Details': {
      'it': 'Dettagli',
      'en': 'Details',
      'de': 'Details'
    },
    'Cancel': {
      'it': 'Annulla',
      'en': 'Cancel',
      'de': 'Cancel'
    }
  };

  var map = {
    control: {},
    draggable: 'true',
    center: {
      latitude: 46.07,
      longitude: 11.12
    },
    zoom: 8,
    pan: false
  };

  var markers = {
    models: [],
    coords: 'self',
    icon: 'icon',
    fit: true,
    doCluster: true
  };

  var title = '';

  var categoriesIcons = {
    'dormire': 'home',
    'ristorazione': 'restaurant',
    'cultura': 'civic-building',
    'other': 'location'
  };

  return {
    prepare: function (t, data) {
      showInfoWindow = false;
      markers.models = [];
      title = t;

      angular.forEach(data, function (luogo, idx) {
        if (!!luogo.location) {
          luogo.latitude = luogo.location[0];
          luogo.longitude = luogo.location[1];
          luogo.icon = 'https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=';
          luogo.icon += (!!categoriesIcons[luogo.category] ? categoriesIcons[luogo.category] : categoriesIcons['other']) + '|2975A7';
          markers.models.push(luogo)
        }
      });

      $location.path('/app/mappa');
    },
    start: function ($scope) {
      $scope.activeMarker = null;
      $scope.map = map;
      $scope.markers = markers;

      console.log('[cordova] map started!!!');

      $scope.openMarkerPopup = function ($markerModel) {
        $scope.activeMarker = $markerModel;

        var title = $filter('translate')($markerModel.title);
        var template = '<div>';
        template += title;
        template += '</div>';
        var templateUrl = 'templates/mappa_popup.html';

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          // template: template,
          templateUrl: templateUrl,
          title: $filter('translate')($scope.activeMarker.title),
          subTitle: !!$scope.activeMarker.distance ? $filter('number')($scope.activeMarker.distance, 1) + ' Km' : '',
          scope: $scope,
          buttons: [{
            text: $filter('translate')(keys['Cancel']),
            type: 'button-default',
            onTap: function (e) {
              $scope.activeMarker = null;
            }
            }, {
            text: $filter('translate')(keys['Details']),
            type: 'button-positive',
            onTap: function (e) {
              var itemUrl = $scope.activeMarker.abslink.substring(1);
              $location.path(itemUrl);
            }
        }]
        });
        $scope.show = myPopup;
        myPopup.then(function (res) {
          // console.log('Marker popup: ' + res);
        });
      }

      $scope.title = title;
    }
  };
})

.factory('ListToolbox', function ($q, $ionicPopup, $ionicModal, $filter, MapHelper, $location) {
  var keys = {
    'Stars': {
      'it': 'Stelle',
      'en': 'Stars',
      'de': 'Star'
    },
    'Date': {
      'it': 'Data',
      'en': 'Date',
      'de': 'Datum'
    },
    'DateFrom': {
      'it': 'Data di inizio',
      'en': 'Start date',
      'de': 'Startdatum'
    },
    'DateTo': {
      'it': 'Data di fine',
      'en': 'End date',
      'de': 'Endatum'
    },
    'Distance': {
      'it': 'Distanza',
      'en': 'Distance',
      'de': 'Distanz'
    },
    'OrderBy': {
      'it': 'Ordinare per',
      'en': 'Order by',
      'de': 'Bestellung'
    },
    'Filter': {
      'it': 'Filtra',
      'en': 'Filter',
      'de': 'Filter'
    },
    'Cancel': {
      'it': 'Annulla',
      'en': 'Cancel',
      'de': 'Annullieren'
    },
    'All': {
      'it': 'Tutte',
      'en': 'All',
      'de': 'Alles'
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

  var openSortPopup = function ($scope, options, presel, callback) {
    var title = $filter('translate')(keys['OrderBy']);

    var template = '<div class="list">';
    for (var i = 0; i < options.length; i++) {
      var s = $filter('translate')(keys[options[i]]);
      template += '<a class="item item-icon-right" ng-click="show.close(\'' + options[i] + '\')">' + s + '<i class="icon ' + (options[i] == presel ? 'ion-ios7-checkmark' : 'ion-ios7-circle-outline') + '"></i></a>';
    }
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: template,
      title: title,
      scope: $scope,
      buttons: [{
        text: $filter('translate')(keys['Cancel'])
        }]
    });
    $scope.show = myPopup;
    myPopup.then(function (res) {
      console.log('sort popup res: ' + res);
      callback(res);
    });
  }

  var openFilterPopup = function ($scope, options, presel, callback) {
    var title = $filter('translate')(keys['Filter']);

    var template = '<div class="modal"><ion-header-bar><h1 class="title">' + title + '</h1></ion-header-bar><ion-content><div class="list">';
    var body = '<a class="item item-icon-right" ng-click="closeModal(\'__all\')">' + $filter('translate')(keys['All']) + '<i class="icon ' + (presel == null ? 'ion-ios7-checkmark' : 'ion-ios7-circle-outline') + '"></i></a>';
    for (var key in options) {
      var s = $filter('translate')(options[key]);
      s = '<a class="item item-icon-right" ng-click="closeModal(\'' + key + '\')">' + s + '<i class="icon ' + (key == presel ? 'ion-ios7-checkmark' : 'ion-ios7-circle-outline') + '"></i></a>';
      body += s;
    }
    template += body + '</div></ion-content><ion-footer-bar><div class="tabs" ng-click="closeModal()"><a class="tab-item">' + $filter('translate')(keys['Cancel']) + '</a></div></ion-footer-bar></div>';
    $scope.modal = $ionicModal.fromTemplate(template, {
      scope: $scope,
      animation: 'slide-in-up'
    });
    $scope.modal.show();
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    $scope.closeModal = function (val) {
      $scope.modal.hide();
      if ('__all' == val) callback(null);
      else if (val) callback(val);
    }
    /*
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: template,
        title: title,
        scope: $scope,
        buttons: [{
          text: $filter('translate')(keys['Cancel'])
        }]
      });
      $scope.show = myPopup;
      myPopup.then(function (res) {
        console.log('sort popup res: ' + res);
        callback(res);
      });  
*/
  }

  var state = {
    ordering: null,
    filter: null,
    data: null
  };

  return {
    // expect conf with load, orderingTypes, defaultOrdering, getData, title, filterOptions, defaultFilter, doFilter
    prepare: function ($scope, conf) {
      var d = $q.defer();
      $scope.gotdata = d.promise;
      if ($scope.$navDirection == 'back') {
        d.resolve(state.data);
        conf.load(state.data);
      } else {
        state.ordering = null;
        state.filter = null;
        state.data = null;
        conf.load(null);
      }

      $scope.goToItem = function (path) {
        state.data = conf.getData();
        state.ordering = $scope.ordering;
        state.filter = $scope.filter;
        $location.path(path);
      }

      if (conf.orderingTypes) {
        $scope.hasSort = true;
        $scope.orderingTypes = conf.orderingTypes;
        $scope.ordering = $scope.$navDirection != 'back' ? {
          ordering: conf.defaultOrdering,
          searchText: null
        } : state.ordering;

        $scope.showSortPopup = function () {
          openSortPopup($scope, $scope.orderingTypes, $scope.ordering.ordering, function (res) {
            if (res && $scope.ordering.ordering != res) {
              $scope.ordering.ordering = res;
              state.ordering = $scope.ordering;
            }
          });
        };
      }

      if (conf.hasMap) {
        $scope.hasMap = true;
        $scope.showMap = function () {
          state.data = conf.getData();
          MapHelper.prepare(conf.getTitle(), conf.getData());
        };
      }
      if (conf.doFilter) {
        $scope.hasFilter = true;
        $scope.filterOptions = conf.filterOptions;
        $scope.filter = $scope.$navDirection != 'back' ? conf.defaultFilter : state.filter;
        $scope.showFilterPopup = function () {
          openFilterPopup($scope, $scope.filterOptions, $scope.filter, function (res) {
            $scope.filter = res;
            state.filter = res;
            conf.doFilter(res);
          });
        };
      }
      if (conf.hasSearch) {
        $scope.hasSearch = true;
        $scope.searching = false;
        $scope.showSearch = function () {
          $scope.searching = true;
        };
        $scope.cancelSearch = function () {
          $scope.searching = false;
          $scope.ordering.searchText = null;
        };
      }
    }
  }
})

.factory('DateUtility', function () {
  return {
    getLocaleDateString: function (lang, time) {
      var locale = 'en-EN';
      if (lang == 'it') {
        locale = 'it-IT';
      } else if (lang == 'de') {
        locale = 'de-DE';
      }
      console.log(locale);
      var date = new Date(time);
      var dateString = date.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return dateString;
    }
  }
})
