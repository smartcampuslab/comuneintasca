angular.module('ilcomuneintasca.filters', [])

.filter('ellipsis', function ($rootScope) {
  return function (input, limit) {
    if (!input) {
      return '';
    } else {
      if (input.length<limit) {
        return input;
      } else if (limit<4) {
        return input.substring(0,limit);
      } else {
        return input.substring(0,limit-3)+'...';
      }
    }
  };
})

.filter('cleanMenuID', function ($filter) {
  return function (input) {
    if (!input) return '';
    if (input.indexOf('csvimport_')==0) {
      return input.replace(/[^_]+_([^_]+)_.*/gi,'$1').toLowerCase().replace(/\s+/gi,'_');
    } else {
      return input;
    }
  }
})

.filter('addrclean', function ($filter) {
  return function (input) {
    addr=$filter('translate')(input);
    if (!addr) {
      return '';
    } else {
      addr=addr.replace(/38\d\d\d/i,'');
      return addr;
    }
  }
})

.filter('translate', function ($rootScope, Config) {
  return function (input, debug) {
    lang = $rootScope.lang;
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
    if (typeof count=='object') {
      var countAll=0;
      for (g in count) {
        //console.log('count[g].results.length: '+ (count[g].results?count[g].results.length:'NULL'));
        if (count[g].results) countAll+=count[g].results.length;
      }
      count=countAll;
    }
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

.filter('extOrderBy', function ($rootScope) {
  return $rootScope.extOrderBySorter;
})

.filter("nl2br", function ($filter) {
  return function (data) {
    if (!data) return data;
    return data.replace(/\n\r?/g, '<br />');
  };
})
