// Backbone Model

var Blog = Backbone.Model.extend({
	defaults : {
		author : '',
		title  : '',
		url    : ''
	}
});