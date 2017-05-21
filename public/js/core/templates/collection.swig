<nav class="navbar navbar-slim" role="navigation">
	<div class="container-fluid">
		<!-- Brand and toggle get grouped for better mobile display -->
		{# <div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
				<span class="sr-only">Menu</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand">
				{% block title %}
				{% endblock %}
			</a>
		</div> #}

		<!-- Collect the nav links, forms, and other content for toggling -->
		{# <div class="navbar-collapse"> #}

			{% block title %}
			{% endblock %}

			<div class="btn-group navbar-btn">
				{% block button %}
					<button class="btn btn-danger btn-new">
						Nuevo
					</button>
				{% endblock %}
			</div>

			{% block filtergroup %}
				<div class="btn-group navbar-btn">
					{# <button  data-filter-attr="none" class="btn btn-default btn-filter">Todos</button> #}
					{% block filters %}
					{% endblock %}
				</div>
			{% endblock %}

			{% block nav-content %}{% endblock %}

			<div class="btn-group navbar-btn navbar-right">
				{% block extra-buttons %}
				{% endblock %}
				{% block dropdown-menu %}
				<button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
					<i class="glyphicon glyphicon-cog"></i> <span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
					{% block menu %}
						<li>
							<a class="btn-exportar">
								<span class="glyphicon glyphicon-cloud-download"></span>
								Imprimir a PDF
							</a>
						</li>
					{% endblock %}
				</ul>
				{% endblock %}
			</div><!-- /.btn-group pull-rights -->

			{% block nav-right-content %}{% endblock %}

		{# </div><!-- /.navbar-collapse --> #}
	</div><!-- /.container-fluid -->
</nav>
{% block content-container %}
	<div class="collection-form item-hidden"></div>
	{% block content-header %}
	{% endblock %}
	<div class="collection-main">
		{% block content %}
		{% endblock %}
	</div>
	{% block content-footer %}
		<div class="pagination-region"></div>
	{% endblock %}
{% endblock %}
