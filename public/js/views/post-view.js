/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// Post Item View
	// --------------

	app.PostView = Backbone.View.extend({
		//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		// All dom events, addicting to post-DOM-elems
		events: {
			'click .vacancy_delete': 'remove',
			'click .vacancy_edit': 'edit',
			'click .post_title': 'show'
		},
		
		//Listeners
		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		//Rendering items
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		// Going to post's redactor page
        // TODO: Refactor it
		edit: function () {
			this.$el.addClass('editing');
			this.$input.focus();
		},

		// Close the `"editing"` mode, saving changes to the post.
		saveAndExit: function () {
			var value = this.$input.val();
			var trimmedValue = value.trim();

			// We don't want to handle blur events from an item that is no
			// longer being edited. Relying on the CSS class here has the
			// benefit of us not having to maintain state in the DOM and the
			// JavaScript logic.
			if (!this.$el.hasClass('editing')) {
				return;
			}

			if (trimmedValue) {
				this.model.save({ title: trimmedValue });

				if (value !== trimmedValue) {
					// Model values changes consisting of whitespaces only are
					// not causing change to be triggered Therefore we've to
					// compare untrimmed version with a trimmed one to check
					// whether anything changed
					// And if yes, we've to trigger change event ourselves
					this.model.trigger('change');
				}
			} else {
				this.clear();
			}

			this.$el.removeClass('editing');
		},

        //redirecting to post page
        //TODO: do:)
        show: function(){

        },


		// Remove the item, destroy the model from *localStorage* and delete its view.
		remove: function () {
			this.model.destroy();
            this.$el.remove();
		}
	});
})(jQuery);