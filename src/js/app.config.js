'use strict';

require.config({
	paths : {
		'jquery' : '../../node_modules/jquery/dist/jquery.min',
		'lodash' : '../../node_modules/lodash/lodash.min',
		'd3': '../../node_modules/d3/dist/d3.min'
	},
	'lodash': {
		exports: '_'
	},
	shim : {
		'backbone' : {
			deps : [ 'underscore', 'jquery' ],
			exports : 'Backbone'
		}
	},
});
