define([
	'msgBus',
	'underscore',
	'backbone',
	'marionette'
], function (bus, _, Backbone, Marionette) {

	function _recursiveDelegateEvents (view) {
		if (_.isFunction(view.recursiveDelegateEvents))
		{
			view.recursiveDelegateEvents();
		}
		else
		{
			view.delegateEvents();
		}
	}

	var App = {};

	/* -------------------- CUSTOM ITEMS -------------------- */

	App.Model = Backbone.Model.extend({
		showValidationError: function (attrs, options) {
			var result = this.validate(attrs, options);

			if (result)
			{
				bus.alert.validation(result);

				return true;
			}

			return false;
		},

		toFullJSON: function () {
			return _.clone(this.attributes);
		},

		get: function (attr) {
			return _.get(this.attributes, attr);
		},

		urlFront: function () {},

		destroy: function (options) {
			if (options.data) {
				options.data = JSON.stringify(options.data);
			}

			options.contentType = 'application/json';

			return Backbone.Model.prototype.destroy.call(this, options);
		}
	});

	App.Collection = Backbone.Collection.extend({
		toFullJSON: function () {
			return this.map(function (model) {
				return model.toFullJSON();
			});
		}
	});

	/* -------------------- BASE VIEWS -------------------- */

	App.BackboneView = Backbone.View.extend({
		//
	});

	App.EmptyView = Marionette.ItemView.extend({
		template: 'core::emptyItem',

		message: 'No hay elementos que mostrar',

		serializeData: function () {
			return {
				message: this.message
			};
		}
	});

	App.ItemView = Marionette.ItemView.extend({
		//
	});

	App.CollectionView = Marionette.CollectionView.extend({
		emptyView: App.EmptyView,

		recursiveDelegateEvents: function () {
			Marionette.CollectionView.prototype.delegateEvents.call(this);

			this.children.each(_recursiveDelegateEvents);
		}
	});

	App.LayoutView = Marionette.LayoutView.extend({
		recursiveDelegateEvents: function () {
			Marionette.CollectionView.prototype.delegateEvents.call(this);

			_.each(this.getRegions(), function (region) {
				if (! region.hasView()) { return; }

				_recursiveDelegateEvents(region.currentView);
			});
		}
	});

	App.CompositeView = Marionette.CompositeView.extend({
		emptyView: App.EmptyView,

		recursiveDelegateEvents: function () {
			Marionette.CompositeView.prototype.delegateEvents.call(this);

			this.children.each(_recursiveDelegateEvents);
		}
	});

	/* -------------------- CUSTOM VIEWS -------------------- */

	App.CollectionLayoutView = App.LayoutView.extend({
		regions: {
			formRegion: '.collection-form',
			collectionRegion: '.collection-main',
			paginationRegion: '.pagination-region'
		}
	});

	return App;
});
