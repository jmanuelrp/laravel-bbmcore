{% set _expandable_ = rp_expandable|default(1)==1 %}
{% set _set_expanded_ = rp_expanded|default(!_ctx._expandable_)==1 %}

<div class="rpanel rpanel-show color-panel"> {# .expanded #}
	<div class="rp-header">
		<div class="rp-buttons clearfix item-hidden">
			{% block actions %}
			{% endblock %}
		</div>
		<div class="rp-toolbar clearfix">
		   <div class="row">
		        <div class="col-md-12">
			        <div class="rp-tool-right pull-right">
				{% block right_tools %}
					{% block link %}
					{% endblock %}
					<div class="btn btn-default tool-toggle-actions btn-show-actions">
						<span class="glyphicon glyphicon-cog"></span>
					</div>
				{% endblock %}
			</div>
			    </div>
	       </div>
		   <div class="row"> 
			 	{% block content %}
			 	{% endblock %}
		   </div>
		</div>
	</div>
</div>
