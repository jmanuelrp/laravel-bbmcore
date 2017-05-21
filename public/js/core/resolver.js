define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var slice = Array.prototype.slice;

	function sameIds (name, model, data)
	{
		if (! (model && model.id == data[name+'_id']))
		{
			return false;
		}

		var dependency_name = _.get(model, 'resolver.dependency_name');

		return dependency_name ? sameIds.call(this, dependency_name, model[dependency_name], data) : true;
	}

	function createModel (name, Model, data, callback)
	{
		var model = new Model({
			id: data[name + '_id']
		}, data.options);

		this.trigger('create:' + name, model, name);

		callback(model);
	}

	function failFetch (deferred, model, response)
	{
		deferred.reject(JSON.parse(response.responseText));
	}

	function Resolver (options)
	{
		options = options || {};

		_.defaults(options, {
			fetchCache: false
		});

		this.fetchCache = options.fetchCache;
	}

	_.extend(Resolver.prototype, Backbone.Events);

	Resolver.prototype.cacheGet = function (name)
	{
		var value = null;

		if (this.cache)
		{
			value = this.cache.get(name);
		}

		return value;
	};

	Resolver.prototype.cacheAdd = function (name, value)
	{
		if (this.cache)
		{
			this.cache.add(name, value);
		}
	};

	Resolver.prototype.fillDependencies = function (name, model)
	{
		this.trigger('prefill:' + name, model, name);

		var dependency, dependency_name = _.get(model, 'resolver.dependency_name');

		if (!dependency_name || !(dependency = model[dependency_name]))
		{
			return;
		}

		var data	= _.clone(model.attributes),
			c_model = this.cacheGet(dependency_name);

		if (sameIds.call(this, dependency_name, c_model, data))
		{
			dependency.set(_.clone(c_model.attributes), { silent: true });
		}

		dependency.set(data[dependency_name] || {}, { silent: true });

		this.trigger('fill:' + dependency_name, dependency, dependency_name);

		this.fillDependencies(dependency_name, dependency);
	};

	Resolver.prototype.model = function (amd_name, data, callback)
	{
		_.defaults(data, { options: {} });

		var self = this,
		    deferred = new $.Deferred(),
		    item = _.object(['require_name', 'model_class'], amd_name.split('@'));

		var _callback = function (model) {
			callback(model);

			if (model) { deferred.resolve(model); } else { deferred.reject(); }
		};

		require([item.require_name], function (Resource)
		{
			var Model = item.model_class ? Resource[item.model_class] : Resource;

			var model_name = _.get(Model.prototype, 'resolver.name'),
				dependency = _.get(Model.prototype, 'resolver.dependency'),
				dependency_name = _.get(Model.prototype, 'resolver.dependency_name');

			if (! dependency)
			{
				createModel.call(self, model_name, Model, data, _callback);
			}
			else
			{
				self.model(dependency, data, function (Relation) {
					data.options[dependency_name] = Relation;

					createModel.call(self, model_name, Model, data, _callback);
				});
			}
		});

		return deferred;
	};

	Resolver.prototype.get = function (name, data, onDone, context)
	{
		var self = this, deferred = new $.Deferred(), c_model = this.cacheGet(name);

		if (c_model)
		{
			this.trigger('incache', name, data, c_model);
		}

		if (c_model && sameIds.call(this, name, c_model, data))
		{
			deferred.resolve(c_model);
		}
		else this.model(name, data, function (model)
		{
			if (model)
			{
				model.fetch({ cache: self.fetchCache })
					.fail(function (response) {
						deferred.reject(JSON.parse(response.responseText));
					})
					.done(function () {
						self.fillDependencies(name, model);
						self.cacheAdd(name, model);

						deferred.resolve(model);
					});
			}
			else
			{
				deferred.reject({
					error: 'Error al obtener informacion de "' + name + '"'
				});
			}
		});

		if (onDone)
		{
			deferred.done(context ? onDone.bind(context) : onDone);
		}

		return deferred;
	};

	Resolver.prototype.route = function (dependencies, callback)
	{
		return function () {
			var self = this,
				parameters = slice.call(arguments);

			require(dependencies, function() {
				callback.apply(self, slice.call(arguments).concat(parameters));
			});
		};
	};

	Resolver.prototype.routeModel = function (options)
	{
		_.defaults(options, {
			require: [],
			params: [],
			model: 'modelname'
		});

		var _resolver = this,
		    require_size = options.require.length;

		return _resolver.route(options.require, function () {
			var self = this, parameters = [], data = {}, args = arguments;

			_.times(require_size, function (i) {
				parameters.push(args[i]);
			});

			_.each(options.params, function (name, i) {
				data[name] = args[require_size + i];
			});

			var xhr = _resolver.get(options.model, data, function (model) {
				options.done.apply(self, parameters.concat([model, data]));
			});

			if (options.fail)
			{
				xhr.fail(options.fail.bind(this));
			}
		});
	};

	return Resolver;
});
