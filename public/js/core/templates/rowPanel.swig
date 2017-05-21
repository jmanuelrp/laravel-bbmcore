{% set _expandable_ = rp_expandable|default(1)==1 %}
{% set _set_expanded_ = rp_expanded|default(!_ctx._expandable_)==1 %}

<div class="rpanel rpanel-show animated"> {# .expanded #}
	<div class="rp-header">
		<div class="rp-buttons clearfix item-hidden">
			{% block actions %}
				<div class="pull-right">
					<button type="button" class="btn btn-link btn-edit btn-primary">Editar</button>
					<button type="button" class="btn btn-link btn-remove btn-danger">Eliminar</button>
				</div>
			{% endblock %}
		</div>
		<div class="rp-toolbar animated clearfix">
			<div class="rp-tool-left pull-left">
				{% block left_tools %}
				{% if _expandable_ %}
					<a class="btn btn-link btn-icon btn-toggle-details">
						<i class="zmdi animated {% if _set_expanded_ %}zmdi-minus{% else %}zmdi-plus{% endif %}"></i>
					</a>
					{# <div class="rp-item-tool tool-toggle-details">
						<i class="glyphicon {% if _set_expanded_ %}glyphicon-minus-sign{% else %}glyphicon-plus-sign{% endif %}"></i>
					</div> #}
				{% endif %}
				{% endblock %}
			</div>
			<div class="rp-tool-right pull-right">
				{% block right_tools %}
					{# {% block link %}
					{% endblock %} #}
					<a class="btn btn-link btn-icon btn-show-actions">
						<i class="zmdi zmdi-menu animated"></i>
					</a>
					{# <div class="btn btn-sm btn-default waves-effect tool-toggle-actions btn-show-actions">
						<i class="fa fa-cog"></i>
					</div> #}
				{% endblock %}
			</div>
			<div class="rp-tool-body">
			 	{% block tool-body %}
				<div class="rp-title visible-xs">
					{% block title %}
					{% endblock %}
				</div>
				<div class="rp-titles hidden-xs">
					{% block titles %}
					{% endblock %}
				</div>
			 	{% endblock %}
			</div>
		</div>
	</div>

	<div class="rp-body {% if not _set_expanded_ == 1 %}item-hidden{% endif %}">
	{% block body %}
		<div class="rp-separator"></div>
		<div class="container-fluid">
			{% block content %}
			{% endblock %}
		</div>
	{% endblock %}
	</div>

	<div class="rp-footer">
		{% block footer %}
		{% endblock %}
	</div>
</div>
