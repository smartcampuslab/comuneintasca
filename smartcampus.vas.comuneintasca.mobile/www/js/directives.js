angular.module('starter.directives', [])

.directive('comuniImg', function ($q, Files) {
  var emptyImageUrl = 'img/placeholder-512x512.gif';
  return {
    restrict: 'E',
    replace: true, //scope:{ image:'=image',gotdata:'=gotdata' },
    template: function (tElem, tAttrs) {
      return '<div>loading...</div>';
    },
    link: function (scope, element, attrs) {
      // added since scope can be not yet filled with actual data,
      // since data is taken asyncronously from the database
      scope.gotdata.then(function () {
        content = scope.content || scope.place || scope.hotel || scope.restaurant || scope.event || scope.obj || scope.itinerario ||{
          image: ''
        };
        if (content.image && content.image != '' && content.image != 'false') {
          Files.get(content.image).then(function (fileUrl) {
            //if (element.hasClass('item-image')) {
            element.html('&nbsp;');
            element.attr('style', 'background-image:url(' + fileUrl + ')');
            //} else {
            //  element.html('<img src="'+fileUrl+'" />');
            //}
          }, function () {
            element.html('&nbsp;').addClass('unavailable');
          });
        } else {
          element.html('&nbsp;').addClass('missing');
        }
      }, function () {
        element.html('&nbsp;').addClass('error');
      });
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
				console.log(element[0].attributes['href'].value);
				event.preventDefault();
			    var url = element[0].href;
                var protocol = element[0].protocol;
				// do not open relative links
				if (protocol && element[0].attributes['href'].value.indexOf(protocol) == 0) {
					window.open(url,'_system');
					console.log("blocking link "+ element[0].attributes['href'].value);             
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
