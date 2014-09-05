/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Post Model

	app.Post = Backbone.Model.extend({

		defaults: {
			id: '',
			title: '',
			desc: '',
			salary: 0,
			city: 0,
			phone: '',
			category: 0,
			company: '',
			employerId: 0,
			date: 0,
			isActive: '',
			completed: false
		},

		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
		}
	});
})();