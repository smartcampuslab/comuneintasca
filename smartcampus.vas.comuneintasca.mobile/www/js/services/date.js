angular.module('ilcomuneintasca.services.date', [])

.factory('DateUtility', function () {
  return {
    getLocaleDateString: function (lang, time) {
      var locale = 'en-EN';
      if (lang == 'it') {
        locale = 'it-IT';
      } else if (lang == 'de') {
        locale = 'de-DE';
      }
      console.log(locale);
      var date = new Date(time);
      var dateString = date.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return dateString;
    }
  }
})
