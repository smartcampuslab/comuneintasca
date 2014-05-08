angular.module('starter.directives', [])

.directive('comuniImg', function($q, Files) {
    var emptyImageUrl='img/placeholder-512x512.gif';
    return {
        restrict:'E', replace:true,
        template: function(tElem, tAttrs) {
            return '<div title="'+emptyImageUrl+'" class="item-image comuni-item-image">loading...</div>';
        },
        link:function(scope, element, attrs) {
            Files.get(scope.place.image).then(function(fileUrl){
                element.html('&nbsp;');
                element.attr('style','background-image:url('+fileUrl+')');
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
