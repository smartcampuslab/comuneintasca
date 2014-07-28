#!/usr/local/bin/node
var jsonPath = require('JSONPath');

var trento = require('./trento.json');
console.log('version: '+trento.version);

Object.keys(trento.updated).forEach(function(k) {
	if (k=='eu.trentorise.smartcampus.comuneintasca.model.ConfigObject_OFF') {
		var config=trento.updated[k];
		console.log(JSON.stringify(config));
	} else if (k=='eu.trentorise.smartcampus.comuneintasca.model.EventObject') {
		var events=trento.updated[k];
		var eventsByID=[];
		for (idx in events) {
			eventsByID[events[idx].id]=events[idx];
		}
		for (idx in events) {
			var event=events[idx];
			if (event.parentEventId) {
				var parentFound=false;
				var parent_attributes=event.parentEventId.split(',');
				for (pattr_idx in parent_attributes) {
					var pattribute=parent_attributes[pattr_idx].split('=');
					if (pattribute[0].trim()=='objectRemoteId') {
						var parentid=pattribute[1].trim();
						var parent=eventsByID[parentid];
						if (parent) {
							parentFound=true;
							console.log(parent.title.it);
						}
					}
				}
				if (!parentFound) {
					console.log('parent not found: '+event.parentEventId);
				}
			}
		}
	}
});

console.log('DONE');
