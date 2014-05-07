angular.module('starter.filters', [])

.filter('translate', function() {
    return function(input) {
        if (input && input.en && input.en!='') {
            return input.en;

        } else if (input && input.it && input.it!='') {
            return input.it;

        } else  {
            return input;
        }
    };
})
