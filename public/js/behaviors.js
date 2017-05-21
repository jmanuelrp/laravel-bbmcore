define([
	'msgBus',
	'jquery',
	'underscore',
	'marionette',
	'core/behaviors',
	'oscura'
], function (bus, $, _, Marionette, Behaviors, Oscura) {

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
				type: 'danger waves-effect',
				action: this.performDelete.bind(this)
			}])
			.addCloseButton({
				side: 'left',
				type: 'success btn-link waves-effect'
			});

			this.showDeleteModal();
		}
	});

	return Behaviors;

});
