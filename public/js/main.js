require([
	'app',
	'moment',
	'behaviors',
	'core/bootstrap'
], function (app, moment) {

	moment.locale('es');

	$(app.start.bind(app));

});
