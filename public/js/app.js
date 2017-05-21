define([
	'msgBus',
	'jquery',
	'admintheme',
	'backbone',
	'marionette',
	// 'sucursales/router',
], function (bus, $, admintheme, Backbone, Marionette) {

	var estudios = new Marionette.Application();

	estudios.addRegions({
		mainRegion: '#main-container-region', //'#main-container',
		titleRegion: '#main-title-region', //'#estudios-content-title'
		userRegion: '#user-region', //'#user-panel',
		menuRegion: '#menu-region', //'#sidebar-menus',
		searchRegion: '#search-region', //'#sidebar-search-form',

		// No configurados...
		// sidebarRegion: '#sidebar-region', //'#sidebar'
		// breadcrumbsRegion: '#breadcrumbs-region' //'#estudios-breadcrumb'
	});

	bus.reqres.setHandler('get:region', function (name) {
		return estudios.getRegion(name + 'Region');
	});

	estudios.on('start', function () {

		var user = bus.reqres.request('get:login:user');

		// user.fetch().done(function () {
			// bus.commands.execute('set:template:locals');

			// bus.commands.execute('router:start:sucursales');

			Backbone.history.start({ pushState: false });
		// });

		// bus.commands.execute('start:breadcrumbs');
	});

	estudios.listenTo(bus.events, 'show:view:done', function (options) {
		$('body').removeClass('sidebar-toggled');
		$('.ma-backdrop').remove();
		$('.sidebar, .ma-trigger').removeClass('toggled');
	});

	return estudios;
});
