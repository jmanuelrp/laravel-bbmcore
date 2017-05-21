<div class="pli-selector pull-left">
	<i class="fa fa-circle-o pli-normal"></i>
	<i class="fa fa-check-circle-o pli-ok" title="Seleccionar"></i>
	<i class="fa fa-times-circle-o pli-remove" title="Remover"></i>
</div>
<div class="pli-content clearfix">
	{% set _itemTemplate = '../' + itemTemplate + '.swig' %}
	{% include _itemTemplate with item only %}
</div>
