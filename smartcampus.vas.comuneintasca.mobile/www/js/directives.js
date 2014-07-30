angular.module('ilcomuneintasca.directives', [])

.directive('langRadio', function ($q, $filter, $timeout, Config, Files) {
  return {
    restrict: 'A',
    replace: false,
    link: function (scope, element, attrs) {
      if (scope.lang==element.attr('rel')) element.attr('checked', 'checked');
    }
  }
})

.directive('comuniImg', function ($q, $filter, $timeout, Config, Files) {
  var emptyImageUrl = 'img/placeholder-512x512.gif';
  return {
    restrict: 'E',
    replace: true, //scope:{ image:'=image',gotdata:'=gotdata' },
    template: function (tElem, tAttrs) {
      return '<div class="img-loading"><span class="loadingmsg">'+$filter('translate')(Config.keys()['loading_short'])+'</span></div>';
    },
    link: function (scope, element, attrs) {
      // added since scope can be not yet filled with actual data,
      // since data is taken asyncronously from the database
      scope.gotdata.then(function () {
        content = scope.obj || scope.content || scope.place || scope.hotel || scope.restaurant || scope.event || scope.itinerario || {
          image: ''
        };
        if (content.image && content.image != '' && content.image != 'false') {
          Files.get(content.image).then(function (fileUrl) {
						element.children()[0].remove();
            //$timeout(function () {
              //if (element.hasClass('item-image')) {
              element.css({
                'background-image':'url(' + fileUrl + ')'
              });
              //element.attr('style', 'background-image:url(' + fileUrl + ')');
              //} else {
              //  element.html('<img src="'+fileUrl+'" />');
              //}
            //});
						console.log('HTML: '+element.html());
          }, function () {
            element.addClass('unavailable');
          });
        } else {
          element.addClass('missing');
					element.children()[0].remove();
        }
      }, function () {
        element.addClass('error');
				element.children()[0].remove();
      });
			console.log('attrs.sonscount='+attrs.sonscount);
			if (attrs.sonscount && attrs.sonscount>0) {
				element.append('<div class="dida">'+attrs.sonscount+' '+$filter('translate')(Config.keys()['complex_events'])+'</div>');
			}
    }
  };
})

.directive('compile', function($compile) {
      // directive factory creates a link function
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
             // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
          },
          function(value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);

            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);
          }
        );
      };
    })
  
.directive('a', [function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs, ctrl) {
            element.on('click', function (event) {
			  // process only non-angular links / links starting with hash	
			  if (element[0].href && !element[0].attributes['ng-href'] && element[0].attributes['href'].value.indexOf('#') != 0) {
				event.preventDefault();

                var url = element[0].attributes['href'].value.replace(/“/gi,'').replace(/”/gi,'').replace(/"/gi,'').replace(/‘/gi,'').replace(/’/gi,'').replace(/'/gi,'');
				console.log('url: <'+url+'>');
                //var protocol = element[0].protocol;
				//console.log('protocol: '+protocol);
				//if (protocol && url.indexOf(protocol) == 0) {

                // do not open broken/relative links
                if (url.indexOf('http://')==00 || url.indexOf('https://')==0 || url.indexOf('mailto:')==0 || url.indexOf('tel:')==0) {
					window.open(url,'_system');
				} else {
					console.log("blocking broken link: "+ url);
                }
			  } 
            });
        }
    };
}]);
/*
    console.log('asking for file...');
        console.log('file got: '+fileUrl);
        $scope.fileurl=fileUrl;
    },function(error){
        $scope.fileurl=error;
    });
*/
