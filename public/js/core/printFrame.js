define([], function () {

	var iframe;

	function printOnFrame (url) {
		if (! iframe) {
			iframe = iframe = document.createElement('iframe');

			document.body.appendChild(iframe);
			iframe.style.display = 'none';
			iframe.onload = function () {
				setTimeout(function () {
					iframe.focus();
					iframe.contentWindow.print();
				}, 1000);
			};
		}

		iframe.src = url;
	}

	function printOnTab(url) {
		window.open(url).focus();
	}

	return printOnTab;

});
