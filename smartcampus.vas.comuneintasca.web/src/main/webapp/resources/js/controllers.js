var consoleControllers = angular.module('consoleControllers', [])

.controller('MainCtrl', ['$scope', '$rootScope', '$location', 'DataService', 
  function ($scope, $rootScope, $location, DataService) {
    DataService.getProfile().then(function(p){
    	$scope.profile = p;
    });
    
    $scope.publishApp = function() {
    	DataService.publishApp($scope.profile.id).then(function(res){
    		//
    	},
    	function(e) {
    		//
    	});
    };
    $scope.publishType = function(type) {
    	DataService.publishType($scope.profile.id, type).then(function(res){
    		//
    	},
    	function(e) {
    		//
    	});
    };
    
  }]);
  