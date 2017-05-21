<div class="rpanel rpanel-show">
	<div class="rp-header">
		<div class="rp-toolbar clearfix">
			<div class="rp-tool-right pull-right">
				{% block buttons %}
					<button class="btn btn-sm btn-success btn-new" type="button">
						Agregar
					</button>
				{% endblock %}
			</div>
			<div class="rp-tool-body">
				<div class="rp-title">
					{% block title %}
						<b>{{ic_title}}</b>
					{% endblock %}
				</div>
			</div>
		</div>
	</div>
</div>
{% block content-container %}
	{% block form %}
		<div class="ic-form-container item-hidden"></div>
	{% endblock %}
	{% block content-header %}
	{% endblock %}
	{% block content %}
		<div class="ic-main-container"></div>
	{% endblock %}
	{% block content-footer %}
		<div class="ic-pagination-region"></div>
	{% endblock %}
{% endblock %}
