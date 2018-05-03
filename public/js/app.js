define([
	'msgBus',
	'jquery',
	'admintheme',
	'backbone',
	'marionette',
	// 'sucursales/router',
], function (bus, $, admintheme, Backbone, Marionette) {

	var app = new Marionette.Application();

	app.addRegions({
		mainRegion: '#main-container-region', //'#main-container',
		titleRegion: '#main-title-region', //'#app-content-title'
		userRegion: '#user-region', //'#user-panel',
		menuRegion: '#menu-region', //'#sidebar-menus',
		searchRegion: '#search-region', //'#sidebar-search-form',

		// No configurados...
		// sidebarRegion: '#sidebar-region', //'#sidebar'
		// breadcrumbsRegion: '#breadcrumbs-region' //'#app-breadcrumb'
	});

	bus.reqres.setHandler('get:region', function (name) {
		return app.getRegion(name + 'Region');
	});

	app.on('start', function () {

		var user = bus.reqres.request('get:login:user');

		// user.fetch().done(function () {
			// bus.commands.execute('set:template:locals');

			// bus.commands.execute('router:start:sucursales');

			Backbone.history.start({ pushState: false });
		// });

		// bus.commands.execute('start:breadcrumbs');
	});

	app.listenTo(bus.events, 'show:view:done', function (options) {
		$('body').removeClass('sidebar-toggled');
		$('.ma-backdrop').remove();
		$('.sidebar, .ma-trigger').removeClass('toggled');
	});

	return app;
});
