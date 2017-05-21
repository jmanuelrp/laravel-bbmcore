define(['fecha'], function (fecha) {

	fecha.i18n = {
		dayNamesShort: [
			'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'
		],
		dayNames: [
			'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'
		],
		monthNamesShort: [
			'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
		],
		monthNames: [
			'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
		],
		amPm: ['am', 'pm'],
		DoFn: function (D) {
			switch (D % 10) {
				case 0: case 7: return D + 'mo';
				case 1: case 3: return D + 'ro';
				case 2: return D + 'do';
				case 8: return D + 'vo';
				case 9: return D + 'no';
				default: return D + 'to';
			}
		}
	};

	fecha.masks = {
		'default':    'DD-MM-YYYY',
		shortDate:    'D-M-YY',
		mediumDate:   'D MMM YYYY',
		longDate:     'D MMMM YYYY',
		dateTime:     'D MMMM YYYY hh:mm a',
		fullDate:     'dddd D "de" MMMM "de" YYYY',
		fullDateTime: 'dddd D "de" MMMM "de" YYYY "a las" hh:mm a',

		esShortTime:  'hh:mm a',
		esMediumTime: 'hh:mm:ss a',
		esLongTime:   'hh:mm:ss.SSS a',

		enShortTime:  'HH:mm',
		enMediumTime: 'HH:mm:ss',
		enLongTime:   'HH:mm:ss.SSS',
		enDateTime:   'YYYY-MM-DD hh:mm:ss',

		date: 'YYYY-MM-DD',
	};

	return fecha;
});
