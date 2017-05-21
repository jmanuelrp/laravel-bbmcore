define([
	'msgBus',
	'underscore',
	'backbone',
	'oscura',
	'core/app',
	'core/views/paginationControls'
],

function (bus, _, Backbone, Oscura, App, PControls) {

	var _events = _.extend({}, Backbone.Events);

	function selectItem (item, is_selected) {
		item._pl_is_selected = is_selected;

		item.trigger('selector:selected', is_selected, item);
	}

	var ModelView = App.ItemView.extend({
		className: function () {
			return 'pep-list-item ' + (this.model._pl_is_selected ? 'pli-selected' : '');
		},

		template: 'core::selector/item',

		ui: {
			selectorBtn: '.pli-selector',
			expandBtn: '.pli-expand',
			content: '.panel-body'
		},

		events: {
			'click @ui.selectorBtn': 'onClickBtnSelect',
			'click @ui.expandBtn': 'onClickBtnExpand'
		},

		modelEvents: {
			'selector:selected': 'onSelectItem'
		},

		initialize: function (options) {
			this.itemTemplate = options.itemTemplate;
		},

		onClickBtnSelect: function () {
			var is_selected = !this.model._pl_is_selected;

			selectItem(this.model, is_selected);
		},

		onClickBtnExpand: function (e) {
			e.preventDefault();
			e.stopPropagation();

			this.ui.content.slideToggle();

			this.ui.expandBtn.find('.fa')
				.toggleClass('fa-plus fa-minus');
		},

		onSelectItem: function (is_selected, item) {
			if (is_selected)
			{
				this.$el.addClass('pli-selected');
			}
			else
			{
				this.$el.removeClass('pli-selected');
			}
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

		childViewOptions: function () {
			return {
				itemTemplate: this.itemTemplate
			};
		},

		initialize: function (options) {
			this.itemTemplate = options.itemTemplate;
		}
	});

	var Selector = App.LayoutView.extend({
		template: 'core::selector/selector',

		className: 'pep-selector',

		regions: {
			mainRegion: '.pl-container-region',
			paginationRegion: '.pl-pagination-region'
		},

		ui: {
			lbl_count: '.pl-lbl-count',
			inp_search: '.pl-inp-search',
			show_selection: '.pl-show-selection',
			show_all: '.pl-show-all',
			select_all: '.pl-select-all',
			clear_selection: '.pl-clear-selection',
			pagination: '.pl-pagination'
		},

		events: {
			'keyup @ui.inp_search': 'onChangeSearchbox',
			'change @ui.inp_search': 'onChangeSearchbox',
			'click @ui.show_selection': 'showSelection',
			'click @ui.show_all': 'showAll',
			'click @ui.select_all': 'selectAll',
			'click @ui.clear_selection': 'clearSelection'
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
				itemTemplate: this.getOption('itemTemplate')
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
			this._updateLblCount();
		},

		_updateLblCount: function (count) {
			if (_.isUndefined(count))
			{
				count = this._getSelection().length;
			}

			this.ui.lbl_count.text(count);
		},

		onRender: function () {
			this.renderCollection();

			this.ui.show_all.hide();
		},

		onSelectItem: function (is_selected, item) {
			var selection = this._getSelection();

			this.trigger('selection:change', item, is_selected);

			this._updateLblCount(selection.length);

			if (is_selected && this.getOption('mode') !== 'multiple')
			{
				this._deselect(_.filter(selection, function (_item) {
					return _item.cid !== item.cid;
				}));
			}
		},

		clean: function() {
			this.clearSelection();

			this.ui.inp_search.val('');
			this.collection.refilter();
		},

		onChangeSearchbox: function () {
			this.collection.refilter();
		},

		focusSearch: function () {
			this.ui.inp_search.focus();
		},

		_searchFilter: function (model) {
			var search_word = this.ui.inp_search.val();

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
			this.ui.show_selection.show();
			this.ui.show_all.hide();

			this._superset.each(function (item) {
				item._pl_is_hidden = false;
			});

			this.collection.refilter();
		},

		showSelection: function () {
			this.ui.show_selection.hide();
			this.ui.show_all.show();

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
				mode: this.getOption('mode'),
				no_filters: this.getOption('filters').length
			};
		}
	});

	return Selector;
});
