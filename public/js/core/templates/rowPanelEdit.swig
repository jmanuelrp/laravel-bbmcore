<div class="rpanel rpanel-edit">
	<div class="rp-header">
		<div class="rp-buttons clearfix">
			{% block actions %}
				<div class="pull-right">
					<button type="button" class="btn btn-link btn-success btn-save" title="Guardar">
						Registrar
					</button>
					<button type="button" class="btn btn-link btn-default btn-cancel" title="Cancelar">
						Cancelar
					</button>
				</div>
			{% endblock %}
		</div>
		<div class="rp-toolbar clearfix">
			<div class="rp-title">
				{% block title %}
				{% endblock %}
			</div>
		</div>
	</div>

	<div class="rp-body">
		<div class="container-fluid">
			{% block content %}
			{% endblock %}
		</div>
	</div>

	<div class="rp-footer">
		{% block footer %}
		{% endblock %}
	</div>
</div>
