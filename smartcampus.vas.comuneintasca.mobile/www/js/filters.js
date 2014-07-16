angular.module('ilcomuneintasca.filters', [])

.filter('translate', function ($rootScope, Config) {
  lang = $rootScope.lang;
  return function (input, debug) {
    if (debug) console.log('translate: lang='+lang);
    if (!input) {
      return '';
    } else {
      if (debug) console.log('input var type: '+typeof input);
      if (typeof input=='string') input=Config.keys()[input] || input;
      if (input[lang] && input[lang] != '') {
        return input[lang];
      } else {
        if (debug) console.log('input it: '+(input.it||'FALSY'));
        if (input.hasOwnProperty('it')) {
          return input.it || '';
        } else {
          return input || '';
        }
      }
    }
  };
})

.filter('translate_plur', function ($filter) {
  return function (input, count) {
    if (typeof input=='string' && typeof count=='number') {
      if (count == 0) {
        return $filter('translate')(input+'_none');
      } else if (count == 1) {
        return $filter('translate')(input+'_single');
      } else {
        return count+' '+$filter('translate')(input+'_plural'); 
      }
    } else {
      return $filter('translate')(input);
    }
  };
})

.filter('extOrderBy', function ($rootScope, $filter, GeoLocate) {
  return function (input, params) {
    if (!input || !params || !params.ordering) return input;

    var order = params.ordering;
    var filter = params.searchText;

    var arr = [];
    if (filter && filter.length > 0) {
      var f = filter.toLowerCase();
      for (var i = 0; i < input.length; i++) {
        if ($filter('translate')(input[i].title).toLowerCase().indexOf(f) >= 0) {
          arr.push(input[i]);
        }
      }
    } else {
      arr = input.slice(0);
    }

    arr.sort(function (a, b) {
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
        var dif = b1 - a1;
        return dif;
      }
      if ('DateFrom' == order) {
        var a1 = a.fromTime ? a.fromTime : a.fromDate;
        var b1 = b.fromTime ? b.fromTime : b.fromDate;
        var dif = a1 - b1;
        return dif;
      }
      if ('DateTo' == order) {
        var a1 = a.toTime ? a.toTime : a.toDate;
        var b1 = b.toTime ? b.toTime : b.toDate;
        var dif = a1 - b1;
        return dif;
      }

      if ('Distance' == order) {
        var a1 = a.distance;
        var b1 = b.distance;
        return a1 - b1;
      }
      if ('Stars' == order) {
        var a1 = a.stars || 0;
        var b1 = b.stars || 0;
        return b1 - a1;
      }
      return 0;
    });

    return arr;
  }
})

.filter("nl2br", function ($filter) {
  return function (data) {
    if (!data) return data;
    return data.replace(/\n\r?/g, '<br />');
  };
})
