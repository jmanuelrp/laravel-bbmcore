define([
	'msgBus',
	'underscore',
	'backbone',
	'download'
],

function(bus, _, Backbone){

	var Exportar = Backbone.Model.extend({
		initialize: function(attributes, options) {
			this.url = options.url;
		},

		save: function() {
			return this.download();
		},

		download: function() {
			return $.fileDownload(this.url, {
				data: {
					json: this.toString()
				},
				httpMethod: 'POST',
				failCallback: function (responseText, url) {
					bus.alert.error('Ocurrio un error al exportar/descargar el elemento seleccionado');
				}
			});
		},

		toString: function() {
			return JSON.stringify(this.toJSON());
		}
	});

	return Exportar;
});