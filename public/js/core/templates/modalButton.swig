{% set _title = title||label %}

<button type="button" class="btn btn-{{type}} {{class_name}}" title="{{_title}}">
	{{label}} <span class="glyphicon glyphicon-{{icon}}"></span>
</button>
