<div class="panel panel-slim panel-default">
	<div class="panel-heading ui-draggable-handle">
		<h5 class="panel-title">
			{% block title %}
			{% endblock %}
		</h5>
		<ul class="panel-controls">
			{% block tools %}
				<li><a class="pli-expand"><span class="fa fa-plus"></span></a></li>
			{% endblock %}
		</ul>
	</div>
	<div class="panel-body item-hidden">
		{% block content %}
		{% endblock %}
	</div>
</div>
