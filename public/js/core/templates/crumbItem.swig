{% set _title = title || cname  %}
<a title="{{ _title|title }}" href="{{ link }}">
	{% autoescape false %}{{label}}{% endautoescape %}
</a>
