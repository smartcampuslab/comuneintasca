angular.module('ilcomuneintasca.services.conf', [])

.factory('Menu', function($q, $http) {
  var fetched = $q.defer();
  $http.get('data/menu.json').success(function(data, status, headers, config){
    //console.log('menu json loaded!');
    for (gi=0; gi<data.menu.length; gi++) {
      var group=data.menu[gi];
      for (ii=0; ii<group.items.length; ii++) {
        var item=group.items[ii];
        if (item.objectIds) {
          if (item.objectIds.length>1) {
            item.path="/app/contents/"+item.objectIds.join(',');
          } else {
            item.path="/app/content/"+item.objectIds[0];
          }
        } else if (item.query && item.query.classification) {
          item.path="/app/"+item.query.type+"/"+item.query.classification;
        } else if (item.query) {
          item.path="/app/"+item.query.type;
        } else {
          item.path="/menu/"+group.id+"/"+ii;
          console.log('unkown menu item: '+item.path);
        }
      }
    }
    fetched.resolve(data.menu);
  }).error(function(data, status, headers, config){
    console.log('error getting menu json!');
    fetched.reject();
  });

  return {
    fetch: function () {
      return fetched.promise;
    },
    group: function (label) {
      return fetched.promise.then(function(menu) {
        for (gi=0; gi<menu.length; gi++) {
          if (menu[gi].id==label) return menu[gi];
        }
        return null;
      });
    }
  }
})

.factory('Config', function () {
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
      'it': 'Chiudi',
      'en': 'Cancel',
      'de': 'Annullieren'
    },
    'All': {
      'it': 'Tutti',
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
    },
    'Details': {
      'it': 'Dettagli',
      'en': 'Details',
      'de': 'Details'
    },
    'Close': {
      'it': 'Chiudi',
      'en': 'Close',
      'de': 'Schließen'
    },
    'loading': {
      'it': 'caricamento in corso...',
      'en': 'loading...',
      'de': 'loading...'
    },
    'syncing': {
      'it': 'aggiornamento in corso...',
      'en': 'syncing...',
      'de': 'syncing...'
    },
    'cleaning': {
      'it': 'pulizia in corso...',
      'en': 'cleaning...',
      'de': 'cleaning...'
    }
  };
  var poiTypes = {
    'museums': {
      de: 'Museen',
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
    }
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
      de: 'Monte Bondone',
      it: 'Monte Bondone',
      en: 'Mount Bondone'
    },
    'Servizi': {
      de: 'Dienstleistungen',
      it: 'Servizi',
      en: 'Services'
    },
    'Contatti': {
      de: 'Kontakten',
      it: 'Contatti',
      en: 'Contacts'
    },
    'In preparazione...': {
      de: 'Kommt bald...',
      it: 'In preparazione...',
      en: 'Coming soon...'
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
    keys: function () {
      return keys;
    },
    doProfiling: function () {
      return false;
    },
    savedImagesDirName: function () {
      return 'TrentoInTasca';
    },
    schemaVersion: function () {
      return 72;
    },
    syncTimeoutSeconds: function () {
      //return 60 * 60; /* 60 times 60 seconds = EVERY HOUR */
      return 60 * 60 * 8; /* 60 times 60 seconds = 1 HOUR --> x8 = THREE TIMES A DAY */
      //return 60 * 60 * 24; /* 60 times 60 seconds = 1 HOUR --> x24 = ONCE A DAY */
      //return 60 * 60 * 24 * 10; /* 60 times 60 seconds = 1 HOUR --> x24 = 1 DAY x10 */
    },
    syncingOverlayTimeoutMillis: function () {
      return 40 * 1000; /* 40 seconds before automatically hiding syncing overlay */
    },
    loadingOverlayTimeoutMillis: function () {
      return 10 * 1000; /* 10 seconds before automatically hiding loading overlay */
    },
    fileDatadirMaxSizeMB: function () {
      return 100;
    },
    fileCleanupTimeoutSeconds: function () {
      return 60 * 60 * 12; /* 60 times 60 seconds = 1 HOUR --> x12 = TWICE A DAY */
    },
    fileCleanupOverlayTimeoutMillis: function () {
      return 20 * 1000; /* 10 seconds before automatically hiding cleaning overlay */
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

.factory('Profiling', function (Config) {
  var startTimes = {};
  return {
    start: function (label) {
      if (Config.doProfiling()) {
        startTimes[label] = (new Date).getTime();
      }
    },

    _do: function (label, details) {
      if (Config.doProfiling()) {
        var startTime = startTimes[label] || -1;
        if (startTime != -1) console.log('PROFILE: ' + label + (details ? '(' + details + ')' : '') + '=' + ((new Date).getTime() - startTime));
      }
    }
  };
})
