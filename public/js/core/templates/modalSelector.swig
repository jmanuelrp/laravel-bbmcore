<!-- Modal Default -->
<div class="modal-dialog">
	<div class="card">
		<div class="modal-main">
			{% autoescape false %}
				{{ content }}
			{% endautoescape %}
		</div>

		<div class="card-footer modal-footer {% if hide_footer == 1 %}item-hidden{% endif %}"></div>
	</div>
</div>
