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

/*
    console.log('asking for file...');
        console.log('file got: '+fileUrl);
        $scope.fileurl=fileUrl;
    },function(error){
        $scope.fileurl=error;
    });
*/