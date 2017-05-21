<div class="row">
	<div class="col-xs-12">
		<small><span class="pl-lbl-count">0</span> seleccionado(s)</small>

		<div class="pl-right-controls pull-right">

			{% if no_filters > 0 %}
				<div class="pl-search-container">
					<div class="input-group input-group-sm">
						<input type="search" class="form-control pl-inp-search" placeholder="Busqueda">
						<span class="input-group-btn">
							<button type="button" class="btn btn-default"><i class="fa fa-search"></i></button>
						</span>
					</div>
				</div>
			{% endif %}

			{% if refresh_btn == 1 %}
				{% include "../core::btnReload.swig" with { reloadClass: 'btn-sm' } only %}
			{% endif %}

			<button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
				<i class="fa fa-cog"></i>
			</button>
			<ul class="dropdown-menu pull-right">
				<li><a class="pl-show-selection">Mostrar seleccion</a></li>
				<li><a class="pl-show-all">Mostrar todo</a></li>
				<li><a class="pl-clear-selection">Cancelar seleccion</a></li>
				{% if mode == 'multiple' %}
					<li><a class="pl-select-all">Seleccionar todo</a></li>
				{% endif %}
			</ul>

		</div> <!-- /.pl-right-controls -->
	</div> <!-- /.col-xs-12 -->
</div> <!-- /.row -->

<div class="row item-separator"></div>
<div class="pl-container-region"></div>
<div class="pl-pagination-region"></div>
