var GLBZ = null;
var d1=$.ajax({
  dataType: "json",
  url: "globalizejs/cldr/supplemental/likelySubtags.json",
  success: function(data){
    //console.log('likelySubtags.json loaded!');
    Globalize.load(data);
  }
});
var d2=$.ajax({
  dataType: "json",
  url: "globalizejs/cldr/main/it/ca-gregorian.json",
  success: function(data){
    //console.log('ca-gregorian.json IT loaded!');
    Globalize.load(data);
  }
});
var d3=$.ajax({
  dataType: "json",
  url: "globalizejs/cldr/main/en/ca-gregorian.json",
  success: function(data){
    //console.log('ca-gregorian.json EN loaded!');
    Globalize.load(data);
  }
});
var d4=$.ajax({
  dataType: "json",
  url: "globalizejs/cldr/main/de/ca-gregorian.json",
  success: function(data){
    //console.log('ca-gregorian.json DE loaded!');
    Globalize.load(data);
  }
});
var d5=$.ajax({
  dataType: "json",
  url: "globalizejs/cldr/supplemental/weekData.json",
  success: function(data){
    //console.log('weekData.json loaded!');
    Globalize.load(data);
  }
});
var d6=$.ajax({
  dataType: "json",
  url: "globalizejs/cldr/supplemental/timeData.json",
  success: function(data){
    //console.log('timeData.json loaded!');
    Globalize.load(data);
  }
});
$.when(d1,d2,d3,d4,d5,d6).done(function(r1,r2,r3,r4,r5,r6){
  GLBZ = { 'it':Globalize('it'), 'en':Globalize('en'), 'de':Globalize('de') };
  //console.log('Globalize lib inited!');
});
