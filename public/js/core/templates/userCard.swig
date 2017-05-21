<div class="pull-left image">
	<img src="/img/avatar5.png" class="img-circle" alt="User Image" />
</div>
<div class="pull-left info">
	<p>{{nombre}} {{paterno}}</p>

	{% if tipo == 'alumno' %}
		<a><i class="fa fa-circle text-{{alumno.status}}"></i> {{alumno.status|capitalize}}</a>
	{% else %}
		<a>{{tipo|capitalize}}</a>
	{% endif %}
</div>
