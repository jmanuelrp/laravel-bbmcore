<!-- Modal Default -->
<div class="modal-dialog {{ modal_type|default('') }}">
	<div class="modal-content">
		<div class="modal-header">
			{% if closable == 1 %}
				<button
					type="button"
					class="close"
					data-dismiss="modal"
					aria-hidden="true">
					×
				</button>
			{% endif %}
			<h4 class="modal-title">
				{% autoescape false %}
					{{ title }}
				{% endautoescape %}
			</h4>
		</div>
		<div class="modal-body modal-main">
			{% autoescape false %}
				{{ content }}
			{% endautoescape %}
		</div>
		{% if hide_footer == 1 %}
			<div class="modal-footer item-hidden"></div>
		{% else %}
			<div class="modal-footer"></div>
		{% endif %}
	</div>
</div>
