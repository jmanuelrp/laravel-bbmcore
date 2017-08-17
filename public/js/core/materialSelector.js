define([
	'msgBus',
	'underscore',
	'backbone',
	'oscura',
	'core/app',
	'core/views/paginationControls'
],

function (bus, _, Backbone, Oscura, App, PControls) {

	function selectItem (item, is_selected) {
		item._pl_is_selected = is_selected;

		item.trigger('selector:selected', is_selected, item);
	}

	var ModelView = App.ItemView.extend({
		className: function () {
			return 'list-group-item media '+
				(this.getOption('autoselect')?'':'');
		},

		template: 'core::selector/itemMaterial',

		ui: {
			btnSeletor: '.btn-selector',
			chkSeletor: '.chk-selector'
		},

		events: function () {
			if (this.getOption('autoselect')) {
				return { 'click': 'onClickBtnSelect' };
			}

			return {
				'click @ui.btnSeletor': 'onClickBtnSelect'
			};
		},

		modelEvents: {
			'selector:selected': 'onSelectItem'
		},

		initialize: function (options) {
			this.itemTemplate = options.itemTemplate;
		},

		onSelectItem: function (is_selected) {
			this.ui.chkSeletor.prop('checked', is_selected);
		},

		onClickBtnSelect: function () {
			var is_selected = this.getOption('autoselect') || 
				!this.model._pl_is_selected;

			selectItem(this.model, is_selected);
		},

		serializeData: function () {
			return {
				id: this.model.id,
				item: this.model.toJSON(),
				itemTemplate: this.itemTemplate,
				selected: this.model._pl_is_selected
			};
		}
	});

	var CollectionView = App.CollectionView.extend({
		childView: ModelView,

		className: 'list-group lg-even-black',

		childViewOptions: function () {
			return {
				template: this.modelTemplate,
				itemTemplate: this.itemTemplate,
				autoselect: this.autoselect
			};
		},

		initialize: function (options) {
			this.modelTemplate = options.modelTemplate;
			this.itemTemplate = options.itemTemplate;
			this.autoselect = options.autoselect;
		}
	});

	var Selector = App.LayoutView.extend({
		template: 'core::selector/materialSelector',

		regions: {
			mainRegion: '.container-region',
			paginationRegion: '.pagination-region'
		},

		ui: {
			lblCount: '.lbl-count',
			inpSearch: '.inp-search',
			btnSearch: '.btn-search',
			formSearch: '.form-search',
			showSelection: '.pl-show-selection',
			showAll: '.pl-show-all',
			selectAll: '.pl-select-all',
			clearSelection: '.pl-clear-selection',
			pagination: '.pl-pagination'
		},

		events: {
			'keyup @ui.inpSearch': 'onChangeSearchbox',
			'change @ui.inpSearch': 'onChangeSearchbox',
			'submit @ui.formSearch': 'onSubmitSearchForm',
			'click @ui.showSelection': 'showSelection',
			'click @ui.showAll': 'showAll',
			'click @ui.selectAll': 'selectAll',
			'click @ui.clearSelection': 'clearSelection'
		},

		collectionEvents: {
			'reset': 'onResetCollection'
		},

		behaviors: {
			Reloadable: {
				collection: '_superset',
				options: function () {
					return {
						data: this.last_fetch_data
					};
				}
			}
		},

		options: {
			title: 'Seleccionar',
			paginate: 0,
			mode: 'multiple',
			filters: [],
			itemTemplate: null,
			refreshBtn: false
		},

		initialize: function (options) {
			this.setCollection(options.collection);
		},

		setCollection: function (collection) {
			this.collection = new Oscura(collection);
			this._superset = this.collection.superset();

			this.stopListening(this._superset);
			this.listenTo(this._superset, 'selector:selected', this.onSelectItem);

			this.collection
				.setPerPage(this.getOption('paginate'))
				.filterBy('visibles', function (item) {
					return !item._pl_is_hidden;
				})
				.filterBy('search', this._searchFilter.bind(this));

			if (this.isRendered)
			{
				this.renderCollection();
			}
		},

		renderCollection: function () {
			this.mainRegion.show(new CollectionView({
				collection: this.collection,
				modelTemplate: this.getOption('modelTemplate'),
				itemTemplate: this.getOption('itemTemplate'),
				autoselect: this.getOption('mode') != 'multiple'
			}));

			if (this.getOption('paginate') > 0)
			{
				this.paginationRegion.show(new PControls({
					collection: this.collection
				}));
			}
		},

		fetch: function (options) {
			options = options || {};

			this.last_fetch_data = options.data;

			return this._superset.fetch(options);
		},

		fetchIfEmpty: function (options) {
			if (this._superset.isEmpty())
			{
				return this.fetch(options);
			}
		},

		onResetCollection: function () {
			if (this.isRendered) {
				this._updateLblCount();
			}
		},

		_updateLblCount: function (count) {
			if (_.isUndefined(count))
			{
				count = this._getSelection().length;
			}

			this.ui.lblCount.text(count);
		},

		onRender: function () {
			this.renderCollection();

			this.ui.showAll.hide();
		},

		onSelectItem: function (is_selected, item) {
			var selection = this._getSelection();

			this.trigger('selection:change', item, is_selected);

			this._updateLblCount(selection.length);

			if (is_selected && this.getOption('mode') !== 'multiple')
			{
				var _selection = _.filter(selection, function (_item) {
					return _item.cid !== item.cid;
				});

				this._deselect(_selection);
			}
		},

		onSubmitSearchForm: function (e) {
			e.preventDefault();
			e.stopPropagation();

			if (this.getOption('mode') !== 'multiple' && this.collection.length == 1)
			{
				selectItem(this.collection.first(), true);
			}
		},

		clean: function() {
			this.clearSelection();

			this.ui.inpSearch.val('');
			this.collection.refilter();
		},

		onChangeSearchbox: function () {
			this.collection.refilter();
		},

		focusSearch: function () {
			if (this.isRendered) {
				this._focusSearch();
			}
		},

		_focusSearch: function () {
			this.ui.btnSearch.trigger('click');

			setTimeout(function () {
				this.ui.inpSearch.focus();
			}.bind(this), 1000);
		},

		_searchFilter: function (model) {
			var search_word = this.isRendered ?
				this.ui.inpSearch.val() : '';

			if (_.isEmpty( search_word )) { return true; }

			var _word = search_word.toLowerCase(),
			    _data = model.toJSON();

			return _.some(this.getOption('filters'), function (item) {
				var value = _.isFunction(item) ? item(_data) : _.get(_data, item);

				return (value + '').toLowerCase().indexOf(_word) >= 0;
			});
		},

		_getSelection: function () {
			return this._superset.filter(function (item) {
				return item._pl_is_selected;
			});
		},

		_getUnselected: function () {
			return this._superset.filter(function (item) {
				return !item._pl_is_selected;
			});
		},

		_getVisibles: function () {
			return this._superset.filter(function (item) {
				return !item._pl_is_hidden;
			});
		},

		_getHiddens: function () {
			return this._superset.filter(function (item) {
				return item._pl_is_hidden;
			});
		},

		showAll: function () {
			this.ui.showSelection.show();
			this.ui.showAll.hide();

			this._superset.each(function (item) {
				item._pl_is_hidden = false;
			});

			this.collection.refilter();
		},

		showSelection: function () {
			this.ui.showSelection.hide();
			this.ui.showAll.show();

			this._superset.each(function (item) {
				item._pl_is_hidden = !item._pl_is_selected;
			});

			this.collection.refilter();
		},

		selectAll: function () {
			this.collection.each(function (item) {
				selectItem(item, true);
			});
		},

		_deselect: function (items) {
			_.each(items, function (item) {
				selectItem(item, false);
			});
		},

		clearSelection: function () {
			this._deselect(this._getSelection());

			this.showAll();
		},

		getSelection: function () {
			var seleccion = this._getSelection();

			switch (this.getOption('mode'))
			{
				case 'multiple':
					return _.map(seleccion, function (item) {
						return item.toJSON();
					});
				default:
					var _selection = _.first(seleccion);

					return _selection ? _selection.toJSON() : null;
			}
		},

		serializeData: function () {
			return {
				refresh_btn: this.getOption('refreshBtn'),
				title: this.getOption('title'),
				mode: this.getOption('mode'),
				no_filters: this.getOption('filters').length
			};
		}
	});

	return Selector;
});
