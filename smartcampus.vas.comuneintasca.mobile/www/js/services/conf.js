angular.module('ilcomuneintasca.services.conf', [])

  .factory('Config', function ($q, $http, $window, $filter, $rootScope) {
    var DEVELOPMENT = false;

    // when the following is TRUE, we show special buttons
    // (actually just the db RESET button in settings)
    // even if not in development mode
    $rootScope.DEV = DEVELOPMENT;
    // $rootScope.DEV=true;

    var SYNC_WEBAPP = 'comuneintasca-multi';
    var SCHEMA_VERSION = 113;
    var HOME_HIGHLIGHTS_MAX = 6;
    var SYNC_HOST = "tn";
    if (DEVELOPMENT) SYNC_HOST = "dev";
    var LOCAL_PROFILE = "opencontent";

    // customization parameters
    //  // RICADI
    //  var APP_VERSION='0.1.0';
    //  var APP_BUILD='';
    //  var WEBAPP_MULTI="RicadiInTasca";
    //  var cityName = { 'it':'Ricadi', 'en':'Ricadi', 'de':'Ricadi' };
    //  var imagePath = 'http://www.comune.trento.it/var/comunetn';
    //  var dbName = 'ricadi';
    //  var nvItemMap = {
    //    'ee123e0729fc6394020850129e3e22e0':'conoscere',
    //    '936d735838e60e33ae940de691580991':'visitare',
    //    'cd3b58dfb21537fa0b720d89bf6af0a0':'mangiare_e_dormire',
    //    '5f9cba3a3562635835dae003b95e30fd':'info_utili',
    //    'ad94673caa967e022fd137627094d238':'visitare'
    //  };
    // TRENTO
    var APP_VERSION = '1.0.0';
    var APP_BUILD = '';
    var WEBAPP_MULTI = "TrentoInTasca";
    var cityName = { 'it': 'Trento', 'en': 'Trento', 'de': 'Trento' };
    var imagePath = 'http://www.comune.trento.it/var/comunetn';
    var dbName = 'Trento';
    var nvItemMap = {
      'profile_cit_csvimport_Viaggia_Trento_item_comuneintasca': 'viaggia_trento',
      'profile_cit_csvimport_Visitare_item_comuneintasca': 'visitare',
      'profile_cit_csvimport_Mangiare_e_dormire_item_comuneintasca': 'mangiare_e_dormire',
      'profile_cit_csvimport_Info_utili_item_comuneintasca': 'info_utili',
      'profile_cit_csvimport_Eventi_item_comuneintasca': 'eventi',
      'profile_cit_2cc4db1674d9e8994658eac954355d31': 'conoscere',
      'profile_cit_csvimport_Percorsi_item_comuneintasca': 'percorsi'
    };
    var ITINERARY_CONTAINER_MENU = "profile_cit_csvimport_Percorsi_item_comuneintasca";
    var tmpNavigationItems = [
      {
        "id": "profile_cit_2cc4db1674d9e8994658eac954355d31",
        "name": {
          "it": "CONOSCERE",
          "en": "DISCOVER",
          "de": "KENNEN"
        },
        "description": null,
        "image": null,
        "objectIds": null,
        "items": null,
        "query": null,
        "ref": "profile_cit_2cc4db1674d9e8994658eac954355d31",
        "type": null,
        "app": null
      },
      {
        "id": "profile_cit_csvimport_Visitare_item_comuneintasca",
        "name": {
          "it": "VISITARE",
          "en": "HIGHLIGHTS",
          "de": "WAS ZU  BESICHTIGEN"
        },
        "description": null,
        "image": null,
        "objectIds": null,
        "items": null,
        "query": null,
        "ref": "profile_cit_csvimport_Visitare_item_comuneintasca",
        "type": null,
        "app": null
      },
      {
        "id": "profile_cit_csvimport_Mangiare_e_dormire_item_comuneintasca",
        "name": {
          "it": "MANGIARE <br> E <br> DORMIRE",
          "en": "RESTAURANTS & HOTELS",
          "de": "GASTRONOMIE UND ÜBERNACHTUNG"
        },
        "description": null,
        "image": null,
        "objectIds": null,
        "items": null,
        "query": null,
        "ref": "profile_cit_csvimport_Mangiare_e_dormire_item_comuneintasca",
        "type": null,
        "app": null
      },

      {
        "id": "profile_cit_csvimport_Eventi_item_comuneintasca",
        "name": {
          "it": "EVENTI",
          "en": "EVENTS",
          "de": "VERANSTALTUNGEN"
        },
        "description": null,
        "image": null,
        "objectIds": null,
        "items": null,
        "query": null,
        "ref": "profile_cit_csvimport_Eventi_item_comuneintasca",
        "type": null,
        "app": null
      },
      {
        "id": "profile_cit_csvimport_Percorsi_item_comuneintasca",
        "name": {
          "it": "PERCORSI",
          "en": "TOURISTIC ITINERARIES",
          "de": "TOUREN UND ROUTEN"
        },
        "description": null,
        "image": null,
        "objectIds": null,
        "items": null,
        "query": null,
        "ref": "profile_cit_csvimport_Percorsi_item_comuneintasca",
        "type": null,
        "app": null
      },
      {
        "id": "profile_cit_csvimport_Info_utili_item_comuneintasca",
        "name": {
          "it": "INFO UTILI",
          "en": "USEFUL  INFORMATION",
          "de": "WEITERE INFORMATIONEN"
        },
        "description": null,
        "image": null,
        "objectIds": null,
        "items": null,
        "query": null,
        "ref": "profile_cit_csvimport_Info_utili_item_comuneintasca",
        "type": null,
        "app": null
      }
    ]
    function parseConfig(config) {
      if (config) {
        var colorMap = {};
        if (config.menu) {
          for (mgi = 0; mgi < config.menu.length; mgi++) {
            var group = config.menu[mgi];
            if (group.items) {
              for (ii = 0; ii < group.items.length; ii++) {
                var item = group.items[ii];
                if (item.objectIds) {
                  item.path = "/app/" + (item.view || "page") + "/" + item.type + "/" + item.objectIds.join(',');
                } else if (item.query) {
                  item.path = "/app/" + (item.view || "list") + "/" + item.query.type + (item.query.classification ? "/" + item.query.classification : "");
                } else {
                  item.path = "/menu/" + $filter('cleanMenuID')(group.id) + "/" + ii;
                  console.log('unkown menu item: ' + item.path);
                }
                //console.log('item['+group.id+']['+item.id+'].path="'+item.path+'"');
              }
            } else {
              console.log('CONFIG.group["' + (group.id || group) + '"] has no items!');
            }
            group.colorIndex = mgi;
            colorMap[group.id] = mgi;
          }
        } else {
          console.log('CONFIG.menu is NULL!');
        }
        if (config.menu) {
          var prepareNavItemName = function (txt) {
            if (txt.length <= 10) return txt;
            var center = Math.floor(txt.length / 2);
            for (var i = 0; i < center; i++) {
              if (txt.charAt(center + i) == ' ') {
                return txt.substr(0, center + i) + '<br/>' + txt.substr(center + i + 1, txt.length - 1);
              }
              if (txt.charAt(center - i) == ' ') {
                return txt.substr(0, center - i) + '<br/>' + txt.substr(center - i + 1, txt.length - 1);
              }
            }
            return txt;
          };
          var extraColors = 100;
          for (ngi = 0; ngi < config.navigationItems.length; ngi++) {
            var item = config.navigationItems[ngi];
            if (item.ref in colorMap) {
              item.colorIndex = colorMap[item.ref];
            } else {
              item.colorIndex = extraColors++;
            }
            if (item.name) {
              angular.forEach(item.name, function (txt, loc) {
                if (item.name[loc]) item.name[loc] = prepareNavItemName(txt);//txt.replace(/\s+/g,"<br/>");
              });
            } else {
              console.log('no name for button "' + (item.id || item) + '"');
            }
            if (item.hasOwnProperty("app")) {
              item.extraClasses = "variant";
            } else if (item.hasOwnProperty("ref")) {
              item.path = "/menu/" + item.ref;
            }
          }
        } else {
          console.log('CONFIG.navigationItems is NULL!');
        }
      } else {
        console.log('CONFIG is NULL!');
      }
      return config;
    }

    var keys = {
      'settings_done': {
        it: 'Operazione completata.',
        en: 'Operation completed.',
        de: 'Operation beendet.'
      },
      'settings_failed': {
        it: 'Aggiornamento non riuscito.',
        en: 'Operation failed.',
        de: 'Operation ist fehlgeschlagen.'
      },
      'settings_data_clean': {
        it: 'Elimina file temporanei',
        en: 'Delete temporary files',
        de: 'Temporäre Dateien löschen'
      },
      'settings_data_sync': {
        it: 'Aggiorna dati',
        en: 'Update data',
        de: 'Dateien ändern'
      },
      'settings_data_sync_draft': {
        it: 'Aggiorna dati DRAFT',
        en: 'Update DRAFT data',
        de: 'DRAFT Dateien ändern'
      },
      'settings_data_sync_draft_enabled': {
        it: "Modalità di test abilitata.",
        en: 'Test mode enabled.',
      },
      'settings_data_sync_draft_disabled': {
        it: "Modalità di test disabilitata.",
        en: 'Test mode disabled.',
      },
      'settings_data': {
        it: 'Gestione dati e immagini',
        en: 'Manage data and images',
        de: 'Dateien und Bilder verwalten'
      },
      'settings_language': {
        it: 'Lingua',
        en: 'Language',
        de: 'Sprache'
      },
      'settings_title': {
        it: 'Impostazioni',
        en: 'Settings',
        de: 'Einstellungen'
      },
      'itinerari_title_accessibilita': {
        it: 'Accessibilità',
        en: 'Accessibility',
        de: 'Zugänglichkeit'
      },
      'itinerari_title_info': {
        it: 'Informazioni',
        en: 'Information',
        de: 'Informationen'
      },
      'entry_km': {
        it: 'Km',
        en: 'Km',
        de: 'Km'
      },
      'cancel': {
        it: 'Annulla',
        en: 'Cancel',
        de: 'Annullieren'
      },
      'search': {
        it: 'Cerca',
        en: 'Search',
        de: 'Suche'
      },
      'list_results_none': {
        it: 'Nessun risultato',
        en: 'No results',
        de: 'Keine Ergebnisse'
      },
      'list_results_single': {
        it: '1 risultato',
        en: '1 result ',
        de: '1 Ergebnis'
      },
      'list_results_plural': {
        it: 'risultati',
        en: 'results',
        de: 'Ergebnisse'
      },
      'restaurant_opening': {
        it: 'Orari',
        en: 'Opening',
        de: 'Geschäftszeiten'
      },
      'restaurant_closing': {
        it: 'Giorni di chiusura',
        en: 'Closing days',
        de: 'Ruhetag'
      },
      'restaurant_price': {
        it: 'Prezzo indicativo',
        en: 'Price range',
        de: 'Preise'
      },
      'restaurant_services': {
        it: 'Servizi disponibili',
        en: 'Services',
        de: 'Anlagen'
      },
      'leaf_Hotel': {
        it: 'Hotel',
        en: 'Hotel',
        de: 'Übernachtung'
      },
      'leaf_Restaurant': {
        it: 'Ristorante',
        en: 'Restaurant',
        de: 'Gastronomie'
      },
      'complex_events_none': {
        it: 'Nessun evento',
        en: 'No events',
        de: 'Kein Veranstaltung'
      },
      'complex_events_single': {
        it: '1 evento',
        en: '1 event',
        de: '1 Veranstaltung'
      },
      'complex_events_plural': {
        it: 'eventi',
        en: 'events',
        de: 'Veranstaltungen'
      },
      'complex_events_found_single': {
        it: '1 evento collegato',
        en: '1 related event',
        de: '1 Veranstaltung'
      },
      'complex_events_found_plural': {
        it: 'eventi collegati',
        en: 'related events',
        de: 'Veranstaltungen'
      },
      'leaf_Itinerario': {
        it: 'Itinerario',
        en: 'Itinerary',
        de: 'Itinerary'
      },
      'Stars': {
        it: 'Stelle',
        en: 'Stars',
        de: 'Star'
      },
      'Date': {
        it: 'Data',
        en: 'Date',
        de: 'Datum'
      },
      'DateFrom': {
        it: 'Data di inizio',
        en: 'Start date',
        de: 'Startdatum'
      },
      'DateTo': {
        it: 'Data di fine',
        en: 'End date',
        de: 'Endatum'
      },
      'Distance': {
        it: 'Distanza',
        en: 'Distance',
        de: 'Distanz'
      },
      'OrderBy': {
        it: 'Ordinare per',
        en: 'Order by',
        de: 'Bestellung'
      },
      'Filter': {
        it: 'Filtra',
        en: 'Filter',
        de: 'Filter'
      },
      'Cancel': {
        it: 'Chiudi',
        en: 'Cancel',
        de: 'Annullieren'
      },
      'All': {
        it: 'Tutti',
        en: 'All',
        de: 'Alles'
      },
      'A-Z': {
        it: 'A-Z',
        en: 'A-Z',
        de: 'A-Z'
      },
      'Z-A': {
        it: 'Z-A',
        en: 'Z-A',
        de: 'Z-A'
      },
      'Details': {
        it: 'Dettagli',
        en: 'Details',
        de: 'Details'
      },
      'Close': {
        it: 'Chiudi',
        en: 'Close',
        de: 'Schließen'
      },
      'loading': {
        it: 'Caricamento in corso...',
        en: 'Loading...',
        de: 'Loading...'
      },
      'loading_short': {
        it: 'Carico...',
        en: 'Loading...',
        de: 'Loading...'
      },
      'syncing': {
        it: 'Aggiornamento in corso...',
        en: 'Syncing...',
        de: 'Laufende Aktualisierung...'
      },
      'cleaning': {
        it: 'Pulizia in corso...',
        en: 'Cleaning...',
        de: 'Reinigung im Laufe...'
      },
      'coming_soon': {
        it: 'In preparazione...',
        en: 'Coming soon...',
        de: 'Kommt bald...'
      },
      'app_title': {
        it: cityName.it.toUpperCase() + '<br/>IL COMUNE IN TASCA',
        en: cityName.en.toUpperCase() + '<br/>THE CITY IN YOUR POCKET',
        de: cityName.de.toUpperCase() + '<br/>DIE STADT IN DER TASCHE'
      },
      'sidemenu_Home': {
        it: 'Home',
        en: 'Home',
        de: 'Home'
      },
      'sidemenu_Favourites': {
        it: 'Preferiti',
        en: 'Favorites',
        de: 'Lieblingsseiten'
      },
      'list_no-favorites': {
        it: 'Nessun preferito salvato',
        en: 'No favorites saved, yet',
        de: 'Keine Lieblingsseiten gespeichert'
      },
      'credits_title': {
        it: 'Credits',
        en: 'Credits',
        de: 'Credits'
      },
      'credits_app': {
        it: 'Il Comune in Tasca',
        en: 'The City in your Pocket',
        de: 'Die Stadt in der Tasche'
      },
      'credits_appfamily': {
        it: 'L\'app dei Comuni Trentini',
        en: 'The Trentino Municipalities app',
        de: 'App der Gemeinden im Trentino'
      },
      'credits_project': {
        it: 'Realizzata da:',
        en: 'Developed by:',
        de: 'Entwickelt von:'
      },
      'credits_sponsored': {
        it: 'Con la collaborazione di:',
        en: 'In collaboration with:',
        de: 'In Zusammenarbeit mit der:'
      },
      'credits_sponsored_2': {
        it: 'Ufficio "Cultura e turismo" del Comune di Trento',
        en: 'Culture and Tourism Bureau of the Municipality of Trento',
        de: 'Kultur und Tourismus Bureau der Gemeinde Trento'
      },
      'credits_info': {
        it: 'Per problemi tecnici:',
        en: 'For technical issues:',
        de: 'Für technische probleme:'
      },
      'credits_info_more': {
        it: 'Per informazioni:',
        en: 'Further information:',
        de: 'Informationen:'
      },
      'exitapp_template': {
        it: 'Sei sicuro di voler uscire dall\'app?',
        en: 'Do you really want to exit the app?',
        de: 'Do you really want to exit the app?'
      },
      'exitapp_ok': {
        it: 'OK',
        en: 'OK',
        de: 'OK'
      },
      'credits_licenses_button': {
        it: 'VEDI LICENZE',
        en: 'READ LICENSES',
        de: 'LIZENZEN LESEN'
      },
      'exitapp_title': {
        it: null,
        en: null,
        de: null
      }
    };
    var appicon = ''; //<img class="appicon" src="img/icon.png" />';
    keys.exitapp_title.it = appicon + ' ' + cityName.it + ' - ' + keys.credits_app.it;
    keys.exitapp_title.en = appicon + ' ' + cityName.en + ' - ' + keys.credits_app.en;
    keys.exitapp_title.de = appicon + ' ' + cityName.de + ' - ' + keys.credits_app.de;

    var hotelTypes = {
      'hotel': {
        de: 'Hotel',
        it: 'Hotel',
        en: 'Hotel',
        sinonyms: ['Residence']
      },
      'hostel': {
        de: 'Jugendherberge',
        it: 'Ostello',
        en: 'Youth Hostel'
      },
      'agri': {
        de: 'Agritourismusbetrieb',
        it: 'Agritur',
        en: 'Farmhouse Inn',
        sinonyms: ['Agriturismo']
      },
      'bnb': {
        de: 'Bed and Breakfast',
        it: 'Bed and Breakfast',
        en: 'Bed and Breakfast',
        sinonyms: ['B&B']
      },
      'camp': {
        de: 'Campingplatz',
        it: 'Campeggio',
        en: 'Camp-site',
        sinonyms: ['Camping', 'Villaggio']
      },
      'rooms': {
        de: 'Zimmervermietung',
        it: 'Affittacamere',
        en: 'Landlord'
      },
      'apts': {
        de: 'Ferienwohnungen',
        it: 'Appartamenti per vacanze',
        en: 'Holiday apartments',
        sinonyms: ['Appartamenti']
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
        en: '',
        sinonyms: ['Pizzerie']
      },
      'trattoria': {
        de: 'Gastwirtschaft',
        it: 'Trattoria',
        en: 'Trattoria',
        sinonyms: ['Trattorie']
      },
      'typical': {
        de: 'Bed and Breakfast',
        it: 'Osteria tipica',
        en: 'Typical Osteria'
      },
      'restaurant': {
        de: 'Restaurant',
        it: 'Ristorante',
        en: 'Restaurant',
        sinonyms: ['Ristoranti']
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
      }
    }

    var contentTypes = {
      'content': 'it.smartcommunitylab.comuneintasca.core.model.ContentObject',
      'poi': 'it.smartcommunitylab.comuneintasca.core.model.POIObject',
      'event': 'it.smartcommunitylab.comuneintasca.core.model.EventObject',
      'restaurant': 'it.smartcommunitylab.comuneintasca.core.model.RestaurantObject',
      'hotel': 'it.smartcommunitylab.comuneintasca.core.model.HotelObject',
      'itinerary': 'it.smartcommunitylab.comuneintasca.core.model.ItineraryObject',
      'mainevent': 'it.smartcommunitylab.comuneintasca.core.model.MainEventObject',
      //'home': 'it.smartcommunitylab.comuneintasca.core.model.HomeObject',
      'oldconfig': 'it.smartcommunitylab.comuneintasca.core.model.ConfigObject',
      'config': 'it.smartcommunitylab.comuneintasca.core.model.DynamicConfigObject',
      'servizio_sul_territorio': 'it.smartcommunitylab.comuneintasca.core.model.TerritoryServiceObject'
    };

    function cloneParentGroup(group) {
      /*
      var r=_.map(group,function(value,key,list){
        if (key=='items') {
          return false;
        } else {
          //console.log('key: '+key);
          return _.clone(value);
        }
      });
      */
      var r = {}
      if (group.name) r['name'] = group.name;
      if (group.id) r['id'] = group.id;
      return r;
    }

    return {
      getVersion: function () {
        return 'v ' + APP_VERSION + (APP_BUILD && APP_BUILD != '' ? '<br/>(' + APP_BUILD + ')' : '');
      },
      getLang: function () {
        var browserLanguage = '';
        // works for earlier version of Android (2.3.x)
        var androidLang;
        if ($window.navigator && $window.navigator.userAgent && (androidLang = $window.navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
          browserLanguage = androidLang[1];
        } else {
          // works for iOS, Android 4.x and other devices
          browserLanguage = $window.navigator.userLanguage || $window.navigator.language;
        }
        var lang = browserLanguage.substring(0, 2);
        if (lang != 'it' && lang != 'en' && lang != 'de') lang = 'en';
        return lang;
      },
      getProfile: function () {
        //console.log('getProfile()');
        var profileLoaded = $q.defer();
        //console.log('localStorage.cachedProfile: '+localStorage.cachedProfile);
        if (localStorage.cachedProfile && localStorage.cachedProfile != 'undefined' && localStorage.cachedProfile != 'null') {
          //console.log('using locally cached profile');
          profileLoaded.resolve(parseConfig(JSON.parse(localStorage.cachedProfile)));
        } else {
          //console.log('getting predefined profile');
          $http.get('data/' + LOCAL_PROFILE + '.json').success(function (data, status, headers, config) {
            localStorage.cachedProfile = JSON.stringify(data);
            $rootScope.$emit('profileUpdated');
            profileLoaded.resolve(parseConfig(data));
          }).error(function (data, status, headers, config) {
            console.log('error getting predefined config "data/' + LOCAL_PROFILE + '.json"!');
            profileLoaded.reject();
          });
        }
        return profileLoaded.promise;
      },
      getProfileExtensions: function () {
        return {
          "content": {
            "classifications": {
              "bondone": { "view": "content" },
            }
          },
          "mainevent": {
            "sort": { "options": ["A-Z", "Z-A", "Date"], "default": "Date" }
          },
          "event": {
            "sort": { "options": ["A-Z", "Z-A", "DateFrom", "DateTo"], "default": "DateTo" },
            "filter": {
              "options": {
                "today": {
                  "it": "Oggi",
                  "en": "Today",
                  "de": "Heute"
                },
                "week": {
                  "it": "Prossimi 7 giorni",
                  "en": "Next 7 days",
                  "de": "Nächsten 7 Tage"
                },
                "month": {
                  "it": "Prossimi 30 giorni",
                  "en": "Next 30 days",
                  "de": "Nächsten 30 Tage"
                }
              },
              "default": "week"
            },
            //overrides for specific query classifications
            "classifications": {
              "_none_": { "filter": { "default": "today" } },
              "_parent_": { "filter": { "default": null } },
              "_complex": { "filter": { "default": null } }
            }
          },
          "poi": {
            "sort": { "options": ["A-Z", "Z-A", "Distance"], "default": "Distance" },
            "map": true
          },
          "servizio_sul_territorio": {
            "sort": { "options": ["A-Z", "Z-A", "Distance"], "default": "Distance" },
            "map": true
          },
          "hotel": {
            "sort": { "options": ["A-Z", "Z-A", "Distance", "Stars"], "default": "Distance" },
            "filter": true,
            "map": true
          },
          "restaurant": {
            "sort": { "options": ["A-Z", "Z-A", "Distance"], "default": "Distance" },
            "filter": true,
            "map": true
          }
        }
      },
      highlights: function () {
        return this.getProfile().then(function (data) {
          //console.log(data.highlights[0].image);
          //data.highlights._parent={ id: 'highlights' };
          return data.highlights;
        });
      },
      navigationItems: function () {
        return this.getProfile().then(function (data) {
          return tmpNavigationItems;
        });
      },
      navigationItemsGroup: function (label) {
        return this.navigationItems().then(function (items) {
          for (gi = 0; gi < items.length; gi++) {
            if (items[gi].id == label) return items[gi];
          }
          return null;
        });
      },
      menu: function () {
        return this.getProfile().then(function (data) {
          return data.menu;
        });
      },
      itineraryMenuGroupID: function () {
        return ITINERARY_CONTAINER_MENU;
      },
      menuGroup: function (label) {
        return this.menu().then(function (menu) {
          for (gi = 0; gi < menu.length; gi++) {
            if (menu[gi].id == label || $filter('cleanMenuID')(menu[gi].id) == label) return menu[gi];
          }
          return null;
        });
      },
      menuGroupSubgroup: function (label1, label2) {
        if (label1 == 'highlights') return this.highlights();
        return this.menuGroup(label1).then(function (group) {
          if (group) {
            for (sgi = 0; sgi < group.items.length; sgi++) {
              if (group.items[sgi].id == label2 || $filter('cleanMenuID')(group.items[sgi].id) == label2) {
                group.items[sgi]._parent = cloneParentGroup(group);
                return group.items[sgi];
              }
            }
          }
          return null;
        });
      },
      menuGroupSubgroupByLocaleName: function (label1, lcl, label2) {
        return this.menuGroup(label1).then(function (group) {
          if (group) {
            for (sgi = 0; sgi < group.items.length; sgi++) {
              if (group.items[sgi].name[lcl] == label2) {
                group.items[sgi]._parent = cloneParentGroup(group);
                return group.items[sgi];
              }
            }
          }
          return null;
        });
      },
      menuGroupSubgroupByTypeAndClassification: function (type, classification) {
        return this.menu().then(function (menu) {
          for (gi = 0; gi < menu.length; gi++) {
            var group = menu[gi];
            if (group.items) {
              for (sgi = 0; sgi < group.items.length; sgi++) {
                var sg = group.items[sgi];
                if (sg.query && sg.query.type == type && ((!classification && !sg.query.classification) ||
                  (classification && sg.query.classification && classification == sg.query.classification.toLowerCase()))) {
                  sg._parent = cloneParentGroup(group);
                  return sg;
                } else if (sg.type && sg.type == type && classification == null) {
                  sg._parent = cloneParentGroup(group);
                  return sg;
                }
              }
              //} else if (group.objectIds) {
            } else {
              throw "no items for group: " + group.id;
            }
          }
          return null;
        });
      },
      keys: function () {
        return keys;
      },
      savedImagesDirName: function () {
        return 'IlComuneInTasca-ImagesCache';
      },
      schemaVersion: function () {
        return SCHEMA_VERSION;
      },
      getHomeHighlightsMax: function () {
        return HOME_HIGHLIGHTS_MAX;
      },
      syncUrl: function () {
        //console.log('$rootScope.TEST_CONNECTION: '+(!!$rootScope.TEST_CONNECTION));
        var SYNC_MODE = (!!$rootScope.TEST_CONNECTION ? 'syncdraft' : 'sync');
        //console.log('SYNC_MODE: '+SYNC_MODE);
        return 'https://' + SYNC_HOST + '.smartcommunitylab.it/' + SYNC_WEBAPP + '/' + SYNC_MODE + '/' + WEBAPP_MULTI + '?since=';
      },
      syncTimeoutSeconds: function () {
        //return 60 * 60; /* 60 times 60 seconds = EVERY HOUR */
        return 60 * 60 * 8; /* 60 times 60 seconds = 1 HOUR --> x8 = THREE TIMES A DAY */
        //return 60 * 60 * 24; /* 60 times 60 seconds = 1 HOUR --> x24 = ONCE A DAY */
        //return 60 * 60 * 24 * 10; /* 60 times 60 seconds = 1 HOUR --> x24 = 1 DAY x10 */
      },
      syncingOverlayTimeoutMillis: function () {
        return 50 * 1000; /* seconds before automatically hiding syncing overlay */
      },
      loadingOverlayTimeoutMillis: function () {
        return 20 * 1000; /* seconds before automatically hiding loading overlay */
      },
      fileDatadirMaxSizeMB: function () {
        return 100;
      },
      fileCleanupTimeoutSeconds: function () {
        return 60 * 60 * 12; /* 60 times 60 seconds = 1 HOUR --> x12 = TWICE A DAY */
      },
      fileCleanupOverlayTimeoutMillis: function () {
        return 20 * 1000; /* seconds before automatically hiding cleaning overlay */
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
      textTypesList: function () {
        return textTypes;
      },
      hotelTypesList: function () {
        return hotelTypes;
      },
      hotelCateFromType: function (type) {
        return hotelTypes[type];
      },

      restaurantTypesList: function () {
        return restaurantTypes;
      },
      restaurantCateFromType: function (type) {
        return restaurantTypes[type];
      },

      hotelTypeFromCate: function (cate) {
        for (var hotelType in hotelTypes) {
          if (hotelTypes.hasOwnProperty(hotelType)) {
            if (hotelTypes[hotelType].it == cate) return hotelType;
            if (!!hotelTypes[hotelType].sinonyms) {
              for (var i = 0; i < hotelTypes[hotelType].sinonyms.length; i++) {
                if (hotelTypes[hotelType].sinonyms[i] == cate) return hotelType;
              }
            }
          }
        }
        console.log('unknown hotel cate: "' + cate + '"');
        return null;
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
      restaurantTypeFromCate: function (cate) {
        for (var restaurantType in restaurantTypes) {
          if (restaurantTypes.hasOwnProperty(restaurantType)) {
            if (restaurantTypes[restaurantType].it == cate) return restaurantType;
            if (!!restaurantTypes[restaurantType].sinonyms) {
              for (var i = 0; i < restaurantTypes[restaurantType].sinonyms.length; i++) {
                if (restaurantTypes[restaurantType].sinonyms[i] == cate) return restaurantType;
              }
            }
          }
        }
        console.log('unknown restaurant cate: "' + cate + '"');
        return null;
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
      },

      cityName: function () {
        return cityName;
      },
      imagePath: function () {
        return imagePath;
      },
      dbName: function () {
        return dbName;
      },
      doProfiling: function () {
        return false;
      },
      navItemMap: function () {
        return nvItemMap ? nvItemMap : {};
      }
    }
  })

  .factory('Profiling', function (Config) {
    var reallyDoProfiling = Config.doProfiling();
    var startTimes = {};
    return {
      start2: function (label) {
        startTimes[label] = (new Date).getTime();
      },
      start: function (label) {
        if (reallyDoProfiling) this.start2(label);
      },

      _do2: function (label, details, info) {
        var startTime = startTimes[label] || -1;
        if (startTime != -1) {
          var nowTime = (new Date).getTime();
          console.log('PROFILING: ' + label + (details ? '(' + details + ')' : '') + '=' + (nowTime - startTime));
          //if (details) startTimes[label]=nowTime;
          if (!!info) console.log(info);
        }
      },
      _do: function (label, details, info) {
        if (reallyDoProfiling) this._do2(label, details);
      }
    };
  })
