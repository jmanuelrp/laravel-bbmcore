define(['numeraljs'], function (numeral) {

	numeral.language('es-MX',{
		delimiters: {
			thousands: ',',
			decimal: '.'
		},
		abbreviations: {
			thousand: 'k',
			million: 'm',
			billion: 'b',
			trillion: 't'
		},
		ordinal: function (number) {
			var b = number % 10;
			return (b === 1 || b === 3) ? 'er' :
				(b === 2) ? 'do' :
					(b === 7 || b === 0) ? 'mo' :
						(b === 8) ? 'vo' :
							(b === 9) ? 'no' : 'to';
		},
		currency: {
			symbol: '$'
		}
	});
	numeral.language('es-MX');

	return numeral;
});