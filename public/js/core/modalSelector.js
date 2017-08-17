define([
	'underscore',
	'backbone',
	'modal'
], function (_, Backbone, modal) {

	var ModalSelector = function (selector, options) {
		this.selector = selector;
		this.options = options || {};

		this.event_name = this.options.event_name || 'selector:select';

		this.modal = modal.newInstance({
			template: 'core::modalSelector'
		});
	};

	_.extend(ModalSelector.prototype, Backbone.Events, {
		show: function (options) {
			options = options || {};

			if (! this._modal_created) {
				this._createSelector();
			}

			if (this.options.show_clean) {
				this.selector.clean();
			}

			this.modal.showStatic(_.defaults(options, {
				keyboard: true
			}));

			this.selector.focusSearch();

			return this;
		},

		_createSelector: function () {
			this.modal.setContent(this.selector);

			if (! this.options.autoselect) {
				this.modal
					.setButtons([{
						label: 'Seleccionar',
						type: 'success',
						action: this.onClickSelectBtn.bind(this)
					}]);
			} else {
				this.listenTo(this.selector, 'selection:change', this.onSelectionChange);
			}

			this.modal.addCloseButton({
				label: 'Cerrar',
				type: 'link'
			});

			if (this.options.hide_footer) {
				this.modal.ui.footer.hide();
			}

			this._modal_created = true;
			this.trigger('create:modal', this.modal);
		},

		onSelectionChange: function (item, is_selected) {
			if (is_selected) {
				this.triggerItem(item);
			}
		},

		triggerItem: function (item) {
			this.trigger(this.event_name, item.toJSON(), this.modal);
		},

		onClickSelectBtn: function () {
			var selection = this.selector.getSelection();

			this.trigger(this.event_name, selection, this.modal);
		},

		fetchIfEmpty: function (options) {
			return this.selector.fetchIfEmpty(options);
		},

		fetch: function (options) {
			return this.selector.fetch(options);
		},

		clearSelection: function () {
			this.selector.clean();
		},

		setEventName: function (event_name) {
			this.event_name = event_name;

			return this;
		},

		getSelection: function () {
			return this.selector.getSelection();
		},

		setSelector: function (selector) {
			if (this.options.autoselect) {
				this.stopListening(this.selector);

				this.listenTo(selector, 'selection:change', this.onSelectionChange);
			}

			this.selector = selector;

			if (this._modal_created) {
				this.modal.setContent(selector);
			}

			return this;
		}
	});

	return ModalSelector;

});
