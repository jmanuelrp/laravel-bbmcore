define([
	'jquery',
	'msgBus',
	'underscore',
	'backbone',
	'marionette',
	'bmodal'
],

function ($, bus, _, Backbone, Marionette) {

	$.fn.modal.defaults.spinner = $.fn.modalmanager.defaults.spinner =
		'<div class="loading-spinner" style="width: 200px; margin-left: -100px;">' +
			'<div class="progress progress-striped active">' +
				'<div class="progress-bar" style="width: 100%;"></div>' +
			'</div>' +
		'</div>';

	var Modal = Marionette.LayoutView.extend({
		className: 'modal fade',

		attributes: {
			tabindex: '-1',
			role: 'dialog',
			'aria-hidden':'true'
		},

		template: 'core::modal',

		regions: {
			contentRegion: '.modal-main'
		},

		ui: {
			title  : '.modal-title',
			content: '.modal-main',
			footer : '.modal-footer'
		},

		events: {
			'hide': 'onHide',
			'show': 'onShow',
			'click .btn-modal-close': 'close'
		},

		is_show: false,

		onShow: function (bmodal) {
			this.is_show = true;

			this.trigger('show', this);
		},

		onHide: function (bmodal) {
			this.is_show = false;

			this.trigger('hide', this);
		},

		initialize: function (options) {
			options = options || {};

			_.defaults(options, {
				data: {},
				btn_template: 'core::modalButton'
			});

			_.defaults(options.data, {
				title: 'Modal',
				content: '',
				closable: true
			});

			_.extend(this, _.pick(options,
				'data',
				'btn_template',
				'renderButton'
			));

			this.on('add:button set:buttons set:footer set:view', function () {
				if (this.is_show)
				{
					this._delegateEvents();
				}
			});

			this.render();
		},

		setTitle: function (title) {
			this.ui.title.html(title);

			return this;
		},

		setContent: function (content, options) {
			options = options || {};

			_.defaults(options, {
				append: false
			});

			if (_.isArray(content)) {
				content = content.join('');
			}

			if (options.append)
			{
				this._appendContent(content);
			}
			else
			{
				this._setContent(content);
			}

			return this;
		},

		_setContent: function (content) {
			if (content instanceof Backbone.View)
			{
				this.contentRegion.show(content);

				this.trigger('set:view', content);
			}
			else
			{
				this.contentRegion.empty();

				this.ui.content.html(content);

				this.trigger('set:html', content);
			}
		},

		_appendContent: function (content) {
			this.ui.content.append(content);
		},

		setFooter: function (footer) {
			this.events = _.clone(Modal.prototype.events);

			this.ui.footer.html(footer);

			return this;
		},

		setButtons: function (buttons) {
			this.events = _.clone(Modal.prototype.events);

			this.ui.footer.empty();

			_.each(buttons, this._addButton, this);

			this.trigger('set:buttons', buttons);

			return this;
		},

		addButton: function (button) {
			this._addButton(button);

			this.trigger('add:button', button);

			return this;
		},

		_addButton: function (button) {
			_.defaults(button, {
				label: 'button',
				trigger: 'click',
				type: 'default',
				side: 'right',
				class_name: _.uniqueId('modal-btn-'),
				action: function () {}
			});

			var self = this,
				_event = button.trigger + ' .' + button.class_name;

			this.events = _.clone(this.events);
			this.events[_event] = function (e) {
				var xhr = button.action(e, self);

				if (_.isObject(xhr) && _.isFunction(xhr.always))
				{
					self.animateRequest(xhr);
				}
			};

			this._renderButton(button);
		},

		addCloseButton: function (button) {
			button = button || {};

			_.defaults(button, {
				label: 'Cancelar',
				trigger: 'click',
				type: 'default',
				action: function (e, m) {
					m.close();
				}
			});

			return this.addButton(button);
		},

		renderButton: function (button) {
			return bus.template.render(this.btn_template, button);
		},

		_renderButton: function (button) {
			var html;

			if (_.isFunction(button.html) || _.isString(button.html))
			{
				html = _.result(button, 'html');
			}
			else
			{
				html = this.renderButton(button);
			}

			switch (button.side) {
				case 'left': this.ui.footer.prepend(html); break;
				default:     this.ui.footer.append(html);
			}
		},

		serializeData: function () {
			return this.options.data;
		},

		_delegateEvents: function () {
			this.delegateEvents();

			if (this.contentRegion.hasView())
			{
				if (this.contentRegion.currentView.recursiveDelegateEvents)
				{
					this.contentRegion.currentView.recursiveDelegateEvents();
				}
				else
				{
					this.contentRegion.currentView.delegateEvents();
				}
			}
		},

		animateRequest: function (xhr) {
			this._modal.loading();

			xhr.always(_.bind(function () {
				if (this.is_show) {
					this._modal.loading();
				}
			}, this));
		},

		show: function (options) {
			var _modal = this.$el.modal(_.defaults(options || {}, {
				modalOverflow: true
			}));

			this._modal = _modal.data('modal');
			this._delegateEvents();

			return this;
		},

		showStatic: function (options) {
			return this.show(_.defaults(options || {}, {
				backdrop: 'static',
				keyboard: false
			}));
		},

		close: function () {
			return this.$el.modal('hide');
		},

		newInstance: function (options) {
			return new Modal(options || {});
		},

		getClass: function () {
			return Modal;
		}
	});

	return new Modal();
});
