frappe.pages['chat'].on_page_load = function(wrapper) {
	// use jquery to set the bottom padding of div with class main-section to 0
	$('.main-section').css({
		'padding-bottom': '0px'
	});

	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Chat',
		single_column: true
	});
	let iframe = `<iframe src="/raven" style="width: 100%; min-height: calc(100vh - 54px); border: none;"></iframe>`;
	$(page.body).css({
		'scrollbar-gutter': 'auto'
	}).html(iframe);
	$('.page-head.flex').css({
		'display': 'none'
	});
}

frappe.pages['chat'].on_page_show = function(wrapper) {
}
