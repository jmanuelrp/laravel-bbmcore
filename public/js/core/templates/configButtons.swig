{% set _clases = clases|default("btn-default") %}

<div class="btn-group">
	<button 
		type="button"
		class="btn {{_clases}} dropdown-toggle"
		data-toggle="dropdown">
		<i class="glyphicon glyphicon-cog"></i>
	</button>
	<ul class="dropdown-menu" role="menu">
		<li><a>Action</a></li>
		<li><a>Another action</a></li>
		<li><a>Something else here</a></li>
		<li class="divider"></li>
		<li><a>Separated link</a></li>
	</ul>
</div>