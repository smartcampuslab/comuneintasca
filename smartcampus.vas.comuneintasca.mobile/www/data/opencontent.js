#!/usr/local/bin/node
var jsonPath = require('JSONPath');

var data = require('./data.json');

Object.keys(data.updated).forEach(function(k) {
	if (k=='it.smartcommunitylab.comuneintasca.core.model.DynamicConfigObject') {
		var config=data.updated[k][0];
    console.log(JSON.stringify(config, null, '  '));
	}
});
