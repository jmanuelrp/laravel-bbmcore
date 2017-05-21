define([], function () {

	var Cache = function () {
		this.properties = {};
	};

	Cache.prototype = {
		add: function (name, value) {
			this.properties[name] = value;
		},

		get: function (name) {
			return this.properties[name];
		},

		has: function (name) {
			return typeof this.properties[name] !== 'undefined';
		},

		clear: function () {
			this.properties = {};
		}
	};

	return Cache;
});
