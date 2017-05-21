{% if not fullbox %}
	<div class="col-md-4 col-sm-6 layout-item">
{% else %}
	<div class="layout-item">
{% endif %}
	<article class="panel panel-flat">
		<div class="panel-heading">
			<div class="btn-group btn-group-xs pull-right">
				{% block actions %}
				{% endblock %}
			</div>
			{% block title %}
				{% if id %}
					Editar
				{% else %}
					Nuevo
				{% endif %}
			{% endblock %}
		</div>
		<div class="panel-body">
			{% block content %}
			{% endblock %}
		</div>
		<div class="panel-footer">
			{% block footer %}
			{% endblock %}
		</div>
	</article>

</div>