{% block left-item %}{% endblock %}

{% block menu-container %}
	<div class="pull-right">
		<div class="actions dropdown">
			<a href="" data-toggle="dropdown" aria-expanded="true">
				<i class="zmdi zmdi-menu"></i>
			</a>

			<ul class="dropdown-menu dropdown-menu-right">
				{% block menu %}
					<li>
						<a class="btn-edit">Editar</a>
					</li>
					<li>
						<a class="btn-remove">Eliminar</a>
					</li>
				{% endblock %}
			</ul>
		</div>
	</div>
{% endblock %}

<div class="media-body row">
	{% block content %}{% endblock %}
</div>

{% block content-extra %}{% endblock %}
