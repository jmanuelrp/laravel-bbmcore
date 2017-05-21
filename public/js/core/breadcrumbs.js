
define([
	'underscore',
	'backbone',
	'marionette',
	'swig'
],

function(_, Backbone, Marionette){

	var Breadcrumbs = { Views: {} };

	Breadcrumbs.Model = Backbone.Model.extend({
		defaults: {
			active: false,
			global: true,
			link  : '#',
			label : '--',
			cname : ''
		},

		isActive: function () {
			return this.get('active');
		}
	});

	Breadcrumbs.Collection = Backbone.Collection.extend({
		model: Breadcrumbs.Model,

		comparator: 'level',

		focusByName: function (name) {
			var crumb = this.findWhere({ cname: name });

			if (!crumb || crumb.isActive()) return;

			this.deactivateAll();
			crumb.set('active', true);
		},

		hasCrumb: function (crumb) {
			var _crumb = this.findWhere({
				cname : crumb.cname,
				link  : crumb.link
			});

			return !_.isUndefined(_crumb);
		},

		deactivateAll: function() {
			this.chain().where({ active: true }).each(function (crumb) {
				crumb.set('active', false);
			});
		}
	});

	Breadcrumbs.Views.ModelView = Marionette.ItemView.extend({
		tagName: 'li',

		className: function() {
			return 'crumb-item-' + this.model.get('cname');
		},

		ui: {
			link: 'a'
		},

		template: 'core::crumbItem',

		modelEvents: {
			'change': 'render'
		},

		onRender: function () {
			this.ui.link.tooltip({ placement: 'left' });

			this.setActiveTag();
		},

		setActiveTag: function () {
			var action = this.model.isActive() ? 'addClass' : 'removeClass';

			this.$el[action]('active');
		}
	});

	Breadcrumbs.Views.CollectionView = Marionette.CollectionView.extend({

		childView: Breadcrumbs.Views.ModelView,

		initialize: function () {
			this.listenTo(this.collection, 'reset', this.render);
		}

	});

	return Breadcrumbs;
});
