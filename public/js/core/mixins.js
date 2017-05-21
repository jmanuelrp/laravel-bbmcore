define([
	'underscore',
	'msgBus'
], function (_, bus) {

	var Mixins = {};

	Mixins.Model = {
		belongsTo: null,

		crumbName: '',

		crumbLabelAttr: 'nombre',

		crumbLabel: function () {
			return this.get(this.crumbLabelAttr) || '--';
		},

		crumbTitle: function () {
			return  _.result(this,'crumbName');
		},

		crumbUrl: '#',

		toCrumb: function (){
			return {
				link  : _.result(this,'crumbUrl'  ),
				label : _.result(this,'crumbLabel'),
				cname : _.result(this,'crumbName' ),
				title : _.result(this,'crumbTitle')
			};
		},

		m_toJSON: function() {
			return _.clone(this.attributes);
		}
	};

	Mixins.FormHelpers = {
		formToJson: function () {
			var json = this.$el
				.find('form')
				.formParams();

			return json;
		},

		getData: function () {
			return this.formToJson();
		}
	};

	Mixins.Grid = {

		tagName: 'div',

		template: 'core::gridContainer',

		container: '.grid-container',

		use_template: true,

		grid: null,

		url: null,

		events: {
			'click .check_row' : 'toggleRow',
			'dblclick .check_row' : 'toggleAllRow'
		},

		m_render: function () {
			if (this.grid) return this;

			if (this.use_template) {
				return this.customRender();
			}

			return this.simpleRender();
		},

		customRender: function () {
			var html = bus.template.render(
				this.template,
				this.getTemplateData()
			);

			this.$el.html(html);

			this.grid = this.$el
				.find(this.container)
				.kendoGrid(this._grid())
				.data('kendoGrid');

			this.trigger('render:grid');

			return this;
		},

		simpleRender: function () {
			this.grid = this.$el
				.kendoGrid(this._grid())
				.data('kendoGrid');

			this.trigger('render:grid');

			return this;
		},

		render: function () {
			this.m_render();

			return this;
		},

		addItem: function (item) {
			if (this.grid) this.grid.dataSource.add(item);
		},

		addModel: function (model) {
			var item = _.clone(model.attributes);

			this.addItem(item);
		},

		removeByModel: function (model) {
			this.removeById(model.id);
		},

		removeById: function (id) {
			var item = this.grid.dataSource.get(id);

			this.grid.dataSource.remove(item);
		},

		getById: function (id) {
			return this.grid.dataSource.get(id);
		},

		getByUid: function (uid) {
			return this.grid.dataSource.getByUid(uid);
		},

		getTemplateData: function () {
			return {};
		},

		getSelected: function () {
			var data = this.grid.dataSource.data();

			return _.filter(data, function (item) {
				return item.check_row;
			});
		},

		getSelectedIds: function () {
			var data = this.getSelected();

			return _.pluck(data, 'id');
		},

		clearSelection: function () {
			this.setChecked(false, true);

			this.grid.refresh();
		},

		setChecked: function (value, all) {
			all = all || false;

			var data = all? this.getAll():this.getPage();

			_.each(data, function (item) {
				item.check_row = value;
			});

			this.trigger('checked');
			this.trigger('checked:'+all?'all':'page');
		},

		toggleAllRow: function (e) {
			var value = !$(e.currentTarget).is(':checked');

			this.setChecked(value);

			this.grid.refresh();
		},

		toggleRow: function (e) {
			var $cb = $(e.currentTarget);

			var item = this.grid.dataSource.getByUid($cb.data('uid'));

			item.check_row = $cb.is(':checked');

			this.trigger('checked', item);
		},

		getUrl: function () {
			return this.url;
		},

		getAll: function () {
			return this.grid.dataSource.data();
		},

		getPage: function () {
			return this.grid._data;
		},

		getData: function () {
			var data = this.grid.dataSource.data();

			return data.toJSON();
		},

		_grid: function () {
			return {};
		}
	};

	Mixins.GridCollection = {

		m_initialize: function (options) {
			// this.listenTo(this.collection, 'sync', this.render);
			this.listenTo(this.collection, 'add', this.add);
			this.listenTo(this.collection, 'remove', this.loadData);
			this.listenTo(this.collection, 'reset', this.loadData);

			this.on('render:grid', this.loadData);
		},

		initialize: function (options) {
			this.m_initialize(options);
		},

		loadData: function () {
			if (_.isNull(this.grid)) return;

			var data = this.collectionToJSON();

			this.grid.dataSource.data(data);

			this.trigger('checked');
			this.trigger('loaddata');
		},

		collectionToJSON: function () {
			return this.collection.map(this.modelToJSON);
		},

		modelToJSON: function (model) {
			return _.clone(model.attributes);
		},

		add: function (model) {
			if (! this.grid) return;

			var data = this.modelToJSON(model);

			this.grid.dataSource.add(data);
		},

		remove: function (model) {
			if (! model) return;

			var item = this.grid.dataSource.get(model.get('id'));

			this.grid.dataSource.remove(item);
		}

	};

	return Mixins;
});
