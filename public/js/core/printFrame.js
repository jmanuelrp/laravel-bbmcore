define([], function () {

	var iframe;

	return function (url) {
		if (! iframe) {
			iframe = iframe = document.createElement('iframe');

			document.body.appendChild(iframe);
			iframe.style.display = 'none';
			iframe.onload = function () {
				setTimeout(function () {
					iframe.focus();
					iframe.contentWindow.print();
				}, 1);
			};
		}

		iframe.src = url;
	};

});
