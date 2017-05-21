define([
	'msgBus',
	'underscore',
	'backbone',
	'marionette',
	'validation',
	'core/templates',
	'core/alerts',
	'core/models/user',
	'core/behaviors',
	'core/breadcrumbs',
	'core/globals'
],

function (bus, _, Backbone, Marionette, Validation, templates, alerts, User, Behaviors, Breadcrubms, Globals) {

	/**
	 * String extra methods
	 */
	String.prototype.capitalize = function () {
		return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
	};

	String.prototype.titlelize = function () {
		return this.split(' ').map(function (item) {
			return item.capitalize();
		}).join(' ');
	};

	String.prototype.short = function (size) {
		var original = this.valueOf();

		if (typeof size !== 'number') {
			return original;
		}

		return this.length > size ? this.substr(0, size) + '...' : original;
	};

	/**
	 * Backbone Validation
	 */
	_.extend(Backbone.Model.prototype, Validation.mixin);

	/**
	 * Extra msgBus behaviors
	 */
	bus.template = templates;
	bus.alert = alerts;
	bus.globals = new Globals();

	bus.commands.setHandler('set:global:model', function (name, model) {
		bus.globals.set(name, model);

		// bus.commands.execute('gen:global:crumbs');
		bus.commands.execute('set:template:locals');
	});

	/**
	 * Login user
	 */
	var user = new User();

	user.on('change sync', function () {
		bus.commands.execute('set:template:locals');
	});

	bus.reqres.setHandler('get:login:user', function () {
		return user;
	});

	/**
	 * Default data for templates
	 */
	bus.commands.setHandler('set:template:locals', function () {
		templates.setLocals({
			timeOffset: (new Date().getTimezoneOffset()),
			'__g__': bus.globals.toJSON(),
			'__u__': user.toJSON()
		});
	});

	/**
	 * Listen 401 code from every backbone request
	 */
	var legacySync = Backbone.sync,
		legacyFetch = Backbone.Collection.prototype.fetch,
		slice = Array.prototype.slice;

	Backbone.sync = function () {
		var xhr = legacySync.apply(Backbone, slice.call(arguments));

		return xhr.fail(function (response) {
			if (response.status == 401)
			{
				bus.commands.execute('show:login:form');
			}
		});
	};

	/**
	 * Default Backbone fetch options
	 */
	Backbone.Collection.prototype.fetch = function (options) {
		options = _.defaults(options || {}, {
			reset: true,
			cache: true
		});

		return legacyFetch.call(this, options);
	};

	/**
	 * Marionette behaviors
	 */
	Marionette.Behaviors.behaviorsLookup = function () {
		return Behaviors;
	};

	/**
	 * Template engine on Marionette
	 */
	Marionette.Renderer.render = function (tpl_name, data) {
		return templates.render(tpl_name, data);
	};

	/**
	 * Get current hash location
	 */
	bus.reqres.setHandler('get:location:hash', function () {
		return Backbone.history.location.hash;
	});

	/**
	 * Navigate
	 */
	bus.commands.setHandler('navigate', function (hash_url, options) {
		options = _.defaults(options || {}, {
			trigger: true
		});

		if (_.first(hash_url) !== '#') {
			hash_url = '#' + hash_url;
		}

		Backbone.history.navigate(hash_url, options);
	});

	bus.commands.setHandler('navigate:back', function (options) {
		options = _.defaults(options || {}, {
			trigger: true
		});

		Backbone.history.history.back();
		// Backbone.history.navigate(hash_url, options);
	});

	/**
	 * Breadcrumbs
	 */
	var breadcrumbs = new Breadcrubms.Collection(),
		ignoredCrumbs = ['alumno','empleado','developer','profesor','nivel'];

	bus.reqres.setHandler('get:breadcrumbs', function () {
		return breadcrumbs;
	});

	bus.commands.setHandler('start:breadcrumbs', function () {
		var region = bus.reqres.request('get:region', 'breadcrumbs');

		var breadcrumbsView = new Breadcrubms.Views.CollectionView({
			el: region.$el,
			collection: breadcrumbs
		});
	});

	bus.commands.setHandler('gen:global:crumbs', function () {
		var models = [], last;

		_.each(bus.globals.getOrderly(), function(item, index) {
			if (! _.isFunction(item.model.toCrumb)) return;

			if (_.contains(ignoredCrumbs, item.name)) return;

			models.push(_.defaults(item.model.toCrumb(), {
				level: index
			}));
		});

		last = _.last(models);

		if (last)
		{
			last.active = true;
		}

		breadcrumbs.reset(models);
	});

	bus.commands.setHandler('add:breadcrumb', function (crumb, level) {
		_.defaults(crumb, {
			active: true,
			global: false,
			link  : bus.reqres.request('get:location:hash')
		});

		if (breadcrumbs.hasCrumb(crumb)) {
			return crumb.active ? breadcrumbs.focusByName(crumb.cname) : null;
		}

		var replace = false,
			crumbs  = breadcrumbs.toJSON();

		for (var i = 0; i < crumbs.length && i <= level; i++) {
			if (crumbs[i].global) continue;

			if (level == i) replace = true;

			else level++;
		}

		if (crumb.active) {
			_.each(crumbs, function (item){
				item.active = false;
			});
		}

		crumbs.splice(level, replace ? 1 : 0, crumb);

		breadcrumbs.reset(crumbs);
	});

	/**
	 * User panel
	 */
	var last_user_panel = null;

	bus.commands.setHandler('hide:user:panel', function () {
		var region = bus.reqres.request('get:region', 'user');

		region.$el.hide();
	});

	bus.commands.setHandler('show:user:panel', function () {
		var region = bus.reqres.request('get:region', 'user');

		region.$el.fadeIn();
	});

	bus.commands.setHandler('set:user:panel', function (user, options) {
		options = _.defaults(options || {}, {
			force: false
		});

		var data = user.toJSON();

		if (options.force || this.last_user_panel != data.id)
		{
			var region = bus.reqres.request('get:region', 'user');

			region.$el.html(templates.render('core::userCard', data));
		}

		bus.commands.execute('show:menu', {
			key: options.force ? null : 'user' + data.id,
			template: 'user/menu',
			data: { usuario: data }
		});
	});


	/**
	 * Google Analytics
	 */
	bus.commands.setHandler('send:analytics', function (page, title) {
		if (_.isFunction(window.ga))
		{
			window.ga('set', { page: page, title: title });
			window.ga('send', 'pageview');
		}
	});

	/**
	 * Show views, menus, titles
	 */
	var last_menu = null;
	function showMenu (options) {
		if (! _.isObject(options))
		{
			options = { template: options, key: options };
		}

		if (last_menu !== null && last_menu == options.key) return;

		last_menu = options.key || null;

		var region = bus.reqres.request('get:region', 'menu'),
			html = templates.render(options.template, options.data);

		region.$el
			.hide()
			.html(html)
			.fadeIn();

		bus.events.trigger('show:menu:done', options, region);
	}

	bus.commands.setHandler('show:view', function (options) {
		var region = bus.reqres.request('get:region', 'main');

		bus.events.trigger('before:show:view', options, region);

		region.show(options.view);

		if (options.menu)
		{
			showMenu(options.menu);
		}

		if (options.title)
		{
			bus.commands.execute('show:title', options.title);
		}

		bus.events.trigger('show:view:done', options, region);
	});

	bus.commands.setHandler('show:title', function (options) {
		var data, region = bus.reqres.request('get:region', 'title');

		data = _.defaults(_.isObject(options)? options : {}, {
			title: _.isString(options)? options : '',
			subtitle: '',
			page: null
		});

		document.title = data.page || data.title || 'PIEEL';

		region.$el.html(data.title+' <small>'+data.subtitle+'</small>');

		bus.commands.execute('send:analytics', {
			page: '/' + Backbone.history.location.hash.replace('#',''),
			title: data.title + (data.subtitle ? ' - '+data.subtitle : '')
		});
	});

	bus.commands.setHandler('show:menu', showMenu);

	/**
	 * Vista de busqueda
	 */
	bus.commands.setHandler('start:searchbox', function () {
		require(['core/views/alumnoSearch'], function (Busqueda) {
			(new Busqueda()).render();
		});
	});

});
