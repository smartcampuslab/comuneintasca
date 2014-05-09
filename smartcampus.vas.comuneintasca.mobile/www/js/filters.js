angular.module('starter.filters', [])

.filter('translate', function($rootScope) {
    lang=$rootScope.lang;
    return function(input) {
        console.log('translate: lang='+lang);
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
