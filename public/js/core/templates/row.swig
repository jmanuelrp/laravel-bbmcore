<div class="prow row">

<div class="prow-single col-xs-12">
<div class="row prow-resume">
	<div class="prow-selector col-xs-1">
		{% if not hide_details %}
			<div class="btn-details pull-left tool-toggle-details">
				<span class="glyphicon glyphicon-plus-sign"></span>
			</div>
		{% endif %}
		{% if selectable %}
			{% block selector %}
			<div class="btn-checkrow pull-right">
				<input type="checkbox" data-id="{{id}}">
			</div>
			{% endblock %}
		{% endif %}
	</div>

	<div class="prow-title col-xs-8">
		{% block title %}{% endblock %}
	</div>

	<div class="prow-options col-xs-3">
		<div class="pull-right">
			<div class="btn-group btn-group-sm">
				{% block actions %}{% endblock %}
			</div>
			<div class="btn-group btn-group-sm btn-links">
				{% block links %}{% endblock %}
			</div>
		</div>
	</div>
</div>
</div>

{% if hidden or id %}
<div class="prow-details prow-hidden col-xs-12 rp-body">
{% else %}
<div class="prow-details col-xs-12">
{% endif %}
<div class="row">
	<div class="prow-detail-container">
		{% block content %}{% endblock %}
	</div>
</div>
</div>

</div>
