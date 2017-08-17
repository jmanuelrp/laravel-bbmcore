define(['msgBus', 'jquery', 'underscore', 'marionette', 'oscura'], function (bus, $, _, Marionette, Oscura) {

	var Behaviors = {};

	Behaviors.Editable = Marionette.Behavior.extend({
		defaults: {
			autosave: true,
			state: 'show',
			template: {
				show: function () {},
				form: function () {}
			},
			serializeForm: null,
			preventSubmit: false
		},

		ui: {
			'form': 'form',
			btnSave: '.btn-save',
			btnCancel: '.btn-cancel'
		},

		events: {
			'click .btn-edit'	 : 'setEditView',
			'click @ui.btnCancel' : 'setShowView',
			'click @ui.btnSave'   : 'saveEvent',
			'submit @ui.form'	 : 'submitEvent'
		},

		modelEvents: {
			change: 'renderModelView',
			'validated:invalid' : 'showErrorMeesages'
		},

		initialize: function () {
			this.view._be_state = this.getOption('state');

			this.view.on('editable:edit', this.setEditView, this);
			this.view.on('editable:show', this.setShowView, this);
			this.view.on('editable:save', this.performSave, this);
		},

		renderModelView: function () {
			if (! this.view.isDestroyed) {
				this.view.render();
			}
		},

		showErrorMeesages: function (model, errors) {
			bus.alert.validation(errors);
		},

		parseFormValues: function () {
			return this.ui.form.formParams();
		},

		getFormData: function () {
			var serializeForm = this.getOption('serializeForm');

			if (_.isFunction(serializeForm))
			{
				return serializeForm.call(this.view, this.ui.form);
			}

			return this.parseFormValues();
		},

		onBeforeRender: function () {
			this.view.template = this.getTemplate();
			this.view.editableState = this.getOption('state');
		},

		getTemplate: function () {
			var template = this.getOption('template'),
				view_state = this.getOption('state'),
				view_type;

			switch(true) {
				case (_.isString(template)): return template;
				case (! _.isObject(template)): return template || function () {};
				case (_.has(template, view_state)): return template[view_state];
				default:
					view_type = view_state === 'edit' ? 'form' : 'show';

					return template[view_type] || function () {};
			}
		},

		setState: function (state, options) {
			options = _.defaults(options || {}, {
				'silent': false
			});

			if (_.contains(['show','edit'], state))
			{
				this.options.state = state;
				this.view._be_state = state;

				if (options.silent === false &&
					this.view.isDestroyed === false)
				{
					this.view.render();
				}
			}

			return this;
		},

		setEditView: function (e) {
			if (e && e.stopPropagation) { e.stopPropagation(); }

			this.setState('edit');
		},

		setShowView: function (e) {
			if (e && e.stopPropagation) { e.stopPropagation(); }

			this.setState('show');
		},

		saveEvent: function (e) {
			e.stopPropagation();
			e.preventDefault();

			this.performSave();
		},

		submitEvent: function (e) {
			e.stopPropagation();
			e.preventDefault();

			if (! this.getOption('preventSubmit')) {
				this.performSave();
			}
		},

		performSave: function () {
			var data = this.getFormData();

			if (this.getOption('autosave'))
			{
				return this.saveModel(data);
			}

			this.view.triggerMethod(
				'editable:submit',
				data,
				this.loadRequest.bind(this)
			);
		},

		loadRequest: function (xhr) {
			var self = this,
			    html = this.ui.btnSave.html();

			this.ui.btnSave.prop('disabled', true);
			this.ui.btnCancel.prop('disabled', true);

			this.ui.btnSave.html('<i class="fa fa-spinner fa-spin"></i>');

			xhr.done(function () {
				self.setState('show');
			})
			.fail(function (response) {
				bus.alert.response(response);

				self.ui.btnSave.html(html);

				self.ui.btnCancel.prop('disabled', false);
				self.ui.btnSave.prop('disabled', false);
			});
		},

		saveModel: function (data) {
			var xhr = this.view.model.save(data, {
				wait: true
			});

			this.loadRequest(xhr);
		},

		onRender: function () {
			this.view.triggerMethod('render:' + this.getOption('state'));
		}
	});

	Behaviors.Deletable = Marionette.Behavior.extend({
		defaults: {
			confirm: true,
			autodelete: true,
			btn: '.btn-remove',
			title: 'Eliminar',
			label: 'Eliminar',
			content: 'Desea eliminar el elemento seleccionado?',
			msgSuccess: null,
			validation: function () {}
		},

		ui: function () {
			return {
				btnRemove: this.getOption('btn')
			};
		},

		events: {
			'click @ui.btnRemove': 'deleteItemEvent'
		},

		modelEvents: {
			'destroy': 'destroyView'
		},

		initialize: function () {
			this.view.on('deletable:show', this.validateDelete, this);
		},

		destroyView: function () {
			this.view.destroy();
		},

		deleteItemEvent: function (e) {
			e.stopPropagation();

			this.validateDelete();
		},

		validateDelete: function () {
			var errorMsg = this.getOption('validation').call(this.view);

			if (_.isString(errorMsg))
			{
				return bus.alert.error(errorMsg);
			}

			if (this.getOption('confirm'))
			{
				this.showDeleteModal();
			}
			else
			{
				this.performDelete();
			}
		},

		showDeleteModal: function () {
			if (this.deleteModal)
			{
				this.deleteModal.showStatic({ modalOverflow: true });
			}
			else
			{
				require(['modal'], this.createDeleteModal.bind(this));
			}
		},

		getOptionResult: function (option) {
			var value = this.getOption(option);

			if (_.isFunction(value))
			{
				return value.call(this.view, this.view.model);
			}

			return value;
		},

		createDeleteModal: function (modal) {
			this.deleteModal = modal.newInstance({
				data: {
					title: this.getOptionResult('title'),
					closable: false
				}
			})
			.setContent(this.getOptionResult('content'))
			.setButtons([{
				label: this.getOptionResult('label'),
				type: 'danger',
				action: this.performDelete.bind(this)
			}])
			.addCloseButton();

			this.showDeleteModal();
		},

		closeDeleteModal: function () {
			if (this.deleteModal)
			{
				this.deleteModal.close();
			}
		},

		performDelete: function () {
			if (this.getOption('autodelete'))
			{
				return this.deleteModel();
			}

			this.view.triggerMethod(
				'deletable:submit',
				this.loadRequest.bind(this)
			);
		},

		deleteModel: function () {
			var xhr = this.view.model.destroy({
				wait: true
			});

			this.loadRequest(xhr);

			return xhr;
		},

		loadRequest: function (xhr) {
			var self = this,
			    html = this.ui.btnRemove.html(),
			    msg = this.getOptionResult('msgSuccess');

			this.ui.btnRemove.prop('disabled', true);
			this.ui.btnRemove.html('<i class="fa fa-spinner fa-spin"></i>');

			xhr.done(function () {
				self.closeDeleteModal();

				if (self.getOption('confirm') && msg)
				{
					bus.alert.success(msg);
				}
			})
			.fail(function (response) {
				bus.alert.response(response);

				self.ui.btnRemove.html(html);
				self.ui.btnRemove.prop('disabled', false);
			});
		}
	});

	Behaviors.Removable = Behaviors.Deletable.extend({
		defaults: _.extend({},
			Behaviors.Deletable.prototype.defaults, {
			event_name: 'destroy'
		}),

		performDelete: function () {
			if (this.getOption('autodelete'))
			{
				return this.deleteModel();
			}

			this.view.triggerMethod(
				'removable:submit',
				this.loadRequest.bind(this)
			);
		},

		deleteModel: function () {

			var xhr = $.Deferred().resolve();

			this.loadRequest(xhr);

			return xhr;
		},

		loadRequest: function (xhr) {
			Behaviors.Deletable.prototype.loadRequest.call(this, xhr);

			var model = this.view.model,
				event_name = this.getOption('event_name');

			xhr.done(function () {
				model.trigger(event_name, model);
			});
		}
	});

	/**
	 * Dar de alta y baja en elemento
	 *
	 * @param string attribute	 Nombre del atributo a modificar
	 */
	Behaviors.ActivateDeactivate = Marionette.Behavior.extend({
		defaults: {
			// Nombre del atributo
			attribute: null
		},

		ui: {
			btnActivate: '.btn-activate',
			btnDeactivate: '.btn-deactivate'
		},

		events: {
			'click @ui.btnActivate': 'onClickBtnActivate',
			'click @ui.btnDeactivate': 'onClickBtnDeactivate'
		},

		onClickBtnActivate: function (event) {
			this.performUpdate({
				value: true
			});
		},

		onClickBtnDeactivate: function (event) {
			this.performUpdate({
				value: false
			});
		},

		performUpdate: function (options) {
			var attr_name = this.getOption('attribute'),
				data = this.view.model.toJSON();

			_.set(data, attr_name, options.value);

			this.view.model.save(data, {
				wait: true
			})
			.fail(bus.alert.response)
			.done(this.view.render.bind(this.view));
		}
	});

	Behaviors.ButtonValues = Marionette.Behavior.extend({
		ui: {
			btnSetValue: '.btn-set-value'
		},

		events: {
			'click @ui.btnSetValue': 'performUpdate'
		},

		performUpdate: function (event) {
			var data = event.currentTarget.dataset,
			    model_data = {};

			_.set(model_data, data.modelAttribute, data.modelValue);

			this.view.model.save(model_data, {
				wait: true
			})
			.fail(bus.alert.response)
			.done(this.view.render.bind(this.view));
		}
	});

	Behaviors.Form = Marionette.Behavior.extend({
		defaults: {
			autosave: true,
			model: null,
			attrs: {},
			options: {},
			serializeForm: null,
			silent: false,
			validation: function () {},
			listen_submit: true
		},

		ui: {
			'form': 'form',
			btnSave: '.btn-save',
			btnCancel: '.btn-cancel'
		},

		events: function () {
			var events = {
				'click @ui.btnCancel': 'cancelFormEvent',
				'click @ui.btnSave'  : 'saveModelEvent'
			};

			if (this.getOption('listen_submit')) {
				events['submit @ui.form'] = 'saveModelEvent';
			}

			return events;
		},

		cancelFormEvent: function (e) {
			e.stopPropagation();

			this.ui.form.trigger('reset');

			this.view.trigger('form:cancel');
		},

		saveModelEvent: function (e) {
			e.stopPropagation();
			e.preventDefault();

			var data = this.getFormData(),
				errors = this.view.model.preValidate(data);

			if (errors) { return bus.alert.validation(errors); }

			if (this.validateSubmit(data) === false) { return; }

			if (this.getOption('autosave'))
			{
				return this.saveModel(data);
			}

			this.view.triggerMethod(
				'form:submit',
				data,
				this.loadRequest.bind(this)
			);
		},

		loadRequest: function (xhr) {
			var self = this,
			    html = this.ui.btnSave.html();

			this.ui.btnSave.prop('disabled', true);
			this.ui.btnCancel.prop('disabled', true);

			this.ui.btnSave.html('<i class="fa fa-spinner fa-spin"></i>');

			xhr.done(function () {
				var model = self.view.model;

				self.view.trigger('before:form:success', model);

				self.cleanModel();
				self.view.render();

				if (! self.getOption('silent')) {
					self.view.trigger('form:model:save', model);
				}
			})
			.fail(function (response) {
				bus.alert.response(response);

				self.ui.btnSave.html(html);

				self.ui.btnCancel.prop('disabled', false);
				self.ui.btnSave.prop('disabled', false);
			});
		},

		saveModel: function (data) {
			var self = this;

			var xhr = this.view.model.save(data, {
				wait: true,
				validate: false
			});

			this.view.trigger('form:send:request', xhr);

			this.loadRequest(xhr);
		},

		validateSubmit: function (data) {
			var errorMsg = this.getOption('validation').call(this.view, data),
				has_error = _.isString(errorMsg);

			if (has_error)
			{
				bus.alert.error(errorMsg);
			}

			return !has_error;
		},

		parseFormValues: function () {
			return this.ui.form.formParams();
		},

		getFormData: function () {
			var serializeForm = this.getOption('serializeForm');

			if (_.isFunction(serializeForm))
			{
				return serializeForm.call(this.view, this.ui.form);
			}

			return this.parseFormValues();
		},

		onBeforeRender: function () {
			if (! this.view.model)
			{
				this.cleanModel();
			}
		},

		cleanModel: function () {
			var Model	= this.getOption('model'),
				attrs	= this.getOptionResult('attrs'),
				options  = this.getOptionResult('options');

			this.view.model = new Model(attrs, options);
		},

		getOptionResult: function (option) {
			var value = this.getOption(option);

			if (_.isFunction(value))
			{
				return value.call(this.view);
			}

			return value;
		}
	});

	Behaviors.Filterable = Marionette.Behavior.extend({
		defaults: {
			input: '.inp-search',
			source: 'collection',
			output: null,
			filter_name: 'search',
			filters: []
		},

		ui: function () {
			return {
				inpSearch: this.getOption('input')
			};
		},

		events: {
			'change @ui.inpSearch': 'onChangeSearch'
		},

		initialize: function (options, view) {
			var source_name = this.getOption('source'),
				source = view.options[source_name] || view[source_name],
				output_name = this.getOption('output') || source_name;

			this.proxy_collection = (source instanceof Oscura) ?
				source : new Oscura(source);

			view[output_name] = this.proxy_collection
				.filterBy(this.getOption('filter_name'), this._searchFilter.bind(this));
		},

		onChangeSearch: function (e) {
			this.search_word = this.ui.inpSearch.val();

			this.proxy_collection.refilter();
		},

		_searchFilter: function (model) {
			if (_.isEmpty( this.search_word )) { return true; }

			var _word = this.search_word.toLowerCase(),
			    _data = model.toJSON();

			return _.some(this.getOption('filters'), function (item) {
				var value = _.isFunction(item) ? item(_data) : _.get(_data, item);

				return (value + '').toLowerCase().indexOf(_word) >= 0;
			});
		},
	});

	Behaviors.Reloadable = Marionette.Behavior.extend({
		defaults: {
			collection: 'collection',
			options: {},
			spinClass: 'zmdi-hc-spin'
		},

		ui: {
			'btnReload': '.btn-reload',
			'btnIcon': '.btn-reload>.zmdi'
		},

		events: {
			'click @ui.btnReload': 'reloadCollectionEvent'
		},

		reloadCollectionEvent: function (e) {
			e.stopPropagation();

			var self	   = this,
				collection = this.getOptionResult('collection'),
				options	= this.getOptionResult('options'),
				spinClass = this.getOption('spinClass');

			options = _.defaults(options || {}, {
				cache: false
			});

			this.ui.btnIcon.addClass(spinClass + ' text-primary');

			this.view[collection].fetch(options)
			.always(function () {
				self.ui.btnIcon.removeClass(spinClass + ' text-primary');
			});
		},

		getOptionResult: function (option) {
			var value = this.getOption(option);

			if (_.isFunction(value))
			{
				return value.call(this.view);
			}

			return value;
		}
	});

	Behaviors.Row = Marionette.Behavior.extend({
		ui: {
			panel: '.rpanel',
			detail: '.rp-body',
			btnDetail: '.btn-toggle-details',
			actions: '.rp-buttons',
			btnActions: '.btn-show-actions'
		},

		events: function () {
			var events = {
				'click @ui.btnDetail': 'toggleDetailsEvent',
				'click @ui.btnActions': 'toggleActionsEvent'
			};

			if (this.getOption('clickable')) {
				events['click .rp-toolbar'] = 'onClickToolbar';
			}

			return events;
		},

		onClickToolbar: function (e) {
			var panel = this.ui.panel.addClass('pulse');

			setTimeout(function () {
				panel.removeClass('pulse');
			}, 1200);

			this.view.triggerMethod('click:row', e, this.view);
		},

		toggleDetailsEvent: function (e) {
			e.stopPropagation();

			this.ui.detail.slideToggle();

			var btn = this.ui.btnDetail.find('.zmdi')
				.toggleClass('zoomIn zmdi-plus zmdi-minus');

			setTimeout(function () {
				btn.removeClass('zoomIn');
			}, 1200);

			this.view.trigger('toggle:details');
		},

		toggleActionsEvent: function (e) {
			e.stopPropagation();

			this.ui.actions.slideToggle();

			var btn = this.ui.btnActions.find('.zmdi')
				.toggleClass('rotateFlat zmdi-menu zmdi-close');

			setTimeout(function () {
				btn.removeClass('rotateFlat');
			}, 1200);
		}
	});

	Behaviors.Tooltips = Marionette.Behavior.extend({
		defaults: {
			placement: 'top'
		},

		ui: {
			tooltips: '[data-toggle="tooltip"]'
		},

		onRender: function () {
			this.ui.tooltips.tooltip({
				placement: this.getOption('placement')
			});
		}
	});

	Behaviors.ToggleRegions = Marionette.Behavior.extend({
		defaults: {
			active: null,
			regions: []
		},

		events: {
			'click .btn-toggle-region' : 'onClickBtnToggle'
		},

		onClickBtnToggle : function (e) {
			var data = e.currentTarget.dataset,
				region_name = data.region,
				regions = this.getOption('regions');

			_.forEach(regions, function (name) {
				if (region_name == name) {
					this.setActiveRegion(name);
				} else {
					this.setInactiveRegion(name);
				}
			}, this);
		},

		setActiveRegion: function (name) {
			var region = this.view.getRegion(name);

			if (region) {
				this.view.trigger('before:show:'+name, region);
				region.$el.fadeIn();
				this.view.trigger('show:'+name, region);

				this.view.trigger('toggleregion:active', name, region);
			}
		},

		setInactiveRegion: function (name) {
			var region = this.view.getRegion(name);

			if (region) {
				region.$el.hide();
				this.view.trigger('hide:'+name, region);
			}
		},

		onRender: function () {
			var active_region = this.getOption('active');

			if (active_region) {
				this.setActiveRegion(active_region);
			}
		}
	});

	var GREEN_COLOR = '#26A65B',
		RED_COLOR = '#EB9532',
		DEFAULT_COLOR = '#EBEBEB';

	Behaviors.Selectable = Marionette.Behavior.extend({
		defaults: {
			checkbox: '[data-toggle="checkrow"]',
			header: '>.rpanel',
			item: 'model'
		},

		ui: function () {
			return {
				'checkbox': this.getOption('checkbox'),
				'header': this.getOption('header')
			};
		},

		events: {
			'change @ui.checkbox' : 'onChangeCheckbox'
		},

		initialize: function (options) {
			this.item = this.view.options[this.getOption('item')];

			this.listenTo(this.item, 'select', this.onItemSelectionToggle);
			this.listenTo(this.item, 'select:wrong', this.onItemSelectionWrong);
			this.listenTo(this.item, 'select:ok', this.onItemSelectionOk);
			this.listenTo(this.item, 'destroy', function (item) {
				item.trigger('select', item, false);
			});

			this.on('render', this.changeBorderColor);
		},

		onItemSelectionToggle: function (item, is_checked) {
			this.item.is_checked = is_checked;
			this.ui.checkbox.prop('checked', is_checked);

			this.changeBorderColor();
		},

		onChangeCheckbox : function (e) {
			var is_checked = this.ui.checkbox.is(':checked');

			if (this.item.is_checked !== is_checked)
			{
				this.item.trigger('select', this.item, is_checked);
			}
		},

		onItemSelectionWrong: function () {
			this.item.selection_is = false;

			this.setBorderColor(RED_COLOR);
		},

		onItemSelectionOk: function () {
			this.item.selection_is = true;

			this.setBorderColor(GREEN_COLOR);
		},

		changeBorderColor: function () {
			this.setBorderColor(this.item.is_checked ? GREEN_COLOR : DEFAULT_COLOR);
		},

		setBorderColor: function (color) {
			this.ui.header.css('border-color', color);
		}
	});

	Behaviors.FileInputPreview = Marionette.Behavior.extend({
		ui: {
			fileinput: 'input[type="file"]'
		},

		events: {
			'change @ui.fileinput': 'onChangeFile'
		},

		onChangeFile: function (e) {
			var input = e.currentTarget;

			if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = _.bind(function (e) {
					this.$el
						.find(input.dataset.appendto)
						.attr('src', e.target.result);
				}, this);

				reader.readAsDataURL(input.files[0]);
			}
		}
	});

	Behaviors.Pagination = Marionette.Behavior.extend({
		defaults: {
			page_radio: 3,
			per_page: 10,
			source: 'collection',
			output: null,
			region: 'paginationRegion',
			items_name: null
		},

		initialize: function (options, view) {
			var source_name = this.getOption('source'),
			    source = view.options[source_name] || view[source_name],
			    output_name = this.getOption('output') || source_name;

			this.proxy_collection = source instanceof Oscura ?
				source : new Oscura(source);

			view[output_name] = this.proxy_collection
				.setPerPage(this.getOption('per_page'));
		},

		onRender: function () {
			var self = this,
			    region_name = this.getOption('region'),
			    region = this.view.getRegion(region_name);

			if (! region) {
				this.view.addRegion(region_name, '.pagination-region');
				region = this.view.getRegion(region_name);
			}

			require(['core/views/paginationControls'], function (Pagination) {
				region.show(new Pagination({
					collection: self.proxy_collection,
					page_radio: self.getOption('page_radio'),
					items_name: self.getOption('items_name')
				}));
			});
		}
	});

	Behaviors.Creationable = Marionette.Behavior.extend({
		defaults: {
			collection: 'collection',
			collectionView: 'collectionView',
			formView: 'formView',
			formRegion: 'formRegion',
			collectionRegion: 'collectionRegion',
			btnAdd: '.btn-new',
			title: 'Nuevo',
			modal: false
		},

		ui: function () {
			return {
				btnAdd: this.getOption('btnAdd')
			};
		},

		events: {
			'click @ui.btnAdd' : 'onClickBtnAddEvent'
		},

		onShow: function () {
			this.showCollectionView();
			this.renderFormView();
		},

		showCollectionView: function () {
			var collection_view_name = this.getOption('collectionView'),
				collection_view = this.view[collection_view_name];

			if (collection_view) {
				var region_name = this.getOption('collectionRegion');

				this.view[region_name].show(collection_view);
			}
		},

		renderFormView: function () {
			var form_view_name = this.getOption('formView'),
				form_view = this.view[form_view_name];

			if (! form_view) { return; }

			if (this.getOption('modal')) {
				this.setViewModal(form_view);
			} else {
				var region_name = this.getOption('formRegion');

				this.view[region_name].show(form_view);
			}

			this.listenFormView(form_view);
		},

		setViewModal: function (form_view) {
			var self = this;

			require(['modal'], function (modal) {
				self.formModal = modal.newInstance({
					data: {
						title: self.getOption('title'),
						hide_footer: true
					}
				})
				.setContent(form_view);

				self.listenTo(form_view, 'form:cancel form:model:save', function () {
					self.formModal.close();
				});
			});
		},

		onClickBtnAddEvent: function (e) {
			e.stopPropagation();

			if (this.getOption('modal') && this.formModal) {
				this.formModal.show();

				setTimeout(_.bind(function () {
					this.formModal.$("input:text:visible:first").focus();
				}, this), 500);
			} else {
				this.showFormRegion();
			}
		},

		showFormRegion: function () {
			var region_name = this.getOption('formRegion'),
				$el = this.view[region_name].$el;

			$el.slideDown();
			$el.find("input:text:visible:first").focus();
		},

		hideFormRegion: function () {
			var region_name = this.getOption('formRegion');

			this.view[region_name].$el.slideUp();
		},

		listenFormView: function (form_view) {
			this.stopListening(form_view);

			this.listenTo(form_view, 'form:cancel', function () {
				this.hideFormRegion();
			});

			this.listenTo(form_view, 'form:model:save', function (model) {
				this.hideFormRegion();

				this.addModel(model);
			});
		},

		addModel: function (model) {
			var collection_name = this.getOption('collection'),
			    collection = this.view[collection_name];

			if (collection) {
				collection.add(model);
			}
		}
	});

	Behaviors.FormModal = Marionette.Behavior.extend({
		defaults: {
			FormView: null,
			btnAction: '.btn-edit',
			title: 'Editar',
			eventName: 'update:model',
			formOptions: function () {
				return {
					model: this.model
				};
			}
		},

		ui: function () {
			return {
				btnAction: this.getOption('btnAction')
			};
		},

		events: {
			'click @ui.btnAction' : 'onClickBtnEdit'
		},

		renderFormView: function () {
			var FormView = this.getOption('FormView'),
			    options = this.getOptionResult('formOptions');

			var form_view = new FormView(options);

			this.setViewModal(form_view);
		},

		setViewModal: function (form_view) {
			var self = this;

			require(['modal'], function (modal) {
				var _modal = modal.newInstance({
					data: {
						title: self.getOptionResult('title'),
						hide_footer: true
					}
				})
				.setContent(form_view)
				.show();

				self.listenTo(form_view, 'form:cancel', function () {
					_modal.close();
				});

				self.listenTo(form_view, 'form:model:save', function (model) {
					_modal.close();

					this.view.render();

					this.view.trigger(this.getOption('eventName'), model);
				});

				setTimeout(function () {
					_modal.$("input:text:visible:first").focus();
				}, 500);
			});
		},

		onClickBtnEdit: function (e) {
			e.stopPropagation();

			this.renderFormView();
		},

		getOptionResult: function (option) {
			var value = this.getOption(option);

			if (_.isFunction(value))
			{
				return value.call(this.view);
			}

			return value;
		}
	});

	return Behaviors;
});
