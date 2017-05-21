<div class="single-item">

	{% if not hidebar %}
	<nav class="navbar navbar-toolbar navbar-default">
		<div class="btn-toolbar" role="toolbar">
			
			<a class="navbar-brand">
				{% block title %}
				{% endblock %}
			</a>

			<div class="btn-group">
				{% block actions %}
				{% endblock %}
			</div>

			{% block navcontent %}
			{% endblock %}

			<div class="btn-group pull-right">
				{% block menu %}
				<button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
					<i class="glyphicon glyphicon-cog"></i> <span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
					{% block menuoptions %}
						<li><a href="exportar">Imprimir a PDF</a></li>
					{% endblock %}
				</ul>
				{% endblock %}
			</div>
		</div>
	</nav>
	{% endif %}

	<article class="single-content">
		{% block content %}
		{% endblock %}
	</article>

</div>