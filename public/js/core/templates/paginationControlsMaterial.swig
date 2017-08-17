<span class="p-10 pull-left">
	{% if no_pages > 1 %}
		{{ begin }} - {{ end }} |
	{% endif %} {{ in_page }} de {{ total }} {{ items_name|default('elementos') }}
</span>
<div class="pull-right">
	<ul class="pagination">
		<li>
			<a class="{% if page > 1 %}btn-pagination-first waves-effect{% endif %}">
				<i class="fa fa-angle-double-left"></i>
			</a>
		</li>
		<li>
			<a class="{% if page > 1 %}btn-pagination-prev waves-effect{% endif %}">
				<i class="zmdi zmdi-chevron-left"></i>
			</a>
		</li>
		{% for _page in pages %}
			<li class="{% if _page == page %}active{% endif %}">
				<a class="{% if _page != page %}btn-go-page waves-effect{% endif %}" data-page="{{ _page }}">
					{{ _page }}
					{% if _page == page %}
						<small class="f-10">/{{ no_pages }}</small>
					{% endif %}
				</a>
			</li>
		{% endfor %}
		<li>
			<a class="{% if no_pages > page %}btn-pagination-next waves-effect{% endif %}">
				<i class="zmdi zmdi-chevron-right"></i>
			</a>
		</li>
		<li>
			<a class="{% if no_pages > page %}btn-pagination-last waves-effect{% endif %}">
				<i class="fa fa-angle-double-right"></i>
			</a>
		</li>
	</ul>
</div>
