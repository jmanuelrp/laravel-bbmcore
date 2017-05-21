define([
	'core/app'
], function (App) {

	var PaginationControls = App.ItemView.extend({
		page_radio: 3,

		tagName: 'nav',

		className: 'core-pagination-controls',

		template: 'core::paginationControlsMaterial',

		ui: {
			next: '.btn-pagination-next',
			prev: '.btn-pagination-prev',
			last: '.btn-pagination-last',
			first: '.btn-pagination-first',
			lbl_page: '.lbl-page',
			lbl_pages: '.lbl-pages',
		},

		events: {
			'click @ui.next': 'onClickNext',
			'click @ui.prev': 'onClickPrev',
			'click @ui.last': 'onClickLast',
			'click @ui.first': 'onClickFirst',
			'click .btn-go-page': 'onClickGoPage'
		},

		collectionEvents: {
			'add remove reset': 'render',
			'paginated:change:page': 'render',
			'paginated:change:numPages': 'render'
		},

		serializeData: function () {
			var pages = [],
			    page_radio = this.getOption('page_radio'),
			    page = this.collection.getPage() + 1,
			    no_pages = this.collection.getNumPages();

			var left_index = page - page_radio,
			    right_index = page + page_radio;

			switch (true) {
				case left_index < 1 && right_index > no_pages:
					pages = _.range(1, no_pages + 1);
					break;
				case left_index < 1:
					pages = _.range(1, page + (left_index * -1) + 2);
					break;
				case right_index > no_pages:
					pages = _.range(page - (right_index - no_pages), no_pages + 1);
					break;
				default:
					pages = _.range(left_index, right_index + 1);
			}

			var total = this.collection.superset().length,
				per_page = this.collection.getPerPage(),
				begin = (page - 1) * per_page,
				end = page * per_page;

			return {
				items_name: this.getOption('items_name'),
				pages: pages,
				no_pages: no_pages,
				page: page,
				per_page: per_page,
				in_page: this.collection.length,
				total: total,
				begin: begin + 1,
				end: end > total ? total : end
			};
		},

		onClickGoPage: function (e) {
			var page = e.currentTarget.dataset.page;

			this.collection.setPage(parseInt(page) - 1);
		},

		onChangePage: function () {
			this.ui.lbl_page.text(this.collection.getPage() + 1);
		},

		onChangeNumPages: function () {
			this.ui.lbl_pages.text(this.collection.getNumPages());
		},

		onClickNext: function (e) {
			this.collection.nextPage();
		},

		onClickPrev: function (e) {
			this.collection.prevPage();
		},

		onClickLast: function (e) {
			this.collection.lastPage();
		},

		onClickFirst: function (e) {
			this.collection.firstPage();
		}
	});

	return PaginationControls;
});
