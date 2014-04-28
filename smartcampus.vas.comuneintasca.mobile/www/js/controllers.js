angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, DatiDB) {
//    DatiDB.sync();
})
.controller('HomeCtrl', function($scope) {
})

.controller('DormireCtrl', function($scope, DatiJSON) { DatiJSON.all('dormire').then(function(data){ $scope.dormire=data; }); })
.controller('DormoCtrl', function($scope, DatiJSON, $stateParams) { DatiJSON.get('dormire',$stateParams.dormoId).then(function(data){ $scope.dormo = data; }); })
.controller('MangiareCtrl', function($scope, DatiJSON) { DatiJSON.all('mangiare').then(function(data){ $scope.mangiare=data; }); })
.controller('MangioCtrl', function($scope, DatiJSON, $stateParams) { DatiJSON.get('mangiare',$stateParams.mangioId).then(function(data){ $scope.mangio = data; }); })

.controller('EventiCtrl', function($scope, DatiDB) { DatiDB.all('event').then(function(data){ $scope.events=data; }); })
.controller('EventoCtrl', function($scope, DatiDB, $stateParams) { DatiDB.get('event',$stateParams.eventoId).then(function(data){ $scope.event = data; }); })

.controller('LuoghiCtrl', function($scope, DatiDB) { DatiDB.all('poi').then(function(data){ $scope.luoghi=data; }); })
.controller('LuogoCtrl', function($scope, DatiDB, GeoLocate, $stateParams) {
    DatiDB.get('poi',$stateParams.luogoId).then(function(data){
        $scope.luogo = data;
        if (data.location) {
            GeoLocate.locate().then(function(latlon){
                console.log(latlon);
                $scope.distanza = GeoLocate.distance(latlon,data.location);
            });
        } else {
            console.log('no known location for place');
        }
    });
})

.controller('InfoCtrl', function($scope, DatiDB) {
    DatiDB.get('content','text.3001').then(function(data){ $scope.info = data; });
    DatiDB.get('content','text.3004').then(function(data){ $scope.dati = data; });
})
.controller('StoriaCtrl', function($scope, DatiDB) {
    DatiDB.get('content','text.3002').then(function(data){ $scope.storia = data; });
    DatiDB.get('content','text.3003').then(function(data){ $scope.concilio = data; });
})
.controller('BondoneCtrl', function($scope, DatiDB) { DatiDB.cate('content','bondone').then(function(data){ $scope.schede=data; }); })
.controller('ServiziCtrl', function($scope, DatiDB) { DatiDB.cate('content','Servizi').then(function(data){ $scope.servizi=data; }); })
.controller('ServizioCtrl', function($scope, DatiDB, $stateParams) { DatiDB.get('content',$stateParams.servizioId).then(function(data){ $scope.servizio = data; }); })

.controller('MappaCtrl', function($scope, DatiDB) {
    var map = new mxn.Mapstraction('map1', 'openlayers');
    var latlon = new mxn.LatLonPoint(46.066667,11.116667);
    map.setCenterAndZoom(latlon, 13);
    DatiDB.all('poi').then(function(data){
        angular.forEach(data,function(luogo,idx){
            if (luogo.location) {
                m=new mxn.Marker(new mxn.LatLonPoint(luogo.location[0],luogo.location[1]));
                m.setIcon('img/mapmarker.png',[25,40],[25/2,40/2]);
                m.setInfoBubble(luogo.title.it);
                map.addMarker(m);
            }
        });
    });
})
.controller('ItinerariCtrl', function($scope) {
    var map = new mxn.Mapstraction('map2', 'openlayers');
    var latlon = new mxn.LatLonPoint(46.066667,11.116667);
    map.setCenterAndZoom(latlon, 10);
    m=new mxn.Marker(new mxn.LatLonPoint(46.07048,11.15055));
    m.setIcon('img/mapmarker.png',[25,40],[25/2,40/2]);
    map.addMarker(m);
})
