<div class="card">
	<div class="card-header action-header ch-alt m-b-20">
		{% block title %}
			<h2>
				{{ title }}
				<small>{{ subtitle }}</small>
			</h2>
		{% endblock %}
		<div class="ah-search">
			<input type="search" placeholder="Buscar..." class="ahs-input inp-search">

			<i class="ahs-close" data-ma-action="action-header-close">&times;</i>
		</div>
		<ul class="actions" style="z-index: 14">
			{% block actions %}
				<li>
					<a class="cursor-pointer" data-ma-action="action-header-open">
						<i class="zmdi zmdi-search"></i>
					</a>
				</li>
				<li>
					<a class="cursor-pointer btn-reload">
						<i class="zmdi zmdi-refresh-alt"></i>
					</a>
				</li>
				{# <li>
					<a class="cursor-pointer">
						<i class="zmdi zmdi-download"></i>
					</a>
				</li> #}
			{% endblock %}
			{% block dropdown-menu %}
				<li class="dropdown">
					<a href="" data-toggle="dropdown">
						<i class="zmdi zmdi-menu"></i>
					</a>

					<ul class="dropdown-menu dropdown-menu-right">
						{% block menu %}
						{% endblock %}
					</ul>
				</li>
			{% endblock %} {# /dropdown-menu #}
		</ul>

		{% block button %}
			<button class="btn bgm-red btn-float waves-effect btn-new">
				<i class="zmdi zmdi-plus"></i>
			</button>
		{% endblock %}
	</div>

	{% block content-container %}
		<div class="card-body">
			<div class="collection-form item-hidden"></div>

			{% block content-header %}
			{% endblock %}

			{% block content %}
				<div class="collection-main"></div>
			{% endblock %}

			{% block content-footer %}
				<div class="pagination-region clearfix"></div>
			{% endblock %}
		</div>
	{% endblock %}
</div>
