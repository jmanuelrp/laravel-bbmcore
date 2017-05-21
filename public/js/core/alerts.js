define(['underscore', 'messflat'], function (_) {

	window.Messenger.options = {
		extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
		theme: 'flat'
	};

	function showAlert(options) {
		return window.Messenger().post(options);
	}

	function alertError(message) {
		return showAlert({
			message: message,
			type: 'error',
			showCloseButton: true
		});
	}

	function alertInfo(message) {
		return showAlert({
			message: message,
			type: 'info',
			showCloseButton: true
		});
	}

	function alertSuccess(message) {
		return showAlert({
			message: message,
			type: 'success',
			showCloseButton: true
		});
	}

	function getMessages(response) {
		var errors = response.error;
			messages = [];

		if (_.isString(errors))
		{
			messages.push(errors);
		}
		else if(_.isArray(errors))
		{
			messages = errors;
		}
		else if(_.isObject(errors) && errors.message)
		{
			messages.push(errors.message);
		}
		else if(_.isObject(errors))
		{
			_.each(errors, function (value) {
				if (_.isArray(value))
				{
					messages = messages.concat(_.flatten(value));
				}
				else if (_.isString(value))
				{
					messages.push(value);
				}
			});
		}

		return messages;
	}

	function alertErrors(response) {
		_.each(getMessages(response), alertError);
	}

	function alertErrorResponse(response) {
		if (_.isUndefined(response)) return;

		if (_.isObject(response) && response.responseText)
		{
			response = JSON.parse(response.responseText);
		}
		else if (_.isString(response))
		{
			response = JSON.parse(response);
		}

		if (response.error || response.success)
		{
			alertErrors(response);
		}
	}

	function alertErrorModelResponse(model, response) {
		alertErrorResponse(response);
	}

	function alertErrorCollectonResponse(collection, response) {
		alertErrorResponse(response);
	}

	function alertValidationErrors(errors) {
		_.each(errors, alertError);
	}

	return {
		errors     : alertErrors,
		error      : alertError,
		success    : alertSuccess,
		info       : alertInfo,
		response   : alertErrorResponse,
		model      : alertErrorModelResponse,
		collection : alertErrorCollectonResponse,
		show       : showAlert,
		validation : alertValidationErrors,
		get        : getMessages
	};

});
