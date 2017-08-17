	<div class="card-header action-header">
		<h2>
			{{ title }}
			<small><span class="lbl-count">0</span> seleccionado(s)</small>
		</h2>
		<form class="ah-search form-search">
			<input type="search" placeholder="Buscar..." class="ahs-input inp-search">

			<i class="ahs-close" data-ma-action="action-header-close">&times;</i>
		</form>
		<ul class="actions">
			{% if refresh_btn == 1 %}
				<li>
					<a class="btn-reload cursor-pointer">
						<i class="zmdi zmdi-refresh-alt"></i>
					</a>
				</li>
			{% endif %}
			{% if no_filters > 0 %}
				<li>
					<a class="cursor-pointer btn-search" data-ma-action="action-header-open">
						<i class="zmdi zmdi-search"></i>
					</a>
				</li>
			{% endif %}
			<li class="dropdown">
				<a href="" data-toggle="dropdown">
					<i class="zmdi zmdi-menu"></i>
				</a>

				<ul class="dropdown-menu dropdown-menu-right">
					<li class="show-selection"><a>Mostrar seleccion</a></li>
					<li class="show-all"><a>Mostrar todo</a></li>
					<li class="clear-selection"><a>Cancelar seleccion</a></li>
					{% if mode == 'multiple' %}
						<li class="select-all"><a>Seleccionar todo</a></li>
					{% endif %}
				</ul>
			</li>
			<li>
				<a class="cursor-pointer" data-dismiss="modal">
					<i class="zmdi zmdi-close"></i>
				</a>
			</li>
		</ul>
	</div>

	<div class="container-region"></div>
	<div class="pagination-region clearfix"></div>
