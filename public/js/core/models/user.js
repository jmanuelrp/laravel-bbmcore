define(['msgBus', 'backbone'], function (bus, Backbone) {

	var admins = ['admin'],
		toJSON = Backbone.Model.prototype.toJSON;

	var User = Backbone.Model.extend({
		urlRoot: '/me',

		// It's a helper function, not a permission manager,
		// permissions are defined and resolved on server side.
		isAdmin: function () {
			return admins.indexOf(this.get('tipo')) >= 0;
		},

		is: function (tipos) {
			tipos = _.isArray(tipos) ? tipos : [tipos];

			return tipos.indexOf(this.get('tipo')) >= 0;
		},

		toJSON: function () {
			var json = toJSON.call(this);

			json.is_admin = this.isAdmin();

			return json;
		}
	});

	return User;
});
