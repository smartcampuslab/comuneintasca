#!/usr/local/bin/node
var jsonPath = require('JSONPath');

var data = require('./data.json');

Object.keys(data.updated).forEach(function(k) {
	if (k=='eu.trentorise.smartcampus.comuneintasca.model.DynamicConfigObject') {
		var config=data.updated[k][0];
    console.log(JSON.stringify(config, null, '  '));
	}
});
