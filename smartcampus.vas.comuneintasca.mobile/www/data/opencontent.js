#!/usr/local/bin/node
var jsonPath = require('JSONPath');

var trento = require('./trento.json');
//console.log('version: '+trento.version);

Object.keys(trento.updated).forEach(function(k) {
	if (k=='eu.trentorise.smartcampus.comuneintasca.model.DynamicConfigObject') {
		var config=trento.updated[k][0];
    console.log(JSON.stringify(config, null, '  '));
	}
});
