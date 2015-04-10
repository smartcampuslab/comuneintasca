angular.module('ilcomuneintasca.services.date', [])

.factory('DateUtility', function ($rootScope, $filter, DatiDB) {
  return {
    getLocaleDateString: function (lang, time) {
      //console.log('getLocaleDateString(); time: '+time);
      var dateString=null;
      if (!!GLBZ) {
        //console.log('getLocaleDateString(); lang: '+lang);
        var pat = 'MMMM, d';
        if (lang != 'en') {
          pat = 'd MMMM';
        }
        var date = new Date(time);
        dateString = GLBZ[lang].formatDate(date, {
          pattern: pat
        });
      } else {
        var locale = 'en-EN';
        if (lang == 'it') {
          locale = 'it-IT';
        } else if (lang == 'de') {
          locale = 'de-DE';
        }
        //console.log(locale);
        var date = new Date(time);
        dateString = date.toLocaleDateString(locale, {
          weekday: undefined, //'long',
          year: undefined, //'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return dateString;
    },
    filterInterval: function(resultsAll, f, t) {
        var filtered = [];
        for (var i = 0; i < resultsAll.length; i++) {
          var ef = resultsAll[i].fromTime;
          var et = resultsAll[i].toTime ? resultsAll[i].toTime : ef;
          if (et >= f && ef <= t) filtered.push(resultsAll[i]);
        }
        return filtered;
    },
    flatgroup: function (scope) {
        var ordered = $filter('extOrderBy')(scope.resultsAll,scope.ordering);
        groups=[
          { label : null, results:ordered }
        ];
        return groups;
    },
    regroup: function (scope,type,from,to,classification) {
      //console.log('scope.filter: '+scope.filter);
      var groups = null;
      if (scope.filter=='today' || to==0) {
        var label=(scope.filter=='today'?scope.getLocaleDateString((new Date()).getTime()):null);
        label=null;
        var ordered = $filter('extOrderBy')(scope.resultsAll,scope.ordering);
        groups=[
          { label:label, results:ordered }
        ];
      } else {
        //console.log('from: '+scope.getLocaleDateString(from));
        //console.log('to: '+scope.getLocaleDateString(to));
        var days=Math.floor((to-from)/(1000*60*60*24))+1;
        //console.log('days: '+days);
        //console.log('type: '+type);
        //console.log('classification: '+classification);
        var cc=0;
        groups=[];
        var map = {};
        for (i=0; i<days; i++) {
          var d = new Date(from);
          d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
          //var d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
          var t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
          var group={ labelHidden:scope.getLocaleDateString(d), results:[] };
          map[scope.getLocaleDateString(d)] = group;
        }  
        var elems = scope.resultsAll;
        for (var i = 0; i < elems.length; i++) {
          var dtf = new Date(elems[i].fromTime >= from ? elems[i].fromTime : from);
          var df = new Date(dtf.getFullYear(), dtf.getMonth(), dtf.getDate());
          var dtt = elems[i].toTime ? new Date(elems[i].toTime <= to ? elems[i].toTime : to) : dtf;
          var dt = new Date(dtt.getFullYear(), dtt.getMonth(), dtt.getDate());
          var curr = df;
          while (curr.getTime() <= dt.getTime() && curr.getTime() < to) {
            var str = scope.getLocaleDateString(curr);
            if (!!map[str]) {
              map[str].results.push(elems[i]);
            } 
            curr.setDate(curr.getDate()+1);
          }
        }
        for (var l in map) {
          var g = map[l];
          if (g.results.length > 0) {
            g.label = g.labelHidden;
            g.results = $filter('extOrderBy')(g.results,scope.ordering);
          }
          groups.push(g);
        }
/*        
        //console.log('group.labelHidden: '+group.labelHidden);
          DatiDB.byTimeInterval(type,d.getTime(),t.getTime(),classification,{ group:group }).then(function(data){
            //console.log('data.length: '+data.length);
            if (data.length>0) {
              var group=data[0].ctx.group;
              group['label']=group.labelHidden;
              //console.log('group.label: '+group.label);
              for (ei=0; ei<data.length; ei++) {
                data[ei].id2=''+(cc++);
                //console.log('data['+ei+'].id2: '+data[ei].id2);
                group.results.push(data[ei]);
              }
              group.results = $filter('extOrderBy')(group.results,scope.ordering);
            }
          });
          groups.push(group);
        }
        //scope.resultsGroups=groups;
*/
      }
      return groups;
    }
  }
})
