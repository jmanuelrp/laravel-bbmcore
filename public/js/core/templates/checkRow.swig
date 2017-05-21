{% if check_row == 1 %}
	<input class="check_row form-control" type="checkbox" data-uid="{{uid}}" data-id="{{id}}" checked />
{% else %}
	<input class="check_row form-control" type="checkbox" data-uid="{{uid}}" data-id="{{id}}"/>
{% endif %}