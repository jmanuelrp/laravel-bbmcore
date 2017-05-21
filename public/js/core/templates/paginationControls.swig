<div class="pull-left">
</div>
<div class="pull-right">
	<span class="btn disabled btn-link">
		{{ total }} {{ items_name|default('elementos') }}
	</span>
	<div class="btn-group btn-group-sm">
<button type="button" class="btn btn-default {% if page > 1 %}btn-pagination-first disable{% endif %}">
			<i class="fa fa-angle-double-left"></i>
		</button>
	<button type="button" class="btn btn-default {% if page > 1 %}btn-pagination-prev disable{% endif %}">
			<i class="fa fa-angle-left"></i>
		</button>

		{% for _page in pages %}
			<button
				type="button"
				class="btn btn-default {% if _page == page %}active{% else %}btn-go-page{% endif %}"
				data-page="{{ _page }}">
				{{ _page }}
				{% if _page == page %}
					/ {{ no_pages }}
				{% endif %}
			</button>
		{% endfor %}

		{# <button type="button" class="btn btn-default" disabled>
			<span class="lbl-page">{{ page + 1 }}</span> / <span class="lbl-pages">{{ no_pages }}</span>
		</button> #}

	<button type="button" class="btn btn-default {% if no_pages > page %}btn-pagination-next disable{% endif %}">
			<i class="fa fa-angle-right"></i>
		</button>
	<button type="button" class="btn btn-default {% if no_pages > page %}btn-pagination-last disable{% endif %}">
			<i class="fa fa-angle-double-right"></i>
		</button>
	</div>
</div>
