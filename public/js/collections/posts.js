/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// post Collection
	// ---------------
	var Posts = Backbone.Collection.extend({
		model: app.Post,

        exFilter: function(){
            return this.last();
        }
	});

	app.posts = new Posts();
})();