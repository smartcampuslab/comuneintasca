angular.module('ilcomuneintasca.services.date', [])

.factory('DateUtility', function ($rootScope, DatiDB) {
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
        dateString = GLBZ[lang].formatDate(time, {
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
    regroup: function (scope,type,from,to,classification) {
      //console.log('scope.filter: '+scope.filter);
      if (scope.filter=='today' || to==0) {
        var label=(scope.filter=='today'?scope.getLocaleDateString((new Date()).getTime()):null);
        label=null;
        scope.resultsGroups=[
          { label:label, results:scope.results }
        ];
      } else {
        //console.log('from: '+scope.getLocaleDateString(from));
        //console.log('to: '+scope.getLocaleDateString(to));
        var days=Math.floor((to-from)/(1000*60*60*24))+1;
        //console.log('days: '+days);
        //console.log('type: '+type);
        //console.log('classification: '+classification);
        var cc=0;
        var groups=[];
        for (i=0; i<days; i++) {
          var d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
          var t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
          var group={ labelHidden:scope.getLocaleDateString(d), results:[] };
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
            }
          });
          groups.push(group);
        }
        scope.resultsGroups=groups;
      }
      return;
    }
  }
})
