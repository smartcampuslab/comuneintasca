#!/usr/local/bin/node

var jsonPath = require('JSONPath');

var trento = require('./trento.json');
console.log('version: ' + trento.version);

var DO_CONFIG = false;
var DO_OLDCONFIG = false;
var DO_EVENTS_PARENT = false;
var DO_EVENTS_ONEDAY = true;
var DO_EVENTS = DO_EVENTS_PARENT || DO_EVENTS_ONEDAY;


Object.keys(trento.updated).forEach(function (k) {
  if (DO_CONFIG && k == 'eu.trentorise.smartcampus.comuneintasca.model.DynamicConfigObject') {
    var config = trento.updated[k];
    console.log(JSON.stringify(config, null, '  '));
    //console.log(JSON.stringify(config[0].highlights, null, '  '));
    //console.log(JSON.stringify(config[0].navigationItems, null, '  '));
    //console.log(JSON.stringify(config[0].menu.filter(function(obj){ return obj.id.indexOf('isitare')!=-1; })[0].items, null, '  '));
    //console.log(JSON.stringify(config[0].menu.filter(function(obj){ return obj.id.indexOf('venti')!=-1; })[0].items, null, '  '));
  }
  if (DO_OLDCONFIG && k == 'eu.trentorise.smartcampus.comuneintasca.model.DynamicConfigObject') {
    var oldconfig = trento.updated[k];
    console.log(JSON.stringify(oldconfig, null, '  '));
  }
  if (DO_EVENTS && k == 'eu.trentorise.smartcampus.comuneintasca.model.EventObject') {
    var events = trento.updated[k];
    var eventsByID = [];
    for (idx in events) {
      eventsByID[events[idx].id] = events[idx];
    }
    for (idx in events) {
      var event = events[idx];

      if (DO_EVENTS_PARENT && event.parentEventId) {
        var parentEvent = event.parentEventId;
        if (typeof parentEvent == "string") {
          parentEvent = JSON.parse(parentEvent);
        }
        if (parentEvent.objectRemoteId) {
          var parentid = parentEvent.objectRemoteId;
          var parent = eventsByID[parentid];
          if (parent) {
            console.log(parent.title.it);
          } else {
            console.log('parent not found! id: ' + parentid);
          }
        } else {
          console.log('unknown parent: ' + parentEvent);
        }

      } else if (DO_EVENTS_ONEDAY && event.fromTime == event.toTime) {
        console.log('[' + event.category + '] ' + event.title.it + ': ' + new Date(event.fromTime) + ' --> ' + new Date(event.toTime));

      }
    }
  }
});

console.log('DONE');
