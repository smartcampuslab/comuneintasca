angular.module('starter.filters', [])

.filter('translate', function($rootScope) {
    lang=$rootScope.lang;
    return function(input) {
//        console.log('translate: lang='+lang);
        if (!input) {
            return '';
        } else {
            if (input[lang] && input[lang]!='') {
                return input[lang];
            } else {
                return input.it || '';
            }
        }
    };
})

.filter('extOrderBy', function($rootScope, $filter, GeoLocate) {
	return function(input, order) {
		if (!angular.isObject(input)) return input;
		var location = $rootScope.location;
		input.sort(function(a, b){
		    if ('A-Z' == order) {
				var a1 = $filter('translate')(a.title);
				var b1 = $filter('translate')(b.title);
				var dif = a1.localeCompare(b1);
				return dif;
			}
		    if ('Z-A' == order) {
				var a1 = $filter('translate')(a.title);
				var b1 = $filter('translate')(b.title);
				var dif = b1.localeCompare(a1);
				return dif;
			}
		    if ('Date' == order) {
				var a1 = a.fromTime ? a.fromTime : a.fromDate;
				var b1 = b.fromTime ? b.fromTime : b.fromDate;
				var dif = b1-a1;
				return dif;
			}
			if ('Distance' == order) {
				var a1 = GeoLocate.distance(a.location, location);
				var b1 = GeoLocate.distance(b.location, location);
				return b1-a1;
			}
			return 0;
		});
		return input;
	}
})