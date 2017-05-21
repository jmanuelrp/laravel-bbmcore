define(['underscore'], function (_) {

	function Globals (data) {
		this.clear();
	}

	function unpackModel (name, model) {
		var rel_name = _.result(model || {}, 'belongsTo');

		if (! rel_name) return;

		var rel_model = model[rel_name];

		this.add(rel_name, rel_model);
		unpackModel.call(this, rel_name, rel_model);
	}

	Globals.prototype = {

		add: function (name, model) {
			this.orderly.unshift(name);

			this.models[name] = model;
		},

		get: function (name) {
			return this.models[name] || null;
		},

		set: function (name, model) {
			this.clear();

			this.add(name, model);

			unpackModel.call(this, name, model);
		},

		clear: function () {
			this.orderly = [];
			this.models = {};
		},

		reset: function (models) {
			this.clear();

			_.each(models, function (model, name) {
				this.add(name, model);
			}, this);
		},

		getOrderly: function () {
			return _.map(this.orderly, function (name) {
				return {
					model: this.models[name],
					name: name
				};
			}, this);
		},

		toJSON: function () {
			var json = {};

			_.each(this.models, function (model, name) {
				json[name] = model.toJSON();
			});

			return json;
		}

	};

	return Globals;
});
