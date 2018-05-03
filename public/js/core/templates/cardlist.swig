<div class="card">
	{% block header %}
		<div class="action-header clearfix">
			{% block button %}
			{% endblock %}

			<div class="ah-search" style="display: none;">
				<input type="text" placeholder="Buscar..." class="ahs-input inp-search">

				<i class="ahs-close" data-ma-action="action-header-close">×</i>
			</div>

			<ul class="actions">
				{% block actions %}
					<li>
						<a class="btn-reload">
							<i class="zmdi zmdi-refresh-alt"></i>
						</a>
					</li>
					<li>
						<a href="" data-ma-action="action-header-open">
							<i class="zmdi zmdi-search"></i>
						</a>
					</li>
					{# <li class="dropdown">
						<a href="" data-toggle="dropdown" aria-expanded="true">
							<i class="zmdi zmdi-sort"></i>
						</a>

						<ul class="dropdown-menu dropdown-menu-right">
							<li>
								<a href="">Nombre</a>
							</li>
							<li>
								<a href="">Monto</a>
							</li>
							<li>
								<a href="">Fecha</a>
							</li>
						</ul>
					</li> #}
				{% endblock %}
			</ul>
		</div>
	{% endblock %}

	{% block form %}
		<div class="collection-form list-group lg-odd-black item-hidden"></div>
	{% endblock %}

	{% block content-header %}
	<div class="list-group">
		<div class="list-group-item media hidden-xs">
			<div class="row media-body {{ _media_body_class_ }}">
				{% block headers %}
				{% endblock %}
			</div>
		</div>
	</div>
	{% endblock %}

	<div class="collection-main list-group lg-odd-black"></div>

	{% block footer %}
		<div class="pagination-region clearfix"></div>
	{% endblock %}
</div>
