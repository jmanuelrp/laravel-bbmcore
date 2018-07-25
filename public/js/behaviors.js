define([
	'msgBus',
	'jquery',
	'underscore',
	'marionette',
	'core/behaviors',
	'oscura',
	'moment'
], function (bus, $, _, Marionette, Behaviors, Oscura, moment) {

	Behaviors.MaterialForm = Marionette.Behavior.extend({
		ui: {
			fgline: '.fg-line',
			fgfloat: '.fg-float'
		},

		onRender: function () {
			if (this.ui.fgline[0]) {
				this.ui.fgline.on('focus', '.form-control', this.onFocusFormControl);
				this.ui.fgline.on('blur', '.form-control', this.onBlurFormControl);
			}

			if (this.ui.fgfloat[0]) {
				this.ui.fgfloat.find('.form-control').each(function () {
					var $this = $(this);
					var i = $this.val();

					if (i.length !== 0) {
						$this.closest('.fg-line').addClass('fg-toggled');
					}
				});
			}
		},

		onFocusFormControl: function (e) {
			$(e.currentTarget).closest('.fg-line').addClass('fg-toggled');
		},

		onBlurFormControl: function (e) {
			var $this = $(e.currentTarget);
			var p = $this.closest('.form-group, .input-group');

			if (p.hasClass('fg-float')) {
				var i = p.find('.form-control').val();

				if (i.length === 0) {
					$this.closest('.fg-line').removeClass('fg-toggled');
				}
			}
			else {
				$this.closest('.fg-line').removeClass('fg-toggled');
			}
		}
	});

	Behaviors.Deletable = Behaviors.Deletable.extend({
		defaults: {
			confirm: true,
			autodelete: true,
			btn: '.btn-remove',
			title: 'Eliminar',
			label: 'Eliminar',
			btnType: 'danger',
			closeLabel: 'Cancelar',
			content: 'Desea eliminar el elemento seleccionado?',
			msgSuccess: null,
			validation: function () {}
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
				type: this.getOptionResult('btnType') +' waves-effect',
				action: this.performDelete.bind(this)
			}])
			.addCloseButton({
				label: this.getOptionResult('closeLabel'),
				side: 'left',
				type: 'success btn-link waves-effect'
			});

			this.showDeleteModal();
		}
	});

	Behaviors.Chosen = Marionette.Behavior.extend({
		ui: {
			selectors: '.slt-chosen'
		},

		onShow: function () {
			this.ui.selectors.chosen({
				//
			});

			console.log(this.ui.selectors);
		}
	});

	Behaviors.BindigAttributes = Marionette.Behavior.extend({
		ui: {
			item: 'input[data-binding]'
		},

		events: {
			'change @ui.item': 'onChangeItem'
		},

		onChangeItem: function (e) {
			var item = e.currentTarget,
			    model_name = item.dataset.binding || 'model',
			    attr_name = item.dataset.attrname || item.name,
			    item_type = _.get(item, 'attributes.type.value'),
			    item_value;

			switch (item_type) {
				case 'checkbox':
					item_value = item.checked;
					break;
				default:
					item_value = item.value;
			}

			this.view[model_name].set(attr_name, item_value);
		}
	});

	Behaviors.FetchCalendar = Marionette.Behavior.extend({
		defaults: {
			range_type: 'month',
			format: 'LL'
		},

		ui: {
			btnCalendar: '.btn-calendar',
			lblDates: '.lbl-dates'
		},

		events: {
			'click .btn-next-range': 'nextRange',
			'click .btn-back-range': 'backRange'
		},

		onBeforeRender: function () {
			var range = this.getRange(moment());

			this.start_date = this.view.start_date || range.start_date;
			this.end_date = this.view.end_date || range.end_date;
		},

		getRange: function (date) {
			var start_date = date.clone(),
				end_date = date.clone();

			switch (this.getOption('range_type')) {
				case 'day':
					start_date.startOf('day');
					end_date.endOf('day');
					break;
				case 'week':
					start_date.startOf('week');
					end_date.endOf('week');
					break;
				case 'year':
					start_date.startOf('year');
					end_date.endOf('year');
					break;
				case 'fortnight':
					var _date = date.clone().startOf('month');

					if (date.diff(_date, 'days') < 14) {
						start_date = _date;
						end_date = _date.clone().add(13, 'days').endOf('day');
					} else {
						start_date = _date.clone().add(14, 'days');
						end_date.endOf('month');
					}
					break;
				default:
				case 'month':
					start_date.startOf('month');
					end_date.endOf('month');
			}

			return {
				start_date: start_date,
				end_date: end_date
			};
		},

		nextRange: function () {
			var range_type = this.getOption('range_type');

			range_type = (range_type == 'fortnight') ? 'day' : range_type;

			this.setRange(this.end_date.add(1, range_type));
		},

		backRange: function () {
			var range_type = this.getOption('range_type');

			range_type = (range_type == 'fortnight') ? 'day' : range_type;

			this.setRange(this.start_date.subtract(1, range_type));
		},

		setRange: function (date) {
			var range = this.getRange(date);

			this.triggerDateRange(range.start_date, range.end_date);
		},

		triggerDateRange: function (start_date, end_date) {
			this.start_date = start_date;
			this.end_date = end_date;

			this.updateDateTitle();

			this.view.trigger('change:daterange', start_date, end_date);
		},

		updateDateTitle: function () {
			var format = this.getOption('format'),
				start_date = this.start_date.format(format),
				end_date = this.end_date.format(format);

			if (start_date == end_date) {
				this.ui.lblDates.text(start_date);
			} else {
				this.ui.lblDates.text(start_date+' - '+end_date);
			}
		},

		onRender: function () {
			this.ui.btnCalendar.daterangepicker({
				ranges: {
					'Hoy': [moment().startOf('day'), moment().endOf('day')],
					'Ayer': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
					'Esta semana': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
					'Ultimos 7 dias': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
					'Ultimos 30 dias': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
					'Este mes': [moment().startOf('month'), moment().endOf('month')],
					'El mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
				},
				locale: {
					applyLabel: 'Aplicar',
					cancelLabel: 'Cancelar',
					customRangeLabel: 'Personalizado'
				},
				timePicker: true,
				timePickerIncrement: 5,
				opens: 'right',
				buttonClasses: ['btn btn-default'],
				applyClass: 'btn-sm btn-success',
				cancelClass: 'btn-sm btn-link',
				startDate: this.start_date,
				endDate: this.end_date
			}, this.triggerDateRange.bind(this));

			this.updateDateTitle();
		}
	});


	return Behaviors;

});
