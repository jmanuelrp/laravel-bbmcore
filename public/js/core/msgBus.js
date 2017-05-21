define(['wreqr', 'core/cache'], function (Wreqr, Cache) {

	return {
		reqres: new Wreqr.RequestResponse(),
		commands: new Wreqr.Commands(),
		events: new Wreqr.EventAggregator(),
		cache: new Cache()
	};

});
