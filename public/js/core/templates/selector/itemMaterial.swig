<div class="checkbox pull-left">
	<label class="btn-selector">
		{% if selected == 1 %}
			<input class="chk-selector" type="checkbox" checked="checked">
		{% else %}
			<input class="chk-selector" type="checkbox">
		{% endif %}
		<i class="input-helper"></i>
	</label>
</div>
<div class="media-body">
	{% set _itemTemplate = '../' + itemTemplate + '.swig' %}
	{% include _itemTemplate with item only %}
</div>
